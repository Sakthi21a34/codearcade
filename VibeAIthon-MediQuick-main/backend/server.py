from fastapi import FastAPI, APIRouter, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse, FileResponse
from starlette.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from supabase import create_client, Client
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timezone, timedelta
import base64
import json
from injury_analyzer import InjuryAnalyzer
from health_analytics import HealthAnalytics

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Supabase connection
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

# Initialize AI analyzer
analyzer = InjuryAnalyzer()

# Initialize health analytics
health_analytics = HealthAnalytics()

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ==================== MODELS ====================

class UserProfile(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    age: int
    is_minor: bool = Field(default=False)
    guardian_name: Optional[str] = None
    guardian_consent: bool = Field(default=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserProfileCreate(BaseModel):
    name: str
    age: int
    guardian_name: Optional[str] = None
    guardian_consent: Optional[bool] = False

class ConsentRecord(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    consent_type: str  # "image_upload", "data_storage", "task_lock"
    consent_given: bool
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ConsentCreate(BaseModel):
    user_id: str
    consent_type: str
    consent_given: bool

class InjuryAssessment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    image_filename: str
    symptoms: Dict
    ai_analysis: Dict
    triage_level: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class RecoveryPlan(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    assessment_id: str
    user_id: str
    plan_data: Dict
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TrackingTask(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    plan_id: str
    user_id: str
    task_type: str  # "medication", "dressing_change", "monitoring", "other"
    description: str
    frequency: str
    due_at: datetime
    completed: bool = Field(default=False)
    completed_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TaskUpdate(BaseModel):
    completed: bool

class EmergencyContact(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    name: str
    phone: str
    relationship: str  # "family", "friend", "doctor", "other"
    is_primary: bool = Field(default=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class EmergencyContactCreate(BaseModel):
    user_id: str
    name: str
    phone: str
    relationship: str
    is_primary: Optional[bool] = False

class VitalReading(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    reading_type: str  # "blood_pressure", "blood_sugar", "weight", "temperature", "heart_rate", "oxygen"
    value: str  # Store as string to handle different formats (e.g., "120/80" for BP)
    unit: str  # "mmHg", "mg/dL", "kg", "°F", "bpm", "%"
    notes: Optional[str] = None
    recorded_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class VitalReadingCreate(BaseModel):
    user_id: str
    reading_type: str
    value: str
    unit: str
    notes: Optional[str] = None

class MedicationLog(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    medication_name: str
    dosage: str
    scheduled_time: datetime
    taken: bool = Field(default=False)
    taken_at: Optional[datetime] = None
    missed_reason: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class MedicationLogCreate(BaseModel):
    user_id: str
    medication_name: str
    dosage: str
    scheduled_time: datetime

class HealthAlert(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    alert_type: str  # "predictive", "missed_medication", "vital_abnormal"
    severity: str  # "low", "medium", "high", "critical"
    title: str
    message: str
    ai_insight: Optional[str] = None
    recommendations: List[str] = Field(default_factory=list)
    is_read: bool = Field(default=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# ==================== ENDPOINTS ====================

@api_router.get("/")
async def root():
    return {"message": "MediQuick AI - Medical Triage API", "version": "1.0"}

# User Profile Endpoints
@api_router.post("/user/profile", response_model=UserProfile)
async def create_user_profile(input: UserProfileCreate):
    """Create or update user profile"""
    try:
        profile_dict = input.model_dump()
        
        # Check if user is minor (under 18)
        profile_dict['is_minor'] = profile_dict['age'] < 18
        
        profile = UserProfile(**profile_dict)
        doc = profile.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        
        print(f"Attempting to insert profile into Supabase: {doc}")
        result = supabase.table('user_profiles').insert(doc).execute()
        print(f"Supabase response: {result}")
        
        return profile
    except Exception as e:
        print(f"ERROR creating profile: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/user/profile/{user_id}", response_model=UserProfile)
async def get_user_profile(user_id: str):
    """Get user profile"""
    response = supabase.table('user_profiles').select("*").eq("id", user_id).maybe_single().execute()
    profile = response.data
    if not profile:
        raise HTTPException(status_code=404, detail="User profile not found")
    
    if isinstance(profile['created_at'], str):
        profile['created_at'] = datetime.fromisoformat(profile['created_at'])
    
    return profile

# Consent Endpoints
@api_router.post("/consent", response_model=ConsentRecord)
async def record_consent(input: ConsentCreate):
    """Record user consent"""
    consent = ConsentRecord(**input.model_dump())
    doc = consent.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    supabase.table('consent_records').insert(doc).execute()
    return consent

@api_router.get("/consent/{user_id}")
async def get_user_consents(user_id: str):
    """Get all consent records for a user"""
    response = supabase.table('consent_records').select("*").eq("user_id", user_id).limit(100).execute()
    consents = response.data
    
    for consent in consents:
        if isinstance(consent['timestamp'], str):
            consent['timestamp'] = datetime.fromisoformat(consent['timestamp'])
    
    return consents

# Injury Assessment Endpoints
@api_router.post("/assess-injury")
async def assess_injury(
    user_id: str = Form(...),
    symptoms: str = Form(...),  # JSON string
    image: UploadFile = File(...)
):
    """Upload injury image and get AI assessment"""
    try:
        # Check image consent
        response = supabase.table('consent_records').select("*").eq("user_id", user_id).eq("consent_type", "image_upload").eq("consent_given", True).execute()
        consent = response.data[0] if response.data else None
        
        if not consent:
            raise HTTPException(status_code=403, detail="Image upload consent not provided")
        
        # Read and encode image
        image_data = await image.read()
        image_base64 = base64.b64encode(image_data).decode('utf-8')
        
        # Parse symptoms
        symptoms_dict = json.loads(symptoms)
        
        # Get AI analysis
        analysis = await analyzer.analyze_injury(image_base64, symptoms_dict)
        
        # Save assessment
        assessment = InjuryAssessment(
            user_id=user_id,
            image_filename=image.filename,
            symptoms=symptoms_dict,
            ai_analysis=analysis,
            triage_level=analysis.get('severity', 'Unknown')
        )
        
        doc = assessment.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        
        supabase.table('injury_assessments').insert(doc).execute()
        
        return JSONResponse(content={
            "assessment_id": assessment.id,
            "analysis": analysis,
            "triage_level": assessment.triage_level
        })
        
    except Exception as e:
        logging.error(f"Error in assess_injury: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Assessment failed: {str(e)}")

@api_router.get("/assessments/{user_id}")
async def get_user_assessments(user_id: str):
    """Get all assessments for a user"""
    response = supabase.table('injury_assessments').select("*").eq("user_id", user_id).order("created_at", desc=True).limit(100).execute()
    assessments = response.data
    
    for assessment in assessments:
        if isinstance(assessment['created_at'], str):
            assessment['created_at'] = datetime.fromisoformat(assessment['created_at'])
    
    return assessments

@api_router.get("/assessment/{assessment_id}")
async def get_assessment(assessment_id: str):
    """Get specific assessment"""
    response = supabase.table('injury_assessments').select("*").eq("id", assessment_id).execute()
    assessment = response.data[0] if response.data else None
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    if isinstance(assessment['created_at'], str):
        assessment['created_at'] = datetime.fromisoformat(assessment['created_at'])
    
    return assessment

# Recovery Plan Endpoints
@api_router.post("/recovery-plan")
async def create_recovery_plan(assessment_id: str = Form(...), user_id: str = Form(...)):
    """Generate recovery plan from assessment"""
    try:
        # Get assessment
        response = supabase.table('injury_assessments').select("*").eq("id", assessment_id).execute()
        assessment = response.data[0] if response.data else None
        if not assessment:
            raise HTTPException(status_code=404, detail="Assessment not found")
        
        # Generate recovery plan using AI
        plan_data = await analyzer.generate_recovery_plan(assessment['ai_analysis'])
        
        # Save recovery plan
        plan = RecoveryPlan(
            assessment_id=assessment_id,
            user_id=user_id,
            plan_data=plan_data
        )
        
        doc = plan.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        
        supabase.table('recovery_plans').insert(doc).execute()
        
        # Create tasks from plan
        tasks_created = []
        current_time = datetime.now(timezone.utc)
        
        # Create medication reminder tasks
        for med in plan_data.get('medication_reminders', []):
            task = TrackingTask(
                plan_id=plan.id,
                user_id=user_id,
                task_type="medication",
                description=f"Take {med.get('medication', 'medication')} - {med.get('dosage', '')}",
                frequency=med.get('frequency', 'As prescribed'),
                due_at=current_time
            )
            task_doc = task.model_dump()
            task_doc['created_at'] = task_doc['created_at'].isoformat()
            task_doc['due_at'] = task_doc['due_at'].isoformat()
            supabase.table('tracking_tasks').insert(task_doc).execute()
            tasks_created.append(task.id)
        
        # Create daily task reminders
        for daily_task in plan_data.get('daily_tasks', []):
            task = TrackingTask(
                plan_id=plan.id,
                user_id=user_id,
                task_type="dressing_change" if "dressing" in daily_task.get('task', '').lower() else "other",
                description=daily_task.get('task', ''),
                frequency=daily_task.get('frequency', 'Daily'),
                due_at=current_time
            )
            task_doc = task.model_dump()
            task_doc['created_at'] = task_doc['created_at'].isoformat()
            task_doc['due_at'] = task_doc['due_at'].isoformat()
            supabase.table('tracking_tasks').insert(task_doc).execute()
            tasks_created.append(task.id)
        
        return JSONResponse(content={
            "plan_id": plan.id,
            "plan_data": plan_data,
            "tasks_created": len(tasks_created)
        })
        
    except Exception as e:
        logging.error(f"Error creating recovery plan: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create recovery plan: {str(e)}")

@api_router.get("/recovery-plan/{plan_id}")
async def get_recovery_plan(plan_id: str):
    """Get recovery plan details"""
    response = supabase.table('recovery_plans').select("*").eq("id", plan_id).execute()
    plan = response.data[0] if response.data else None
    if not plan:
        raise HTTPException(status_code=404, detail="Recovery plan not found")
    
    if isinstance(plan['created_at'], str):
        plan['created_at'] = datetime.fromisoformat(plan['created_at'])
    
    return plan

# Task Tracking Endpoints
@api_router.get("/tasks/{user_id}")
async def get_user_tasks(user_id: str, pending_only: bool = False):
    """Get all tasks for a user"""
    query = {"user_id": user_id}
    if pending_only:
        query["completed"] = False
    
    builder = supabase.table('tracking_tasks').select("*").eq("user_id", user_id)
    if pending_only:
        builder = builder.eq("completed", False)
    
    response = builder.order("due_at").limit(100).execute()
    tasks = response.data
    
    for task in tasks:
        if isinstance(task['created_at'], str):
            task['created_at'] = datetime.fromisoformat(task['created_at'])
        if isinstance(task['due_at'], str):
            task['due_at'] = datetime.fromisoformat(task['due_at'])
        if task.get('completed_at') and isinstance(task['completed_at'], str):
            task['completed_at'] = datetime.fromisoformat(task['completed_at'])
    
    return tasks

@api_router.get("/tasks/pending/{user_id}")
async def get_pending_tasks(user_id: str):
    """Get pending tasks for task-lock feature"""
    response = supabase.table('tracking_tasks').select("*").eq("user_id", user_id).eq("completed", False).order("due_at").limit(100).execute()
    tasks = response.data
    
    for task in tasks:
        if isinstance(task['created_at'], str):
            task['created_at'] = datetime.fromisoformat(task['created_at'])
        if isinstance(task['due_at'], str):
            task['due_at'] = datetime.fromisoformat(task['due_at'])
    
    return tasks

@api_router.put("/tasks/{task_id}/complete")
async def complete_task(task_id: str, update: TaskUpdate):
    """Mark task as complete"""
    response = supabase.table('tracking_tasks').select("*").eq("id", task_id).execute()
    task = response.data[0] if response.data else None
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    update_data = {
        "completed": update.completed
    }
    
    if update.completed:
        update_data["completed_at"] = datetime.now(timezone.utc).isoformat()
    if not update.completed:
        update_data["completed_at"] = None
    
    supabase.table('tracking_tasks').update(update_data).eq("id", task_id).execute()
    
    return {"message": "Task updated successfully", "task_id": task_id}

@api_router.delete("/tasks/{task_id}")
async def delete_task(task_id: str):
    """Delete a task"""
    response = supabase.table('tracking_tasks').delete().eq("id", task_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return {"message": "Task deleted successfully"}

# Task Lock Settings
@api_router.post("/task-lock/settings")
async def update_task_lock_settings(user_id: str = Form(...), enabled: bool = Form(...)):
    """Update task lock settings for user"""
    supabase.table('task_lock_settings').upsert({
        "user_id": user_id, 
        "enabled": enabled, 
        "updated_at": datetime.now(timezone.utc).isoformat()
    }).execute()
    
    return {"message": "Task lock settings updated", "enabled": enabled}

@api_router.get("/task-lock/settings/{user_id}")
async def get_task_lock_settings(user_id: str):
    """Get task lock settings"""
    response = supabase.table('task_lock_settings').select("*").eq("user_id", user_id).execute()
    settings = response.data[0] if response.data else None
    
    if not settings:
        return {"user_id": user_id, "enabled": False}
    
    return settings

# Emergency Contacts Endpoints
@api_router.post("/emergency-contacts", response_model=EmergencyContact)
async def add_emergency_contact(input: EmergencyContactCreate):
    """Add emergency contact"""
    contact = EmergencyContact(**input.model_dump())
    doc = contact.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    # If this is marked as primary, unset other primary contacts
    if contact.is_primary:
        supabase.table('emergency_contacts').update({"is_primary": False}).eq("user_id", contact.user_id).eq("is_primary", True).execute()
    
    supabase.table('emergency_contacts').insert(doc).execute()
    return contact

@api_router.get("/emergency-contacts/{user_id}")
async def get_emergency_contacts(user_id: str):
    """Get all emergency contacts for a user"""
    response = supabase.table('emergency_contacts').select("*").eq("user_id", user_id).order("is_primary", desc=True).limit(100).execute()
    contacts = response.data
    
    for contact in contacts:
        if isinstance(contact['created_at'], str):
            contact['created_at'] = datetime.fromisoformat(contact['created_at'])
    
    return contacts

@api_router.delete("/emergency-contacts/{contact_id}")
async def delete_emergency_contact(contact_id: str):
    """Delete emergency contact"""
    response = supabase.table('emergency_contacts').delete().eq("id", contact_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    return {"message": "Emergency contact deleted successfully"}

@api_router.put("/emergency-contacts/{contact_id}/primary")
async def set_primary_contact(contact_id: str):
    """Set a contact as primary"""
    response = supabase.table('emergency_contacts').select("*").eq("id", contact_id).execute()
    contact = response.data[0] if response.data else None
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    # Unset other primary contacts for this user
    supabase.table('emergency_contacts').update({"is_primary": False}).eq("user_id", contact["user_id"]).eq("is_primary", True).execute()
    
    # Set this contact as primary
    supabase.table('emergency_contacts').update({"is_primary": True}).eq("id", contact_id).execute()
    
    return {"message": "Primary contact updated"}

# SOS Alert Endpoint
@api_router.post("/emergency/sos-alert")
async def send_sos_alert(user_id: str = Form(...), location: str = Form(None)):
    """Send SOS alert to all emergency contacts"""
    try:
        # Get user profile
        response = supabase.table('user_profiles').select("*").eq("id", user_id).maybe_single().execute()
        user = response.data
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Get all emergency contacts
        response = supabase.table('emergency_contacts').select("*").eq("user_id", user_id).limit(100).execute()
        contacts = response.data
        
        if len(contacts) == 0:
            return {
                "message": "No emergency contacts found",
                "notifications_sent": 0
            }
        
        # Prepare alert message
        alert_message = f"🚨 EMERGENCY ALERT: {user.get('name', 'Unknown')} has triggered an SOS alert from MediQuick AI. They may need immediate medical assistance."
        if location:
            alert_message += f" Last known location: {location}"
        
        # In production, this would send actual SMS/Email/Push notifications
        # For now, we'll log the notifications and save them to database
        notifications_sent = []
        
        for contact in contacts:
            notification_record = {
                "id": str(uuid.uuid4()),
                "user_id": user_id,
                "contact_id": contact["id"],
                "contact_name": contact["name"],
                "contact_phone": contact["phone"],
                "message": alert_message,
                "sent_at": datetime.now(timezone.utc).isoformat(),
                "status": "sent"
            }
            
            supabase.table('sos_notifications').insert(notification_record).execute()
            notifications_sent.append({
                "contact_name": contact["name"],
                "contact_phone": contact["phone"]
            })
            
            # Log the notification
            logger.info(f"SOS Alert sent to {contact['name']} ({contact['phone']}): {alert_message}")
        
        # Also log SOS trigger in database
        sos_log = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "triggered_at": datetime.now(timezone.utc).isoformat(),
            "location": location,
            "contacts_notified": len(notifications_sent)
        }
        supabase.table('sos_triggers').insert(sos_log).execute()
        
        return {
            "message": "SOS alert sent successfully",
            "notifications_sent": len(notifications_sent),
            "contacts_notified": notifications_sent
        }
        
    except Exception as e:
        logger.error(f"Error sending SOS alert: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to send SOS alert: {str(e)}")

# Health Tracking Endpoints
@api_router.post("/vitals", response_model=VitalReading)
async def log_vital_reading(input: VitalReadingCreate):
    """Log a vital reading"""
    vital = VitalReading(**input.model_dump())
    doc = vital.model_dump()
    doc['recorded_at'] = doc['recorded_at'].isoformat()
    doc['created_at'] = doc['created_at'].isoformat()
    
    supabase.table('vital_readings').insert(doc).execute()
    
    # Check for alerts after logging vital
    await check_and_generate_alerts(input.user_id)
    
    return vital

@api_router.get("/vitals/{user_id}")
async def get_user_vitals(user_id: str, days: int = 30):
    """Get user's vital readings"""
    start_date = (datetime.now(timezone.utc) - timedelta(days=days)).isoformat()
    
    response = supabase.table('vital_readings').select("*").eq("user_id", user_id).gte("recorded_at", start_date).order("recorded_at", desc=True).limit(200).execute()
    vitals = response.data
    
    for vital in vitals:
        if isinstance(vital['recorded_at'], str):
            vital['recorded_at'] = datetime.fromisoformat(vital['recorded_at'])
        if isinstance(vital['created_at'], str):
            vital['created_at'] = datetime.fromisoformat(vital['created_at'])
    
    return vitals

@api_router.post("/medications", response_model=MedicationLog)
async def log_medication(input: MedicationLogCreate):
    """Log a medication schedule"""
    medication = MedicationLog(**input.model_dump())
    doc = medication.model_dump()
    doc['scheduled_time'] = doc['scheduled_time'].isoformat()
    doc['created_at'] = doc['created_at'].isoformat()
    
    supabase.table('medication_logs').insert(doc).execute()
    return medication

@api_router.get("/medications/{user_id}")
async def get_user_medications(user_id: str, days: int = 14):
    """Get user's medication logs"""
    start_date = (datetime.now(timezone.utc) - timedelta(days=days)).isoformat()
    
    response = supabase.table('medication_logs').select("*").eq("user_id", user_id).gte("scheduled_time", start_date).order("scheduled_time", desc=True).limit(200).execute()
    medications = response.data
    
    for med in medications:
        if isinstance(med['scheduled_time'], str):
            med['scheduled_time'] = datetime.fromisoformat(med['scheduled_time'])
        if med.get('taken_at') and isinstance(med['taken_at'], str):
            med['taken_at'] = datetime.fromisoformat(med['taken_at'])
        if isinstance(med['created_at'], str):
            med['created_at'] = datetime.fromisoformat(med['created_at'])
    
    return medications

@api_router.put("/medications/{medication_id}/take")
async def mark_medication_taken(medication_id: str):
    """Mark medication as taken"""
    response = supabase.table('medication_logs').select("*").eq("id", medication_id).execute()
    medication = response.data[0] if response.data else None
    if not medication:
        raise HTTPException(status_code=404, detail="Medication log not found")
    
    supabase.table('medication_logs').update({
            "taken": True,
            "taken_at": datetime.now(timezone.utc).isoformat()
    }).eq("id", medication_id).execute()
    
    return {"message": "Medication marked as taken"}

@api_router.get("/health-alerts/{user_id}")
async def get_health_alerts(user_id: str, unread_only: bool = False):
    """Get health alerts for user"""
    builder = supabase.table('health_alerts').select("*").eq("user_id", user_id)
    if unread_only:
        builder = builder.eq("is_read", False)
    
    response = builder.order("created_at", desc=True).limit(100).execute()
    alerts = response.data
    
    for alert in alerts:
        if isinstance(alert['created_at'], str):
            alert['created_at'] = datetime.fromisoformat(alert['created_at'])
    
    return alerts

@api_router.put("/health-alerts/{alert_id}/read")
async def mark_alert_read(alert_id: str):
    """Mark alert as read"""
    supabase.table('health_alerts').update({"is_read": True}).eq("id", alert_id).execute()
    return {"message": "Alert marked as read"}

@api_router.post("/health-alerts/generate/{user_id}")
async def generate_health_alerts(user_id: str):
    """Manually trigger health alert generation"""
    await check_and_generate_alerts(user_id)
    return {"message": "Health alerts generated"}

async def check_and_generate_alerts(user_id: str):
    """Check patterns and generate alerts with AI insights"""
    try:
        # Get recent vitals
        start_date = (datetime.now(timezone.utc) - timedelta(days=7)).isoformat()
        response = supabase.table('vital_readings').select("*").eq("user_id", user_id).gte("recorded_at", start_date).limit(100).execute()
        vitals = response.data
        
        # Get recent medications
        response = supabase.table('medication_logs').select("*").eq("user_id", user_id).gte("scheduled_time", start_date).limit(100).execute()
        medications = response.data
        
        # Analyze patterns
        analysis = health_analytics.analyze_vitals_pattern(vitals, medications)
        
        if analysis['patterns_detected']:
            # Generate AI insight
            ai_insight = await health_analytics.generate_ai_insight(
                vitals, medications, analysis['alerts']
            )
            
            # Save alerts to database
            for alert_data in analysis['alerts']:
                alert = HealthAlert(
                    user_id=user_id,
                    alert_type=alert_data['alert_type'],
                    severity=alert_data['severity'],
                    title=alert_data['title'],
                    message=alert_data['message'],
                    ai_insight=ai_insight,
                    recommendations=alert_data.get('recommendations', [])
                )
                
                doc = alert.model_dump()
                doc['created_at'] = doc['created_at'].isoformat()
                
                # Check if similar alert already exists (avoid duplicates)
                response = supabase.table('health_alerts').select("*").eq("user_id", user_id).eq("title", alert.title).eq("is_read", False).execute()
                existing = response.data
                
                if not existing:
                    supabase.table('health_alerts').insert(doc).execute()
    
    except Exception as e:
        logger.error(f"Error generating health alerts: {str(e)}")

@api_router.get("/doctor-summary/{user_id}")
async def generate_doctor_summary(user_id: str):
    """Generate doctor-ready health summary"""
    try:
        # Get user profile
        response = supabase.table('user_profiles').select("*").eq("id", user_id).execute()
        user = response.data[0] if response.data else None
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Get data from last 7 days
        start_date = (datetime.now(timezone.utc) - timedelta(days=7)).isoformat()
        
        response = supabase.table('vital_readings').select("*").eq("user_id", user_id).gte("recorded_at", start_date).limit(200).execute()
        vitals = response.data
        
        response = supabase.table('medication_logs').select("*").eq("user_id", user_id).gte("scheduled_time", start_date).limit(200).execute()
        medications = response.data
        
        response = supabase.table('injury_assessments').select("*").eq("user_id", user_id).gte("created_at", start_date).limit(100).execute()
        assessments = response.data
        
        # Generate comprehensive summary
        summary = await health_analytics.generate_doctor_summary(
            user, vitals, medications, assessments
        )
        
        return summary
        
    except Exception as e:
        logger.error(f"Error generating doctor summary: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate summary: {str(e)}")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    pass
