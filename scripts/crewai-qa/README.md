# CrewAI Code Review & QA Team

This script creates an AI-powered team comprising a **Senior Next.js Developer** and a **QA Specialist** relying on Google's generous/free Gemini API.

## Setup

1. Copy `.env.example` to `.env` inside this folder.
2. Add your Free Gemini API Key (obtained from [Google AI Studio](https://aistudio.google.com/app/apikey)) to the `.env` file!

## Installation

Ensure you have Python 3.10+ installed.

```bash
# Inside scripts/crewai-qa/
pip install -r requirements.txt
```

## Running the QA Checklist

To review a specific file in your project:
```bash
python main.py ../../package.json
```
or 
```bash
python main.py ../../src/app/page.tsx
```

The script will save the results as `audit_report_for_page.tsx.md` (or similar) in the script directory.
