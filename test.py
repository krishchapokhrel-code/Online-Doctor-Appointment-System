import os
from google import genai

# PASTE YOUR BRAND NEW KEY HERE
MY_NEW_KEY = "AIzaSyC6Ngu6WVM7h9ZA2yZR3p2_nSghiNuK9YI"

client = genai.Client(api_key=MY_NEW_KEY)

try:
    print("Connecting with new API Key...")
    
    # Change the model name to exactly this:
    response = client.models.generate_content(
    model="gemini-2.5-flash", 
    contents="Confirming connection."
)
    
    print("\n--- SUCCESS! ---")
    print(f"Gemini says: {response.text}")

except Exception as e:
    print("\n--- ERROR ---")
    print(f"Message: {e}")