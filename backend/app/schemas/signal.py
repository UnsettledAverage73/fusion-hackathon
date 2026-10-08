from datetime import date as DateType, datetime
from typing import Literal
from pydantic import BaseModel, ConfigDict


class SupportSignalResponse(BaseModel):
    id: int
    student_id: str
    student_name: str
    student_email: str
    date_from: DateType
    date_to: DateType
    signal_type: str
    reason: str
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UpdateSignalStatusRequest(BaseModel):
    status: Literal["active", "acknowledged", "resolved"]
