from fastapi import APIRouter, UploadFile, File, Form
from typing import Optional
from app.model import analyze_code

router = APIRouter()

@router.post("/analyze")
async def analyze(
    file: UploadFile = File(...),
    mode: Optional[str] = Form(default="explain")
):
    try:
        code = await file.read()
        text = code.decode("utf-8", errors="ignore")
        result = analyze_code(text, mode=mode, filename=file.filename or "")
        return result
    except Exception as e:
        return {"error": str(e), "analysis": "Error: " + str(e), "language": "Unknown", "mode": mode, "lines": 0, "characters": 0}
