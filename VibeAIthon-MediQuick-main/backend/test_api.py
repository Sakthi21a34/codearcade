import requests
import json
import os

API_URL = "http://localhost:8000/api"

def test_assess_injury():
    # 1. Get a user_id (or create one)
    # Since we cleared for diagnostics, let's use the one we know exists or create a temp one
    user_id = "test-user-123"
    
    # Ensure profile and consent exist
    requests.post(f"{API_URL}/user/profile", json={
        "id": user_id,
        "name": "Test User",
        "age": 25,
        "is_minor": False
    })
    
    requests.post(f"{API_URL}/consent", json={
        "user_id": user_id,
        "consent_type": "image_upload",
        "consent_given": True
    })

    # 2. Test assess-injury
    symptoms = {
        "pain_level": "3",
        "bleeding": "no",
        "numbness": "no",
        "fever": "no"
    }
    
    # Create a dummy image file
    with open("dummy.jpg", "wb") as f:
        f.write(b"fake image data")

    files = {
        'image': ('dummy.jpg', open('dummy.jpg', 'rb'), 'image/jpeg')
    }
    data = {
        'user_id': user_id,
        'symptoms': json.dumps(symptoms)
    }

    print("Sending assessment request...")
    try:
        response = requests.post(f"{API_URL}/assess-injury", data=data, files=files, timeout=30)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Request failed: {str(e)}")

if __name__ == "__main__":
    test_assess_injury()
