import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import compression from 'compression';
import express from 'express';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';
import { schemes } from '../src/schemes.ts';

const app = express();
app.use(compression());
const port = Number(process.env.PORT || 8787);
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024, files: 1 } });
const allowedTypes = new Set(['application/pdf', 'image/jpeg', 'image/png']);

app.get('/api/health', (_req, res) => res.json({ ok: true, geminiConfigured: Boolean(process.env.GEMINI_API_KEY) }));

app.post('/api/analyze-document', upload.single('file'), async (req, res) => {
  const scheme = schemes.find((item) => item.id === req.body.schemeId) || schemes[0];
  if (!scheme) return res.status(400).json({ error: 'Choose a supported scheme record.' });
  const file = req.file;
  if (!file || !allowedTypes.has(file.mimetype)) {
    return res.status(400).json({ error: 'Upload a PDF, JPG, or PNG file.' });
  }

  const appType = req.body.applicationType === 'renewal' ? 'renewal' : req.body.applicationType === 'fresh' ? 'fresh' : 'both';
  const relevantDocs = scheme.documents.filter((doc) => appType === 'both' || doc.category === 'both' || doc.category === appType);
  const requiredFields = Array.from(new Set(relevantDocs.flatMap((document) => document.fields)));
  const responseLanguage = req.body.language === 'hi' ? 'Hindi' : 'English';
  if (!process.env.GEMINI_API_KEY) {
    return res.json({
      demoMode: true,
      result: {
        document_type: responseLanguage === 'Hindi' ? 'नहीं पढ़ा गया — नमूना नतीजा' : 'Not analyzed — sample result',
        readable: false,
        fields_found: [],
        missing_information: requiredFields,
        evidence_quote: '',
        page_number: null,
        needs_human_review: true,
        explanation: responseLanguage === 'Hindi'
          ? 'Gemini कॉन्फ़िगर नहीं है। यह केवल नमूना है; अपलोड की गई फ़ाइल पढ़ी नहीं गई।'
          : 'Gemini is not configured. This sample shows the result format; your uploaded file was not analyzed.',
      },
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `Review only the attached file against this checklist; do not rely on outside context. This is a document readability and checklist aid only. Do not decide official eligibility, authenticity, validity, or acceptance. If a field is unclear, do not mark it present and set needs_human_review true. Return a brief verbatim evidence_quote for any found fields, otherwise an empty string. Keep fields_found and missing_information in the exact English checklist wording. Write document_type and explanation in ${responseLanguage}. Checklist fields: ${JSON.stringify(requiredFields)}. Return exactly: document_type (string), readable (boolean), fields_found (string array chosen only from the checklist), missing_information (string array chosen only from the checklist), evidence_quote (string, at most 300 characters), page_number (positive integer or 0 if unknown), needs_human_review (boolean), explanation (short string).`;
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
      contents: [
        { text: prompt },
        { inlineData: { mimeType: file.mimetype, data: file.buffer.toString('base64') } },
      ],
      config: {
        responseMimeType: 'application/json',
        responseJsonSchema: {
          type: 'object',
          properties: {
            document_type: { type: 'string' },
            readable: { type: 'boolean' },
            fields_found: { type: 'array', items: { type: 'string' } },
            missing_information: { type: 'array', items: { type: 'string' } },
            evidence_quote: { type: 'string' },
            page_number: { type: 'integer' },
            needs_human_review: { type: 'boolean' },
            explanation: { type: 'string' },
          },
          required: ['document_type', 'readable', 'fields_found', 'missing_information', 'evidence_quote', 'page_number', 'needs_human_review', 'explanation'],
          additionalProperties: false,
        },
      },
    });
    const raw = response.text;
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    if (!isValidResult(parsed, requiredFields)) {
      return res.json({ demoMode: false, result: needsReview(requiredFields, 'The analysis could not be safely verified. Please review the document with a person.') });
    }
    const result = parsed as AnalysisResult;
    if (result.page_number === 0) result.page_number = null;
    if (!result.readable || result.needs_human_review) result.needs_human_review = true;
    return res.json({ demoMode: false, result });
  } catch {
    return res.status(502).json({ error: 'Document analysis could not be completed. Please try again or review it with a person.' });
  }
});

type AnalysisResult = {
  document_type: string;
  readable: boolean;
  fields_found: string[];
  missing_information: string[];
  evidence_quote: string;
  page_number: number | null;
  needs_human_review: boolean;
  explanation: string;
};

function isValidResult(value: unknown, allowed: string[]): value is AnalysisResult {
  if (!value || typeof value !== 'object') return false;
  const result = value as Record<string, unknown>;
  const str = (key: string, limit: number) => typeof result[key] === 'string' && (result[key] as string).length <= limit;
  const array = (key: string) => Array.isArray(result[key]) && (result[key] as unknown[]).length <= allowed.length && (result[key] as unknown[]).every((item) => typeof item === 'string' && allowed.includes(item));
  return str('document_type', 120) && str('explanation', 500) && str('evidence_quote', 300)
    && typeof result.readable === 'boolean' && typeof result.needs_human_review === 'boolean'
    && array('fields_found') && array('missing_information')
    && (result.page_number === null || (Number.isInteger(result.page_number) && Number(result.page_number) >= 0 && Number(result.page_number) <= 500));
}

function needsReview(missing: string[], explanation: string): AnalysisResult {
  return { document_type: 'Needs human review', readable: false, fields_found: [], missing_information: missing, evidence_quote: '', page_number: null, needs_human_review: true, explanation };
}

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ error: 'The file is too large. Maximum size is 5 MB.' });
  return res.status(400).json({ error: 'The file could not be processed. Check the file type and try again.' });
});

const distPath = path.resolve(process.cwd(), 'dist');
const indexPath = path.join(distPath, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.log('Frontend build not found. Building production bundle...');
  execSync('npm run build', { stdio: 'inherit' });
}

app.use(express.static(distPath, {
  maxAge: '1h',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    } else if (filePath.includes('assets')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  },
}));

app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    if (path.extname(req.path)) {
      return res.status(404).end();
    }
    return res.sendFile(indexPath);
  }
  next();
});

app.listen(port, () => {
  console.log(`\n==================================================`);
  console.log(`  🚀 FindMyFit running on a single link:`);
  console.log(`  ➜ http://localhost:${port}`);
  console.log(`==================================================\n`);
});
