from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv()

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")

supabase: Client = create_client(url, key)

try:
    # Try to insert a dummy profile to verify tables exist
    dummy_profile = {
        "id": "00000000-0000-0000-0000-000000000000",
        "name": "Diagnostic User",
        "age": 30,
        "is_minor": False,
        "created_at": "2024-01-28T21:00:00Z"
    }
    print(f"Testing insert into 'user_profiles'...")
    response = supabase.table('user_profiles').insert(dummy_profile).execute()
    print("Insert SUCCESSFUL!")
    print(f"Response: {response.data}")
    
    # Clean up
    supabase.table('user_profiles').delete().eq("id", dummy_profile["id"]).execute()
    print("Cleanup successful.")
    
except Exception as e:
    print(f"Connection/Table error: {str(e)}")
