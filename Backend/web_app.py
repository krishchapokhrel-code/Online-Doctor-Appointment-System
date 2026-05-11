from flask import Flask, request, jsonify, render_template
import pickle
import json
import os
from datetime import datetime
from google import genai

app = Flask(__name__)

# =========================
# GEMINI API
# =========================
API_KEY = "AIzaSyB229pXX0uwhzQ2CIlMgUX0WvswNV5M_Iw"
client = genai.Client(api_key=API_KEY)

# =========================
# LOAD ML MODEL
# =========================
model = pickle.load(open("model.pkl", "rb"))
vectorizer = pickle.load(open("vectorizer.pkl", "rb"))

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
# FUNCTIONS
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


def predict(text):
    vec = vectorizer.transform([text])
    return model.predict(vec)[0]


def get_gemini_response(user_text, intent):
    prompt = f"""
You are a professional medical chatbot.

User: {user_text}
Intent: {intent}

Give short and helpful response.
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
# ROUTES
# =========================
@app.route("/")
def home():
    return render_template("bot.html")


@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_query = data["message"]

    intent = predict(user_query)

    if intent == "booking":
        return jsonify({
            "reply": "Please fill the booking form below.",
            "intent": "booking"
        })

    reply = get_gemini_response(user_query, intent)
    return jsonify({"reply": reply, "intent": intent})


@app.route("/save-booking", methods=["POST"])
def booking():
    data = request.get_json()

    save_appointment(
        data["name"],
        data["phone"],
        data["issue"],
        data["time"]
    )

    return jsonify({"reply": "Appointment saved successfully!"})


if __name__ == "__main__":
    app.run(debug=True)