# 🏥 MedBook — Online Doctor Appointment System

A full-stack healthcare platform built with **React**, **Flask**, and **SQLite**.

---

## ✨ Features

### 👤 Patient Panel
- Register/login as patient
- Browse all approved doctors with search & specialty filter
- View doctor profile: bio, specialty, experience, fee, degree photo
- Book appointments by selecting date + time slot (real-time conflict check)
- View all appointments (with cancel option)
- Real-time chat with doctors (text + images)

### 👨‍⚕️ Doctor Panel
- Register as a doctor (starts as "pending")
- Upload profile photo & degree/certificate image
- Set available time slots (hourly blocks)
- View all patient bookings
- Confirm ✅ or Cancel ❌ appointments
- Mark appointments as completed
- Chat with patients (text + image sharing)

### 🛡️ Admin Panel
- View platform statistics dashboard
- See all doctor applications (pending/approved/rejected)
- View uploaded profile photo & degree of each doctor
- Approve or reject doctors (doctors only appear to patients when approved)
- View all appointments across the platform

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm

### 1. Start Backend (Flask)
```bash
cd medbook/backend
pip install flask flask-cors flask-sqlalchemy werkzeug
python3 app.py
# Runs on http://localhost:5000
```

### 2. Start Frontend (React)
```bash
cd medbook/frontend
npm install --legacy-peer-deps
npm start
# Runs on http://localhost:3000
```

---

## 🔐 Default Credentials

| Role  | Email | Password |
|-------|-------|----------|
| Admin | admin@medbook.com | admin123 |

Create patient/doctor accounts via the Register tab.

---

## 📁 Project Structure

```
medbook/
├── backend/
│   ├── app.py          # Flask app (all API routes)
│   ├── medbook.db      # SQLite database (auto-created)
│   └── uploads/        # User uploaded files
│       ├── profiles/   # Doctor profile photos
│       ├── degrees/    # Doctor degree images
│       └── chat/       # Chat images
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── App.jsx     # Full React app (all components)
        └── index.js    # Entry point
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Register user |
| POST | `/api/login` | Login |
| GET | `/api/doctors` | Get approved doctors |
| GET | `/api/doctors/:id` | Get doctor details |
| PUT | `/api/doctors/:id/profile` | Update doctor profile |
| PUT | `/api/doctors/:id/slots` | Update availability |
| POST | `/api/doctors/:id/upload` | Upload photo/degree |
| POST | `/api/appointments` | Book appointment |
| GET | `/api/appointments/patient/:id` | Patient's appointments |
| GET | `/api/appointments/doctor/:id` | Doctor's appointments |
| PUT | `/api/appointments/:id/status` | Update appointment status |
| POST | `/api/messages` | Send message |
| GET | `/api/messages/:u1/:u2` | Get conversation |
| GET | `/api/messages/conversations/:id` | Get all conversations |
| GET | `/api/admin/doctors` | Admin: all doctors |
| PUT | `/api/admin/doctors/:id/status` | Admin: approve/reject |
| GET | `/api/admin/stats` | Admin: platform stats |

---

## 🎨 Tech Stack

- **Frontend**: React 18, CSS Variables, Google Fonts (DM Sans + Playfair Display)
- **Backend**: Flask, Flask-CORS, Flask-SQLAlchemy
- **Database**: SQLite (via SQLAlchemy ORM)
- **File Storage**: Local filesystem (uploads/ folder)



Credientials: 
Patient: 
Username/Email: samir124@gmail.com
Password: samir@123


Doctor :
aaryaniraula@gmail.com
aarya@123