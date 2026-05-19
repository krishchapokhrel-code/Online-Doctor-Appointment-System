import os
import sys

# Force Flask to use isolated in-memory testing database before any imports
os.environ['TESTING'] = 'True'

# Ensure backend folder is in path for imports
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.append(BASE_DIR)

import unittest
import json
from werkzeug.security import generate_password_hash

from app import app, db
from models import User, Doctor, Appointment, Message

class MedBookTestCase(unittest.TestCase):
    def setUp(self):
        """Set up an isolated in-memory test database and client before each test."""
        app.config['WTF_CSRF_ENABLED'] = False
        
        self.client = app.test_client()
        
        with app.app_context():
            db.create_all()
            # Seed default admin if not already present
            if not User.query.filter_by(email='admin@medbook.com').first():
                admin = User(
                    name='Admin', 
                    email='admin@medbook.com',
                    password=generate_password_hash('admin123'), 
                    role='admin'
                )
                db.session.add(admin)
                db.session.commit()

    def tearDown(self):
        """Destroy the in-memory database after each test."""
        with app.app_context():
            db.session.remove()
            db.drop_all()

    def test_register_patient(self):
        """Test patient registration API."""
        payload = {
            'name': 'Eliza Beth',
            'email': 'eliza.beth@test.com',
            'password': 'password123',
            'phone': '1234567890',
            'role': 'patient'
        }
        res = self.client.post('/api/register', 
                               data=json.dumps(payload),
                               content_type='application/json')
        self.assertEqual(res.status_code, 200)
        
        data = json.loads(res.data)
        self.assertIn('message', data)
        self.assertEqual(data['message'], 'Registered successfully')

    def test_login_patient(self):
        """Test patient login API."""
        # Pre-seed a patient user
        with app.app_context():
            patient = User(
                name='Eliza Beth',
                email='eliza.beth@test.com',
                password=generate_password_hash('password123'),
                role='patient'
            )
            db.session.add(patient)
            db.session.commit()

        payload = {
            'email': 'eliza.beth@test.com',
            'password': 'password123'
        }
        res = self.client.post('/api/login', 
                               data=json.dumps(payload),
                               content_type='application/json')
        self.assertEqual(res.status_code, 200)
        
        data = json.loads(res.data)
        self.assertEqual(data['email'], 'eliza.beth@test.com')
        self.assertEqual(data['role'], 'patient')

    def test_chatbot_inference(self):
        """Test AI Chatbot response inference API."""
        payload = {
            'message': 'I have a severe headache and fever'
        }
        res = self.client.post('/api/chatbot', 
                               data=json.dumps(payload),
                               content_type='application/json')
        self.assertEqual(res.status_code, 200)
        
        data = json.loads(res.data)
        self.assertIn('reply', data)
        self.assertTrue(len(data['reply']) > 0)

    def test_chat_messaging(self):
        """Test exchanging chat messages between two users using multi-part form-data."""
        with app.app_context():
            user1 = User(name='Patient User', email='p@test.com', password=generate_password_hash('123'), role='patient')
            user2 = User(name='Doctor User', email='d@test.com', password=generate_password_hash('123'), role='doctor')
            db.session.add_all([user1, user2])
            db.session.commit()
            
            # Save IDs for routing
            u1_id = user1.id
            u2_id = user2.id

        # Send a message from Patient to Doctor (Form-data)
        payload = {
            'sender_id': str(u1_id),
            'receiver_id': str(u2_id),
            'content': 'Hello Doctor, I would like to confirm my consultation.'
        }
        res = self.client.post('/api/messages', data=payload)
        self.assertEqual(res.status_code, 200)

        # Retrieve conversation history
        res_history = self.client.get(f'/api/messages/{u1_id}/{u2_id}')
        self.assertEqual(res_history.status_code, 200)
        
        history_data = json.loads(res_history.data)
        self.assertEqual(len(history_data), 1)
        self.assertEqual(history_data[0]['content'], 'Hello Doctor, I would like to confirm my consultation.')

    def test_book_appointment(self):
        """Test appointment booking system."""
        with app.app_context():
            # Seed Patient, Doctor User, and Doctor Profile
            patient = User(name='Patient Eliza', email='p@test.com', password=generate_password_hash('123'), role='patient')
            doc_user = User(name='Doctor James', email='james@test.com', password=generate_password_hash('123'), role='doctor')
            db.session.add_all([patient, doc_user])
            db.session.commit()

            doc = Doctor(
                user_id=doc_user.id,
                specialty='Cardiology',
                available_slots=json.dumps(['09:00 AM', '10:00 AM']),
                status='approved'
            )
            db.session.add(doc)
            db.session.commit()
            
            p_id = patient.id
            doc_id = doc.id

        # Book an appointment
        payload = {
            'patient_id': p_id,
            'doctor_id': doc_id,
            'date': '2026-05-20',
            'time_slot': '09:00 AM',
            'notes': 'Heart cardiology consult'
        }
        res = self.client.post('/api/appointments', 
                               data=json.dumps(payload),
                               content_type='application/json')
        self.assertEqual(res.status_code, 200)

        # Verify booked appointments list
        res_list = self.client.get(f'/api/appointments/patient/{p_id}')
        self.assertEqual(res_list.status_code, 200)
        
        list_data = json.loads(res_list.data)
        self.assertEqual(len(list_data), 1)
        self.assertEqual(list_data[0]['time_slot'], '09:00 AM')
        self.assertEqual(list_data[0]['doctor_specialty'], 'Cardiology')

    def test_forgot_and_reset_password(self):
        """Test full password retrieval and reset flow."""
        # 1. Pre-seed a user
        with app.app_context():
            user = User(
                name='Forgot User',
                email='forgot@test.com',
                password=generate_password_hash('oldpassword123'),
                role='patient'
            )
            db.session.add(user)
            db.session.commit()

        # 2. Test verification of registered email
        res = self.client.post('/api/forgot-password',
                               data=json.dumps({'email': 'forgot@test.com'}),
                               content_type='application/json')
        self.assertEqual(res.status_code, 200)
        
        # 3. Test verification of unregistered email (expects 404)
        res_fail = self.client.post('/api/forgot-password',
                                    data=json.dumps({'email': 'missing@test.com'}),
                                    content_type='application/json')
        self.assertEqual(res_fail.status_code, 404)

        # 4. Test password resetting update
        res_reset = self.client.post('/api/reset-password',
                                     data=json.dumps({'email': 'forgot@test.com', 'new_password': 'newpassword123'}),
                                     content_type='application/json')
        self.assertEqual(res_reset.status_code, 200)

        # 5. Test logging in with the new password
        payload = {
            'email': 'forgot@test.com',
            'password': 'newpassword123'
        }
        res_login = self.client.post('/api/login',
                                     data=json.dumps(payload),
                                     content_type='application/json')
        self.assertEqual(res_login.status_code, 200)
        
        login_data = json.loads(res_login.data)
        self.assertEqual(login_data['email'], 'forgot@test.com')

    def test_feedback_saving_and_pdf(self):
        """Test doctor submitting feedback and patient retrieving generated PDF prescription."""
        # 1. Pre-seed users, doctor profile, and appointment
        with app.app_context():
            patient = User(name='Patient Patient', email='p@test.com', password=generate_password_hash('pass123'), role='patient')
            doc_user = User(name='Doctor Doctor', email='d@test.com', password=generate_password_hash('pass123'), role='doctor')
            db.session.add_all([patient, doc_user])
            db.session.commit()

            doc = Doctor(user_id=doc_user.id, specialty='Pediatrics', status='approved')
            db.session.add(doc)
            db.session.commit()

            appt = Appointment(patient_id=patient.id, doctor_id=doc.id, date='2026-05-21', time_slot='10:00 AM', status='confirmed')
            db.session.add(appt)
            db.session.commit()

            appt_id = appt.id

        # 2. Doctor submits medical report (Diagnosis & Prescriptions)
        payload = {
            'appointment_id': appt_id,
            'diagnosis': 'Seasonal allergic rhinitis.',
            'prescription': 'Cetirizine 10mg - 1 daily\nFluticasone Spray - 2 sprays daily',
            'advice': 'Avoid exposure to pollen, use air purifiers.'
        }
        res = self.client.post('/api/feedback',
                               data=json.dumps(payload),
                               content_type='application/json')
        self.assertEqual(res.status_code, 200)

        # 3. Verify status automatically shifted to 'completed'
        with app.app_context():
            updated_appt = Appointment.query.get(appt_id)
            self.assertEqual(updated_appt.status, 'completed')
            self.assertIsNotNone(updated_appt.feedback)
            self.assertEqual(updated_appt.feedback.diagnosis, 'Seasonal allergic rhinitis.')

        # 4. Fetch dynamic clinical PDF document
        res_pdf = self.client.get(f'/api/feedback/appointment/{appt_id}/pdf')
        self.assertEqual(res_pdf.status_code, 200)
        self.assertEqual(res_pdf.content_type, 'application/pdf')

if __name__ == '__main__':
    unittest.main()
