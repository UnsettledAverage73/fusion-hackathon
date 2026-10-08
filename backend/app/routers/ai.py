from typing import Any, Dict, Optional
from fastapi import APIRouter
from pydantic import BaseModel
from app.services.orchestrator import orchestrator

router = APIRouter()


class OrchestrateRequest(BaseModel):
    prompt: str
    context: Optional[str] = ""


class OrchestrateResponse(BaseModel):
    prompt: str
    route_selected: str
    provider: str
    probabilities: Dict[str, float]
    semif_model: str
    response: str
    latency_ms: float


@router.post(
    "/run",
    response_model=OrchestrateResponse,
    summary="Execute hybrid SemIf -> Groq / Sarvam orchestration",
)
async def run_orchestration(payload: OrchestrateRequest) -> OrchestrateResponse:
    """
    1. Evaluates candidate logits via SemIf (Zero-Token Decision)
    2. Routes to Groq (Deep Reasoning) or Sarvam (Indic Multilingual)
    3. Returns probabilities, provider tag, and output text
    """
    result = await orchestrator.orchestrate(prompt=payload.prompt, context=payload.context or "")
    return OrchestrateResponse(**result)
