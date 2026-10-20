# JanSahay

JanSahay is a hackathon prototype for exploring possible government-benefit matches, understanding requirements, checking document readiness, and preparing an editable application draft.

**This is not a government service.** The bundled Student learning support record and its eligibility rules are invented demo data. It does not represent a real scheme, benefit, payment, official source, or application form. JanSahay never submits an application. The only external link is the separate official myScheme catalogue, where people can search real schemes.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Setup

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The API runs on port `8787` and Vite forwards `/api` requests to it.

### Optional Gemini document analysis

The app works without an API key. Without `GEMINI_API_KEY`, uploading a sample produces a conspicuously labeled example result; the uploaded content is **not** analyzed. The interface explains that the file is sent to Google's Gemini API only when the live analysis is configured and the user selects the analysis action.

To use the live document-reading endpoint, add your key only to the server-side `.env` file:

```dotenv
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-3.8-flash
PORT=8787
```

The server uses Google's official `@google/genai` JavaScript SDK. `GEMINI_MODEL` is optional; the same model name is the server fallback. Never put the key in a `VITE_` variable or browser code. The server accepts a single PDF/JPG/PNG up to 5 MB, keeps it in memory for the request, and does not write it to disk. Gemini's configured API receives the document when live analysis is enabled. The response is checked against the selected demo record's known checklist fields, and an uncertain or malformed response becomes “Needs human review.”

## Build

```powershell
npm run build
```

Run everything with a single link using `npm start` (serves both the web UI and API together at [http://localhost:8787](http://localhost:8787)). If the frontend has not yet been built, it will automatically build it first. For development with hot reloading, use `npm run dev`.

## Demo script

1. Choose English or Hindi, then select **Try the sample journey**.
2. Review the sample student profile and continue to the one fictional demo record. It first says **Need more information** because the scheme-specific enrolment question has not been answered.
3. Open the record, answer the current-enrolment question, and see the rule-based status update. Review the fictional criteria and document list.
4. Optionally upload a sample PDF/JPG/PNG. With no API key, inspect the labeled example result. With a key, inspect the AI reading aid and its review caveat.
5. Review and edit the application draft. Required blanks are highlighted. Select **Browse official scheme catalogue** to open myScheme; that catalogue link is not an application link for the fictional demo.
6. Use **Reset demo** to clear the session state and selected file.

## Notes and limits

- Only one clearly labeled demo record is bundled. Its rules are transparent application code, separate from Gemini.
- Profile questions are configurable in code. The basic profile asks for age range, group, state, optional district, and optional preferred name. It does not ask for Aadhaar, bank information, or passwords.
- Scheme details and the sample checklist are English/Hindi interface copy. This does not mean any real scheme documents have been translated.
- Document analysis is a reading aid, not a check of document authenticity, official validity, acceptance, or scheme eligibility.
- There is no account, database, permanent upload storage, real scheme data, official application form, or submission flow.
