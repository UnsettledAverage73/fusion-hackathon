from datetime import date as DateType, datetime
from typing import Dict, Optional
from pydantic import BaseModel, ConfigDict, Field


class CheckInCreate(BaseModel):
    date: Optional[DateType] = Field(None, description="Check-in date (YYYY-MM-DD), defaults to today")
    mood: str = Field(..., description="great | good | neutral | low | very_low")
    stress_level: int = Field(..., ge=1, le=5, description="Stress level from 1 to 5")
    sleep_quality: Optional[int] = Field(None, ge=1, le=3, description="1: Poor, 2: Okay, 3: Good")
    nutrition: Optional[int] = Field(None, ge=1, le=5, description="Nutrition 1-5")
    physical_activity: Optional[int] = Field(None, ge=1, le=5, description="Physical activity 1-5")
    academic_pressure: Optional[int] = Field(None, ge=1, le=5, description="Academic pressure 1-5")
    social_interaction: Optional[int] = Field(None, ge=1, le=5, description="Social interaction 1-5")
    private_note: Optional[str] = Field(None, max_length=1000, description="Private daily reflection")


class CheckInResponse(BaseModel):
    id: int
    student_id: str
    date: DateType
    mood: str
    stress_level: int
    sleep_quality: Optional[int] = None
    nutrition: Optional[int] = None
    physical_activity: Optional[int] = None
    academic_pressure: Optional[int] = None
    social_interaction: Optional[int] = None
    private_note: Optional[str] = None
    support_signal: bool = False
    support_reason: Optional[str] = None
    date_range: Optional[Dict[str, str]] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

