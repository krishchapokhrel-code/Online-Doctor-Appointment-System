import os
import pickle
import json
from flask import Blueprint, request, jsonify
from models import db, Doctor, User, Appointment
from models import doctor_to_dict

chatbot_bp = Blueprint('chatbot', __name__)

# Load model
try:
    with open('backend/model.pkl', 'rb') as f:
        model = pickle.load(f)
    with open('backend/vectorizer.pkl', 'rb') as f:
        vectorizer = pickle.load(f)
except Exception as e:
    model = None
    vectorizer = None
    print(f"Error loading chatbot model: {e}")

def predict_intent(text):
    if not model or not vectorizer:
        return 'unknown'
    try:
        vec = vectorizer.transform([text.lower()])
        return model.predict(vec)[0]
    except Exception as e:
        print(f"Prediction error: {e}")
        return 'unknown'

@chatbot_bp.route('/chatbot', methods=['POST'])
def chatbot_response():
    data = request.json or {}
    message = data.get('message', '').strip()
    
    if not message:
        return jsonify({'reply': 'Please say something!'})
        
    intent = predict_intent(message)
    
    # Fetch approved doctors for context
    approved_docs = Doctor.query.filter_by(status='approved').all()
    docs_data = [doctor_to_dict(d) for d in approved_docs]
    
    reply = ""
    action_data = None
    
    if intent == 'greeting':
        reply = "Hello! I am your MedBook Assistant. 🏥\n\nI can show you our doctors' available timings or help you book an appointment directly. Feel free to ask: \n- 'What are the doctor timings?'\n- 'I want to book an appointment'"
        action_data = {'type': 'greeting'}
        
    elif intent == 'goodbye':
        reply = "Goodbye! Take care and stay healthy! 👋 If you need anything else, I'm always here."
        action_data = {'type': 'goodbye'}
        
    elif intent == 'doctor_timings':
        if not docs_data:
            reply = "We don't have any approved doctors available at the moment."
        else:
            reply = "Here are our available doctors and their consultation hours:\n\n"
            for d in docs_data:
                slots_str = ", ".join(d['available_slots']) if d['available_slots'] else "No slots configured yet"
                reply += f"• Dr. {d['name']} ({d['specialty']}):\n  Consultation Fee: ${d['consultation_fee']}\n  Slots: {slots_str}\n\n"
            reply += "Would you like to book an appointment with one of them?"
        action_data = {'type': 'timings', 'doctors': docs_data}
        
    elif intent == 'booking' or intent == 'date_time':
        reply = "I can guide you through booking an appointment right here! Please select a doctor from the form below to see their available slots and confirm your visit."
        action_data = {'type': 'booking', 'doctors': docs_data}
        
    elif intent.startswith('symptom_'):
        # Empathetic response for symptoms
        symptom_map = {
            'symptom_headache': "headaches. We recommend drinking plenty of water, resting in a quiet room, and consulting our cardiologist or general physician if it persists.",
            'symptom_fever': "fever. Please monitor your temperature closely, stay hydrated, and consult a doctor if it remains high.",
            'symptom_heart': "chest discomfort or heart tightness. ⚠️ If you are experiencing chest pain, please seek emergency medical care immediately! Otherwise, we recommend booking a consult with our cardiologist, Dr. James Anderson.",
            'symptom_skin': "skin rashes or irritation. We recommend keeping the area clean and booking a session with a specialist."
        }
        condition = symptom_map.get(intent, "your symptoms.")
        reply = f"I am sorry to hear you are experiencing {condition}\n\nWould you like to check doctor timings or book an appointment to get examined?"
        action_data = {'type': 'symptoms', 'doctors': docs_data}
        
    else:
        # Unknown fallback: use local smart medical fallback
        reply = "I'm not sure I fully understood. I am trained to show doctor timings, explain specialties, or book appointments. \n\nTry asking me:\n- 'What is the schedule of Dr. Anderson?'\n- 'Can I book an appointment?'"
        action_data = {'type': 'unknown'}
        
    return jsonify({
        'reply': reply,
        'intent': intent,
        'action': action_data
    })
