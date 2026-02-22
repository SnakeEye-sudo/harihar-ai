"""
HariHar (हरिहर) - BharatGen Param-1 powered Indian AI Backend
Author: SnakeEye-sudo
Model: bharatgenai/Param-1-2.9B-Instruct
License: MIT
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from transformers import AutoModelForCausalLM, AutoTokenizer
from typing import List, Optional
import torch
import logging

# ─── Logging ───────────────────────────────────────────────────────────────────
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("HariHar")

# ─── Model config ──────────────────────────────────────────────────────────────
MODEL_NAME = "bharatgenai/Param-1-2.9B-Instruct"

# ─── FastAPI app ───────────────────────────────────────────────────────────────
app = FastAPI(
    title="HariHar AI Backend",
    description="Multilingual Indian AI powered by BharatGen Param-1",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Load model on startup ─────────────────────────────────────────────────────
logger.info(f"Loading model: {MODEL_NAME}")
try:
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, trust_remote_code=True)
    model = AutoModelForCausalLM.from_pretrained(
        MODEL_NAME,
        torch_dtype=torch.float16,
        device_map="auto",
        trust_remote_code=True,
    )
    model.eval()
    logger.info("Model loaded successfully.")
except Exception as e:
    logger.error(f"Model load failed: {e}")
    tokenizer = None
    model = None

# ─── System prompt ─────────────────────────────────────────────────────────────
SYSTEM_PROMPT = (
    "You are HariHar (हरिहर), an intelligent and culturally aware Indian AI assistant. "
    "You are built on BharatGen's Param-1 foundation model. "
    "You understand and respond fluently in Hindi, English, Hinglish and other Indian languages. "
    "Be helpful, honest, concise and respectful of Indian culture and values. "
    "If asked in Hindi, reply in Hindi. If asked in English, reply in English. "
    "If asked in Hinglish, reply in Hinglish. "
)

# ─── Schemas ───────────────────────────────────────────────────────────────────
class ChatRequest(BaseModel):
    message: str
    history: Optional[List[str]] = []
    max_new_tokens: Optional[int] = 256
    temperature: Optional[float] = 0.7
    top_p: Optional[float] = 0.9

class ChatResponse(BaseModel):
    reply: str
    model: str = MODEL_NAME

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool

# ─── Routes ────────────────────────────────────────────────────────────────────
@app.get("/", response_model=HealthResponse)
def root():
    return HealthResponse(
        status="HariHar is running!",
        model_loaded=(model is not None)
    )

@app.get("/health", response_model=HealthResponse)
def health():
    return HealthResponse(
        status="ok",
        model_loaded=(model is not None)
    )

@app.post("/api/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    if model is None or tokenizer is None:
        raise HTTPException(
            status_code=503,
            detail="Model not loaded. Check server logs."
        )

    # Build prompt
    history_text = ""
    for turn in (req.history or [])[-6:]:
        history_text += f"{turn}\n"

    prompt = (
        f"{SYSTEM_PROMPT}\n"
        f"{history_text}"
        f"User: {req.message}\n"
        f"HariHar:"
    )

    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)

    with torch.no_grad():
        output = model.generate(
            **inputs,
            max_new_tokens=req.max_new_tokens,
            do_sample=True,
            temperature=req.temperature,
            top_p=req.top_p,
            pad_token_id=tokenizer.eos_token_id,
        )

    decoded = tokenizer.decode(output[0], skip_special_tokens=True)

    # Extract only the assistant reply
    if "HariHar:" in decoded:
        reply = decoded.split("HariHar:")[-1].strip()
    else:
        reply = decoded[len(prompt):].strip()

    return ChatResponse(reply=reply)
