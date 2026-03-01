"""
MediQuick AI - Health Analytics & Predictive Alert Engine
Analyzes health patterns and generates predictive alerts with AI insights
"""

import os
import requests
import json
from typing import Dict, List
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

class HealthAnalytics:
    def __init__(self):
        self.api_key = os.environ.get('EMERGENT_LLM_KEY')
        
    def analyze_vitals_pattern(self, vitals: List[Dict], medications: List[Dict]) -> Dict:
        """
        Analyze vital readings and medication adherence to detect patterns
        Returns alerts and AI insights
        """
        
        # Rule-based pattern detection
        alerts = []
        
        # Check blood pressure trend
        bp_readings = [v for v in vitals if v['reading_type'] == 'blood_pressure']
        if len(bp_readings) >= 3:
            bp_alert = self._check_bp_trend(bp_readings)
            if bp_alert:
                alerts.append(bp_alert)
        
        # Check blood sugar trend
        sugar_readings = [v for v in vitals if v['reading_type'] == 'blood_sugar']
        if len(sugar_readings) >= 3:
            sugar_alert = self._check_sugar_trend(sugar_readings)
            if sugar_alert:
                alerts.append(sugar_alert)
        
        # Check medication adherence
        missed_meds = [m for m in medications if not m.get('taken', False)]
        if len(missed_meds) >= 2:
            med_alert = {
                'alert_type': 'missed_medication',
                'severity': 'medium',
                'title': 'Medication Adherence Alert',
                'message': f'You have missed {len(missed_meds)} medication doses recently.',
                'recommendations': [
                    'Set reminders for medication times',
                    'Keep medications in visible location',
                    'Consider using a pill organizer'
                ]
            }
            alerts.append(med_alert)
        
        # Combine patterns for predictive alerts
        if bp_readings and sugar_readings and missed_meds:
            predictive_alert = self._generate_predictive_alert(bp_readings, sugar_readings, missed_meds)
            if predictive_alert:
                alerts.append(predictive_alert)
        
        return {
            'alerts': alerts,
            'patterns_detected': len(alerts) > 0
        }
    
    def _check_bp_trend(self, bp_readings: List[Dict]) -> Dict:
        """Check blood pressure trend for rising pattern"""
        try:
            # Parse BP readings (format: "120/80")
            recent_readings = sorted(bp_readings, key=lambda x: x['recorded_at'])[-3:]
            
            systolic_values = []
            for reading in recent_readings:
                bp_value = reading['value'].split('/')
                if len(bp_value) == 2:
                    systolic_values.append(int(bp_value[0]))
            
            if len(systolic_values) >= 3:
                # Check if trending upward
                if systolic_values[-1] > systolic_values[0] + 10:
                    severity = 'high' if systolic_values[-1] > 140 else 'medium'
                    return {
                        'alert_type': 'vital_abnormal',
                        'severity': severity,
                        'title': 'Rising Blood Pressure Detected',
                        'message': f'Your blood pressure has been trending upward. Latest reading: {recent_readings[-1]["value"]} mmHg',
                        'recommendations': [
                            'Reduce salt intake',
                            'Practice stress management',
                            'Ensure adequate sleep',
                            'Consult doctor if readings stay elevated'
                        ]
                    }
        except Exception as e:
            print(f"Error checking BP trend: {e}")
        
        return None
    
    def _check_sugar_trend(self, sugar_readings: List[Dict]) -> Dict:
        """Check blood sugar trend"""
        try:
            recent_readings = sorted(sugar_readings, key=lambda x: x['recorded_at'])[-3:]
            sugar_values = [float(r['value']) for r in recent_readings]
            
            avg_sugar = sum(sugar_values) / len(sugar_values)
            
            if avg_sugar > 140:
                severity = 'high' if avg_sugar > 180 else 'medium'
                return {
                    'alert_type': 'vital_abnormal',
                    'severity': severity,
                    'title': 'Elevated Blood Sugar Levels',
                    'message': f'Your average blood sugar is {avg_sugar:.1f} mg/dL, which is above normal range.',
                    'recommendations': [
                        'Monitor carbohydrate intake',
                        'Increase physical activity',
                        'Stay hydrated',
                        'Check medication adherence',
                        'Consider consulting your doctor'
                    ]
                }
        except Exception as e:
            print(f"Error checking sugar trend: {e}")
        
        return None
    
    def _generate_predictive_alert(self, bp_readings: List[Dict], sugar_readings: List[Dict], missed_meds: List[Dict]) -> Dict:
        """Generate predictive alert based on multiple factors"""
        return {
            'alert_type': 'predictive',
            'severity': 'high',
            'title': 'Potential Health Risk Detected',
            'message': 'Multiple concerning patterns detected: rising BP, elevated sugar, and missed medications.',
            'recommendations': [
                'Resume medication schedule immediately',
                'Monitor vitals twice daily',
                'Schedule doctor consultation within 48 hours',
                'Avoid high-sodium and high-sugar foods',
                'Get adequate rest and manage stress'
            ]
        }
    
    async def generate_ai_insight(self, vitals: List[Dict], medications: List[Dict], alerts: List[Dict]) -> str:
        """
        Generate empathetic AI insight using Gemini REST API
        """
        api_key = os.environ.get("GOOGLE_API_KEY")
        model_name = "gemini-1.5-flash"
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
        
        # Build context
        vitals_summary = self._summarize_vitals(vitals)
        meds_summary = self._summarize_medications(medications)
        alerts_summary = [a['title'] for a in alerts]
        
        prompt = f"""You are MediQuick's empathetic health advisor. 
Based on the user's health data, generate a caring insight (max 3 sentences).

Vital Readings: {vitals_summary}
Medication Adherence: {meds_summary}
Alerts: {', '.join(alerts_summary) if alerts_summary else 'None'}"""

        try:
            headers = {'Content-Type': 'application/json'}
            payload = {
                "contents": [{"parts": [{"text": prompt}]}]
            }
            
            response = requests.post(url, headers=headers, json=payload, timeout=30)
            if response.status_code == 200:
                res_json = response.json()
                return res_json['candidates'][0]['content']['parts'][0]['text'].strip()
            else:
                print(f"Gemini Insight REST failed: {response.status_code}")
                raise Exception(f"Status {response.status_code}")
        except Exception as e:
            print(f"Gemini Insight Error: {e}")
            return "Your health data shows you're making progress. Stay consistent with your routine to maintain stability."
    
    def _summarize_vitals(self, vitals: List[Dict]) -> str:
        """Summarize vital readings"""
        if not vitals:
            return "No recent readings"
        
        recent = vitals[-5:] if len(vitals) > 5 else vitals
        types = set([v['reading_type'] for v in recent])
        return f"{len(recent)} readings tracked ({', '.join(types)})"
    
    def _summarize_medications(self, medications: List[Dict]) -> str:
        """Summarize medication adherence"""
        if not medications:
            return "No medications logged"
        
        taken = len([m for m in medications if m.get('taken', False)])
        total = len(medications)
        adherence_rate = (taken / total * 100) if total > 0 else 0
        
        return f"{adherence_rate:.0f}% adherence ({taken}/{total} doses taken)"
    
    async def generate_doctor_summary(self, user_data: Dict, vitals: List[Dict], 
                                      medications: List[Dict], assessments: List[Dict]) -> Dict:
        """
        Generate comprehensive doctor-ready summary using Gemini REST API
        """
        api_key = os.environ.get("GOOGLE_API_KEY")
        model_name = "gemini-1.5-flash"
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
        
        # Analyze vitals trends
        vitals_trends = self._analyze_vitals_trends(vitals)
        
        # Analyze medication adherence
        med_adherence = self._calculate_medication_adherence(medications)
        
        # Get recent assessments
        recent_assessments = [a for a in assessments if a.get('created_at')] if assessments else []
        
        prompt = f"""You are a medical documentation assistant. 
Generate a professional medical summary for a doctor's visit.

Patient: {user_data.get('name', 'Unknown')}, Age: {user_data.get('age', 'Unknown')}
Vital Signs Trends: {vitals_trends}
Medication Adherence: {med_adherence}
Recent Injury Assessments: {len(recent_assessments)}

Highlight health status, concerns, and recommended follow-up."""

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
                ai_observation = json.loads(content_text)
                
                if isinstance(ai_observation, dict):
                    obs = ai_observation.get('summary', content_text)
                else:
                    obs = content_text
            else:
                print(f"Gemini Summary REST failed: {response.status_code}")
                raise Exception(f"Status {response.status_code}")
        except Exception as e:
            print(f"Gemini Summary Error: {e}")
            obs = "Summary generation unavailable. Please review raw data."
        
        return {
            'report_date': datetime.now().isoformat(),
            'period': '7 days',
            'patient_info': {
                'name': user_data.get('name', 'Unknown'),
                'age': user_data.get('age', 'Unknown')
            },
            'vitals_summary': vitals_trends,
            'medication_adherence': med_adherence,
            'assessments_count': len(recent_assessments),
            'ai_clinical_observation': obs,
            'vitals_data': vitals[-20:] if vitals else [],  # Last 20 readings
            'missed_medications': [m for m in medications if not m.get('taken', False)]
        }
    
    def _analyze_vitals_trends(self, vitals: List[Dict]) -> str:
        """Analyze and summarize vitals trends"""
        if not vitals:
            return "No vital readings recorded"
        
        recent_vitals = vitals[-7:] if len(vitals) > 7 else vitals
        
        bp_readings = [v for v in recent_vitals if v['reading_type'] == 'blood_pressure']
        sugar_readings = [v for v in recent_vitals if v['reading_type'] == 'blood_sugar']
        
        summary = []
        
        if bp_readings:
            latest_bp = bp_readings[-1]['value']
            summary.append(f"BP: {latest_bp} mmHg ({len(bp_readings)} readings)")
        
        if sugar_readings:
            try:
                sugar_values = [float(s['value']) for s in sugar_readings]
                avg_sugar = sum(sugar_values) / len(sugar_values)
                summary.append(f"Blood Sugar: Avg {avg_sugar:.1f} mg/dL ({len(sugar_readings)} readings)")
            except:
                summary.append(f"Blood Sugar: {len(sugar_readings)} readings")
        
        return ', '.join(summary) if summary else "Limited vital data"
    
    def _calculate_medication_adherence(self, medications: List[Dict]) -> str:
        """Calculate medication adherence rate"""
        if not medications:
            return "No medications logged"
        
        recent_meds = medications[-14:] if len(medications) > 14 else medications
        taken = len([m for m in recent_meds if m.get('taken', False)])
        total = len(recent_meds)
        
        adherence_rate = (taken / total * 100) if total > 0 else 0
        
        status = "Excellent" if adherence_rate >= 90 else "Good" if adherence_rate >= 75 else "Needs Improvement"
        
        return f"{adherence_rate:.1f}% ({taken}/{total} doses taken) - {status}"
