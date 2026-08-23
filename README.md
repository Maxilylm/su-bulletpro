# BulletPro

> Rewrite resume bullet points against a specific job description for ATS keyword match.

**[Live demo](https://su-bulletpro.vercel.app)**

Generic resume bullets get filtered by applicant tracking systems before a human reads them. BulletPro takes the job description you're applying to alongside your raw bullets and returns rewrites that lead with strong action verbs, carry quantified metrics, and work in keywords pulled from the posting. Each rewrite sits next to its original with an explicit list of what changed and which keywords were added, so you can accept or reject the edit rather than trusting it blind.

## Features

- Paste a full job description plus up to 20 bullet points per run
- Side-by-side original and optimized versions of every bullet
- Per-bullet change log and a list of the keywords injected
- Overall ATS match score from 0 to 100 for the rewritten set
- Top keywords extracted from the job description
- Copy any optimized bullet to the clipboard

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4
- Groq API — `llama-3.3-70b-versatile` in JSON response mode

## Running locally

```bash
npm install
npm run dev
```

Set `GROQ_API_KEY` in `.env.local`.

---

Part of a series of 91 small web apps. [Browse them all](https://su-slopmachine.vercel.app).
