import json
import logging
import os
import urllib.request
import urllib.error
from typing import Any, Dict, Optional

logger = logging.getLogger("slack_notifier")


class SlackNotifier:
    """
    Dispatcher for Slack Incoming Webhooks supporting rich Block Kit layout.
    Directly compatible with free Slack App Incoming Webhooks.
    """

    def __init__(self, webhook_url: Optional[str] = None):
        self.webhook_url = webhook_url or os.getenv("SLACK_WEBHOOK_URL")

    def format_slack_payload(
        self,
        title: str,
        message: str,
        severity: str = "INFO",
        details: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Formats alert findings into an attractive Slack Block Kit message."""
        emoji = (
            ":rotating_light:"
            if severity == "CRITICAL"
            else ":warning:"
            if severity == "WARNING"
            else ":zap:"
        )

        blocks: list[Dict[str, Any]] = [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": f"{emoji} {title}",
                    "emoji": True,
                },
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": message,
                },
            },
            {"type": "divider"},
        ]

        if details:
            fields = []
            for key, val in details.items():
                fields.append({
                    "type": "mrkdwn",
                    "text": f"*{key}:*\n`{val}`",
                })
            # Slack sections allow up to 10 fields
            blocks.append({
                "type": "section",
                "fields": fields[:10],
            })

        blocks.append({
            "type": "context",
            "elements": [
                {
                    "type": "mrkdwn",
                    "text": "🤖 *Source:* Fusion Hackathon Live Agent | *Status:* Dispatched",
                }
            ],
        })

        return {"blocks": blocks}

    def send_alert(
        self,
        title: str,
        message: str,
        severity: str = "INFO",
        details: Optional[Dict[str, Any]] = None,
    ) -> bool:
        """Sends formatted Slack block payload to configured webhook."""
        webhook_url = self.webhook_url or os.getenv("SLACK_WEBHOOK_URL")
        if not webhook_url:
            logger.warning("[SLACK NOTIFIER] SLACK_WEBHOOK_URL is not configured.")
            return False

        if "XXXXX" in webhook_url or "YOUR_WEBHOOK" in webhook_url:
            logger.warning("[SLACK NOTIFIER] Detected placeholder in SLACK_WEBHOOK_URL.")
            return False

        payload = self.format_slack_payload(title, message, severity, details)

        try:
            req = urllib.request.Request(
                webhook_url,
                data=json.dumps(payload).encode("utf-8"),
                headers={"Content-Type": "application/json"},
            )
            with urllib.request.urlopen(req, timeout=5) as resp:
                success = resp.status in (200, 204)
                if success:
                    logger.info("[SLACK NOTIFIER] Successfully delivered alert to Slack channel.")
                return success
        except urllib.error.HTTPError as err:
            logger.error("[SLACK NOTIFIER] Slack rejected request: HTTP %d (%s)", err.code, err.reason)
            return False
        except Exception as exc:
            logger.error("[SLACK NOTIFIER] Failed to send Slack alert: %s", exc)
            return False


slack_notifier = SlackNotifier()
