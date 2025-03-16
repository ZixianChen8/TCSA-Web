import requests
import json
import sys

def register_participant(event_id, first_name, last_name, phone, wechat_id):
    url = f"http://127.0.0.1:8000/api/events/{event_id}/register/"
    data = {
        "first_name": first_name,
        "last_name": last_name,
        "phone": phone,
        "wechat_id": wechat_id
    }
    
    print(f"\nSending POST request to: {url}")
    print(f"Data: {json.dumps(data, indent=2)}")
    
    try:
        response = requests.post(
            url,
            json=data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"\nStatus Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2) if response.content else 'No content'}")
        
        return response.status_code == 201  # 201 Created
    except Exception as e:
        print(f"\nError: {str(e)}")
        return False

if __name__ == "__main__":
    # Check if the server is running first
    try:
        health_check = requests.get("http://127.0.0.1:8000/api/events/")
        if health_check.status_code != 200:
            print("API server is not responding correctly. Make sure it's running.")
            sys.exit(1)
    except:
        print("API server is not running. Please start it with 'python manage.py runserver'")
        sys.exit(1)
    
    # Use command line args or default values
    event_id = sys.argv[1] if len(sys.argv) > 1 else "7"
    
    # Register a test participant
    success = register_participant(
        event_id=event_id,
        first_name="API Test",
        last_name="User",
        phone="555-123-4567",
        wechat_id="apitestuser"
    )
    
    if success:
        print("\nParticipant registration successful!")
    else:
        print("\nParticipant registration failed!") 