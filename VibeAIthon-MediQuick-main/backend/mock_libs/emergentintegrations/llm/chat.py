
class ImageContent:
    def __init__(self, image_base64=None):
        self.image_base64 = image_base64

class UserMessage:
    def __init__(self, text="", file_contents=None):
        self.text = text
        self.file_contents = file_contents or []

class LlmChat:
    def __init__(self, api_key=None, session_id=None, system_message=None):
        print(f"DEBUG: Using MOCK LlmChat for session {session_id}")
        self.api_key = api_key
        self.session_id = session_id
        self.system_message = system_message
        self.model_type = "openai"
        self.model_name = "gpt-4o"

    def with_model(self, model_type, model_name):
        self.model_type = model_type
        self.model_name = model_name
        return self

    async def send_message(self, message):
        # Mock response based on the system message or prompt content
        system_str = str(self.system_message).lower()
        message_text = getattr(message, 'text', str(message)).lower()

        if "injury" in system_str or "analyze" in message_text:
            return """
            {
                "injury_type": "Laceration",
                "visual_assessment": "Mock: A clean cut on the skin with mild bleeding.",
                "severity": "Monitor at Home",
                "reasoning": "The wound appears shallow and doesn't show signs of deep tissue involvement or severe bleeding.",
                "first_aid_steps": ["Clean with soap and water", "Apply pressure to stop bleeding", "Apply antibiotic ointment", "Cover with a sterile bandage"],
                "otc_medications": [{"name": "Acetaminophen", "dosage": "500-1000mg every 4-6 hours", "purpose": "Pain relief"}],
                "red_flags": ["Spreading redness", "Pus", "Fever", "Intense pain"],
                "follow_up_needed": "no",
                "follow_up_timeframe": "N/A",
                "uncertainty_notes": "This is a mock analysis for demonstration purposes."
            }
            """
        
        if "recovery" in system_str or "recovery plan" in message_text:
            return """
            {
                "daily_tasks": [
                    {
                        "task": "Wound Dressing Change",
                        "frequency": "Once daily",
                        "duration": "5 days",
                        "instructions": "Clean with mild soap, apply ointment, and replace bandage."
                    }
                ],
                "medication_reminders": [],
                "monitoring_checklist": ["No fever", "No spreading redness", "Pain is decreasing"],
                "expected_recovery_time": "7-10 days",
                "improvement_signs": ["Scab formation", "Decreased swelling"],
                "warning_signs": ["Fever", "Pus", "Warmth at injury site"]
            }
            """
            
        if "health" in system_str:
            return "Mock: Your health data looks stable. Continue monitoring as usual."

        if "summar" in system_str:
            return json.dumps({
                "summary_text": "Mock: Patient shows stable health patterns over the last observation period.",
                "key_concerns": ["None"],
                "vital_trends": "Stable"
            })

        return "Mock response from LlmChat"

    async def send_message_async(self, message):
        return await self.send_message(message)
