# HariHar (हरिहर) – BharatGen-powered Indian AI Assistant

![License](https://img.shields.io/badge/license-MIT-green)
![Model](https://img.shields.io/badge/model-Param--1--2.9B--Instruct-blue)
![Languages](https://img.shields.io/badge/languages-Hindi%20%7C%20English%20%7C%20Indic-orange)

HariHar is a multilingual AI assistant designed for India, built on top of **BharatGen**'s Param-1 bilingual foundation models (English + Hindi) and extensible to other Indic languages.

---

## Features

- Text chat interface (Next.js frontend + FastAPI backend)
- Uses `bharatgenai/Param-1-2.9B-Instruct` as the core reasoning model
- Handles Hindi, English, Hinglish and code-mixed Indian queries
- Simple architecture – extend with RAG, voice, domain datasets (BhashaBench, Krishi, Legal)
- MIT Licensed – free for personal, research and commercial use (with attribution)

---

## Project Structure

```
harihar-ai/
  backend/           # FastAPI + BharatGen Param-1-2.9B-Instruct
    main.py
    requirements.txt
  frontend/          # Next.js 14 chat UI
    app/
      layout.tsx
      page.tsx
    package.json
    next.config.mjs
  README.md
  LICENSE
```

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| LLM       | BharatGen Param-1-2.9B-Instruct     |
| Backend   | Python 3.10+, FastAPI, Uvicorn      |
| ML        | Hugging Face Transformers, PyTorch  |
| Frontend  | Next.js 14, React 18, Axios         |
| Deploy    | Vercel (frontend), Railway (backend)|

---

## Local Setup

### 1. Clone the repo

```bash
git clone https://github.com/SnakeEye-sudo/harihar-ai.git
cd harihar-ai
```

### 2. Backend (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

This starts HariHar backend at `http://localhost:8000`.

### 3. Frontend (Next.js)

```bash
cd frontend
npm install
echo "NEXT_PUBLIC_BACKEND_URL=http://localhost:8000" > .env.local
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## Model

HariHar uses BharatGen's **Param-1** family:

- **Param-1-2.9B-Instruct** – bilingual (Hindi + English), India-optimised, instruction-tuned
- HuggingFace: https://huggingface.co/bharatgenai/Param-1-2.9B-Instruct
- BharatGen Org HF: https://huggingface.co/bharatgenai

Always read the **model card + license terms** on Hugging Face before production/commercial deployment.

---

## Roadmap

- [ ] RAG over Indian government schemes, Krishi docs, UPSC notes (BhashaBench datasets)
- [ ] BharatGen TTS (A2TTS-v0.5) integration for Hindi voice output
- [ ] ASR (speech-to-text) for Hindi/Indic voice input
- [ ] Multi-language support: Marathi, Bhojpuri, Gujarati
- [ ] Feedback loop + LoRA fine-tuning pipeline
- [ ] Docker + one-click deploy scripts

---

## Credits

HariHar is built on top of **BharatGen – India's Sovereign AI Initiative**.

- BharatGen Website: https://bharatgen.com
- Param-1 Details: https://bharatgen.com/param-revolutionizing-ai-for-india/
- BharatGen on HuggingFace: https://huggingface.co/bharatgenai
- Datasets used: BhashaBench (CC BY 4.0), MHQA (MIT)

> HariHar project by [SnakeEye-sudo](https://github.com/SnakeEye-sudo) | Powered by BharatGen Param-1
