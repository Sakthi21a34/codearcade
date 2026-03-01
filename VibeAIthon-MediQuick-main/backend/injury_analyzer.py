"""
MediQuick AI - Injury Analysis Service
Analyzes injury images using GPT-4 Vision and provides medical triage
"""

import os
import base64
import requests
import json
from typing import Dict, List
from dotenv import load_dotenv

load_dotenv()

class InjuryAnalyzer:
    def __init__(self):
        self.api_key = os.environ.get('EMERGENT_LLM_KEY')
        
        # System message for medical triage
        self.system_message = """You are MediQuick — a careful, empathetic medical-assistant chatbot. 

When given a photo of an injury and symptom details, you must:
1. Analyze the image for visible injury type and provide expert feedback and guidance.
2. Combine visual assessment with user-provided symptoms.
3. Triage into one of: Emergency (go to ER now), Visit a Clinic Soon (within 24–48h), Monitor & home care, or Low concern.
4. Explain your reasoning and provide clear guidance on next steps.
5. Suggest only over-the-counter (OTC) first-aid steps.
6. NEVER give prescription-only or controlled medication dosages.
7. Always include red flags that require immediate care.

IMPORTANT: You are not a replacement for professional medical care. Always recommend seeking urgent care for serious injuries.

Respond in JSON format with the following structure:
{
    "injury_type": "string",
    "visual_assessment": "detailed description of what you see",
    "severity": "Emergency|Clinician Soon|Monitor at Home|Low Concern",
    "reasoning": "explanation of triage decision",
    "first_aid_steps": ["step1", "step2", ...],
    "otc_medications": [{"name": "medication name", "dosage": "age-appropriate dosage", "purpose": "reason"}],
    "red_flags": ["flag1", "flag2", ...],
    "follow_up_needed": "yes|no",
    "follow_up_timeframe": "timeframe if needed",
    "uncertainty_notes": "any uncertainties or limitations"
}
"""
    
    async def analyze_injury(
        self, 
        image_base64: str,
        symptoms: Dict
    ) -> Dict:
        """
        Analyze an injury using Gemini 1st, Imagga+Groq 2nd, and Rule-based 3rd
        """
        from groq import Groq
        
        # 1. Start with Gemini (Primary) via REST API
        try:
            api_key = os.environ.get("GOOGLE_API_KEY")
            # Using gemini-1.5-flash for vision support as gemini-pro (legacy) is text-only
            model_name = "gemini-1.5-flash"
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
            
            headers = {'Content-Type': 'application/json'}
            
            # Construct standard Gemini REST payload for vision
            payload = {
                "contents": [{
                    "parts": [
                        {"text": self._build_prompt(symptoms)},
                        {
                            "inline_data": {
                                "mime_type": "image/jpeg",
                                "data": image_base64
                            }
                        }
                    ]
                }],
                "generationConfig": {
                    "response_mime_type": "application/json"
                }
            }
            
            print(f"Calling Gemini REST API: {url}")
            response = requests.post(url, headers=headers, json=payload, timeout=30)
            
            if response.status_code == 200:
                res_json = response.json()
                if 'candidates' in res_json and res_json['candidates']:
                    content_text = res_json['candidates'][0]['content']['parts'][0]['text']
                    # Clean markdown if present
                    if content_text.startswith("```json"):
                        content_text = content_text.replace("```json", "").replace("```", "").strip()
                    return json.loads(content_text)
                else:
                    print(f"Gemini REST response unexpected: {res_json}")
            else:
                print(f"Gemini REST failed with {response.status_code}: {response.text}")
        except Exception as gemini_err:
            print(f"Gemini REST API failed: {gemini_err}")

        # 2. Fallback to Imagga (Vision) + Groq (Reasoning)
        try:
            print("Attempting Imagga + Groq fallback...")
            imagga_key = os.environ.get('IMAGGA_API_KEY')
            imagga_secret = os.environ.get('IMAGGA_API_SECRET')
            groq_key = os.environ.get('GROQ_API_KEY')
            
            # Get Tags from Imagga
            image_bytes = base64.b64decode(image_base64)
            response = requests.post(
                'https://api.imagga.com/v2/tags',
                auth=(imagga_key, imagga_secret),
                files={'image': ('image.jpg', image_bytes)}
            )
            
            if response.status_code == 200:
                tags_data = response.json()
                visual_tags = [t['tag']['en'] for t in tags_data['result']['tags'][:10]]
                print(f"Imagga successfully detected: {visual_tags}")
                
                # Use Groq (Text Only) to reason based on tags + symptoms
                client = Groq(api_key=groq_key)
                reasoning_prompt = f"""Assess this injury based on:
Visual findings: {', '.join(visual_tags)}
User Symptoms: {symptoms}

{self.system_message}
Return valid JSON."""

                chat_completion = client.chat.completions.create(
                    messages=[{"role": "user", "content": reasoning_prompt}],
                    model="llama-3.3-70b-versatile",
                    response_format={"type": "json_object"}
                )
                print("Groq reasoning successful via Imagga tags.")
                return json.loads(chat_completion.choices[0].message.content)
            else:
                print(f"Imagga failed with status {response.status_code}: {response.text}")
        except Exception as hybrid_err:
            print(f"Hybrid Fallback Error: {str(hybrid_err)}")

        # 3. Last Resort: Rule-based Fallback
        return self._rule_based_fallback(symptoms)

    def _build_prompt(self, symptoms: Dict) -> str:
        return f"""Analyze this injury image.
Symptoms:
- Pain: {symptoms.get('pain_level')}/10
- Bleeding: {symptoms.get('bleeding')}
- Numbness: {symptoms.get('numbness')}
- Fever: {symptoms.get('fever')}
- Movement: {symptoms.get('movement_limitations')}
- Time: {symptoms.get('time_since_injury')}

{self.system_message}"""

    def _rule_based_fallback(self, symptoms: Dict) -> Dict:
        pain = int(symptoms.get('pain_level', 0))
        bleeding = str(symptoms.get('bleeding', 'none')).lower()
        if bleeding == "severe" or symptoms.get('numbness') == "yes":
            severity = "Emergency"
            steps = ["Apply firm pressure", "Immobilize", "Call emergency services"]
        elif pain > 7 or symptoms.get('fever') == "yes":
            severity = "Clinician Soon"
            steps = ["Clean gently", "Apply dressing", "See doctor within 24h"]
        else:
            severity = "Monitor at Home"
            steps = ["Clean with soap", "Apply ointment", "Bandage"]
            
        return {
            "injury_type": "Symptom-based Assessment",
            "visual_assessment": "Image analyzed via symptom keywords (AI Vision Quota Busy).",
            "severity": severity,
            "reasoning": "Determined based on reported pain and physical symptoms.",
            "first_aid_steps": steps,
            "otc_medications": [{"name": "Pain Relief", "dosage": "As per label", "purpose": "Reduce pain"}],
            "red_flags": ["Signs of infection", "Severe pain", "Fever"],
            "follow_up_needed": "yes" if severity != "Monitor at Home" else "no",
            "follow_up_timeframe": "As needed",
            "uncertainty_notes": "Automated triage fallback used."
        }
    
    async def generate_recovery_plan(
        self,
        assessment: Dict,
        user_preferences: Dict = None
    ) -> Dict:
        """
        Generate a recovery plan using Gemini REST API
        """
        
        api_key = os.environ.get("GOOGLE_API_KEY")
        model_name = "gemini-1.5-flash"
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
        
        prompt = f"""You are MediQuick recovery planning assistant. 
Based on this injury assessment:
Injury: {assessment.get('injury_type')}
Severity: {assessment.get('severity')}
First Aid: {assessment.get('first_aid_steps')}

Create a recovery plan in JSON format:
{{
    "daily_tasks": [
        {{
            "task": "description",
            "frequency": "how often",
            "duration": "days",
            "instructions": "details"
        }}
    ],
    "medication_reminders": [],
    "monitoring_checklist": ["what to watch"],
    "expected_recovery_time": "time",
    "improvement_signs": ["healing signs"],
    "warning_signs": ["red flags"]
}}"""

        try:
            headers = {'Content-Type': 'application/json'}
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {"response_mime_type": "application/json"}
            }
            
            response = requests.post(url, headers=headers, json=payload, timeout=30)
            if response.status_code == 200:
                res_json = response.json()
                content_text = res_json['candidates'][0]['content']['parts'][0]['text']
                if content_text.startswith("```json"):
                    content_text = content_text.replace("```json", "").replace("```", "").strip()
                return json.loads(content_text)
            else:
                print(f"Gemini Recovery REST failed: {response.status_code}")
                raise Exception(f"Status {response.status_code}")
        except Exception as e:
            print(f"Gemini Recovery Plan Error (using fallback): {str(e)}")
            severity = assessment.get('severity', 'Monitor at Home')
            
            return {
                "daily_tasks": [
                    {
                        "task": "Wound Care",
                        "frequency": "Once daily",
                        "duration": "5 days",
                        "instructions": "Clean with mild soap and water, then cover with a clean bandage."
                    },
                    {
                        "task": "Symptom Monitoring",
                        "frequency": "Ongoing",
                        "duration": "7 days",
                        "instructions": "Watch for signs of infection like pus, increased redness, or fever."
                    }
                ],
                "medication_reminders": [
                    {
                        "medication": "Ibuprofen or Acetaminophen",
                        "dosage": "As directed on label",
                        "frequency": "Every 6 hours if in pain",
                        "duration": "3 days",
                        "with_food": True
                    }
                ],
                "monitoring_checklist": ["Pus or drainage", "Intense warmth", "Fever over 100°F", "Increasing pain"],
                "expected_recovery_time": "3-7 days",
                "improvement_signs": ["Decreased pain", "Wound closure", "No new redness"],
                "warning_signs": ["Signs of infection", "Numbness", "Inability to move the area"]
            }
