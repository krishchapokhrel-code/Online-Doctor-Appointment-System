import pickle
import json
import os
import sys
from datetime import datetime
from google import genai


# =========================
# GEMINI API KEY
# =========================
API_KEY = "AIzaSyCU-7GPphVjqInmfYmqmVpKZK9Q-WWmLt4"

if not API_KEY:
    print("ERROR: API key is missing")
    sys.exit()

client = genai.Client(api_key=API_KEY)


# =========================
# LOAD ML MODEL
# =========================
try:
    model = pickle.load(open("model.pkl", "rb"))
    vectorizer = pickle.load(open("vectorizer.pkl", "rb"))
except FileNotFoundError:
    print("ERROR: model.pkl or vectorizer.pkl not found!")
    sys.exit()


# =========================
# DATABASE
# =========================
DB_FILE = "appointments.json"

if os.path.exists(DB_FILE):
    try:
        with open(DB_FILE, "r") as f:
            appointments = json.load(f)
    except:
        appointments = []
else:
    appointments = []


# =========================
# SAVE APPOINTMENT
# =========================
def save_appointment(name, phone, issue, time):
    data = {
        "name": name,
        "phone": phone,
        "issue": issue,
        "time": time,
        "created_at": str(datetime.now())
    }

    appointments.append(data)

    with open(DB_FILE, "w") as f:
        json.dump(appointments, f, indent=4)


# =========================
# ML PREDICTION
# =========================
def predict(text):
    vec = vectorizer.transform([text])
    return model.predict(vec)[0]


# =========================
# GEMINI RESPONSE (FIXED)
# =========================
def get_gemini_response(user_text, intent):
    prompt = f"""
You are a professional medical assistant chatbot for a clinic.

User message: {user_text}
Detected intent: {intent}

Rules:
- greeting → respond warmly
- symptom_fever / symptom_headache → show empathy and suggest booking appointment
- booking → guide step by step
- unknown → ask clarifying medical questions

Keep responses short, clear, and helpful.
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        return response.text

    except Exception as e:
        return f"Gemini Error: {e}"


# =========================
# MAIN CHAT LOOP
# =========================
print("\nMedical Chatbot Started (ML + Gemini)\n")

while True:
    user_query = input("You: ")

    if user_query.lower() in ["exit", "quit"]:
        print("Bot: Take care! Goodbye 👋")
        break

    # 1. Predict intent
    intent = predict(user_query)

    # 2. Booking flow
    if intent == "booking":
        print("Bot: Starting appointment booking...")

        name = input("Name: ")
        phone = input("Phone: ")
        issue = input("Issue: ")
        time = input("Preferred Time: ")

        save_appointment(name, phone, issue, time)

        print(f"Bot: Appointment saved for {name} at {time} ✅")

    # 3. Gemini responses
    elif intent in ["greeting", "symptom_fever", "symptom_headache", "goodbye"]:
        reply = get_gemini_response(user_query, intent)
        print("Bot:", reply)

        if intent == "goodbye":
            break

    # 4. fallback
    else:
        reply = get_gemini_response(user_query, "unknown")
        print("Bot:", reply)