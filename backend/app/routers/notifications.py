from typing import Any, Dict, Optional
from fastapi import APIRouter
from pydantic import BaseModel
from app.services.slack_notifier import slack_notifier

router = APIRouter()


class SlackAlertRequest(BaseModel):
    title: str
    message: str
    severity: str = "INFO"
    details: Optional[Dict[str, Any]] = None


class SlackAlertResponse(BaseModel):
    delivered: bool
    message: str


@router.post(
    "/slack",
    response_model=SlackAlertResponse,
    summary="Dispatch real-time Slack alert card",
)
def send_slack_notification(payload: SlackAlertRequest) -> SlackAlertResponse:
    """Dispatches a rich Slack Block Kit notification card to configured webhook."""
    delivered = slack_notifier.send_alert(
        title=payload.title,
        message=payload.message,
        severity=payload.severity,
        details=payload.details,
    )
    msg = (
        "Alert successfully delivered to Slack channel."
        if delivered
        else "Slack alert simulated (SLACK_WEBHOOK_URL not configured or placeholder detected)."
    )
    return SlackAlertResponse(delivered=delivered, message=msg)
