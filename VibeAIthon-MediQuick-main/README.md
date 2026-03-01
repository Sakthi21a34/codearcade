# MediQuick AI - Medical Triage & Recovery Tracking

MediQuick AI is a comprehensive medical triage and health tracking application designed to provide AI-powered injury assessments, personalized recovery plans, and proactive health monitoring.

## 🚀 Tech Stack

### Frontend
- **React 19** - Core UI framework
- **Tailwind CSS** - Modern styling and layout
- **Craco** - Specialized configuration for React scripts
- **Lucide React** - High-quality icons
- **Axios** - API communication
- **React Router 7** - Client-side routing

### Backend
- **FastAPI** - High-performance Python web framework
- **MongoDB** - Document database for user profiles, logs, and assessments
- **Motor** - Asynchronous MongoDB driver for Python
- **Pydantic** - Data validation and settings management
- **Uvicorn** - ASGI server implementation

### AI Integration
- **GPT-4o / GPT-4o-mini** - Used for visual injury analysis, recovery plan generation, and empathetic health insights.
- **Mock LLM Layer** - Integrated for local development and demonstration.

---

## 🛠️ Running the Project Locally

### Prerequisites
- Node.js (v18+)
- Python (3.10+)
- MongoDB (Running locally on `mongodb://localhost:27017`)

### 1. Backend Setup
1. Navigate to the backend directory:
   ```powershell
   cd backend
   ```
2. Create and activate a virtual environment:
   ```powershell
   python -m venv venv
   .\venv\Scripts\activate
   ```
3. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```
4. Start the backend server:
   ```powershell
   $env:PYTHONPATH="mock_libs"; .\venv\Scripts\python -m uvicorn server:app --host 0.0.0.0 --port 8000
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```powershell
   cd frontend
   ```
2. Install dependencies:
   ```powershell
   npm install --legacy-peer-deps
   ```
3. Start the development server:
   ```powershell
   npm start
   ```

The application will be available at [http://localhost:3000](http://localhost:3000).

---

## 🏥 Key Features
- **Injury Assessment**: Upload a photo of an injury for instant AI visual analysis and triage.
- **Personalized Recovery**: Automatic generation of recovery tasks and medication reminders.
- **Health Tracking**: Monitor blood pressure, blood sugar, and other vital signs.
- **Predictive Alerts**: AI identifies concerning health patterns before they become emergencies.
- **SOS System**: One-tap emergency alerts sent to primary contacts.
- **Doctor Summary**: Generate clinical-grade health reports for medical appointments.
