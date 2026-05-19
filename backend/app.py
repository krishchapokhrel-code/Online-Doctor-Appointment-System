from flask import Flask, send_from_directory
from flask_cors import CORS
from werkzeug.security import generate_password_hash
import os
import sys

# Ensure backend folder is in path for module imports
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.append(BASE_DIR)

from models import db, User

# Import Blueprints
from routes.auth import auth_bp
from routes.doctors import doctors_bp
from routes.appointments import appointments_bp
from routes.admin import admin_bp
from routes.chat import chat_bp
from routes.chatbot import chatbot_bp
from routes.feedback import feedback_bp

app = Flask(__name__)
CORS(app, supports_credentials=True)

UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(os.path.join(UPLOAD_FOLDER, 'profiles'), exist_ok=True)
os.makedirs(os.path.join(UPLOAD_FOLDER, 'degrees'), exist_ok=True)
os.makedirs(os.path.join(UPLOAD_FOLDER, 'chat'), exist_ok=True)

if os.environ.get('TESTING') == 'True':
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(BASE_DIR, "medbook.db")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['SECRET_KEY'] = 'medbook-secret-2024'

# Bind SQLAlchemy to this app instance
db.init_app(app)

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(doctors_bp, url_prefix='/api')
app.register_blueprint(appointments_bp, url_prefix='/api')
app.register_blueprint(admin_bp, url_prefix='/api')
app.register_blueprint(chat_bp, url_prefix='/api')
app.register_blueprint(chatbot_bp, url_prefix='/api')
app.register_blueprint(feedback_bp, url_prefix='/api')

# Serve uploaded media files
@app.route('/uploads/<path:filename>')
def serve_upload(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

# Seed the admin credentials
def seed():
    if not User.query.filter_by(email='admin@aurahealth.com').first():
        admin = User(name='Admin', email='admin@aurahealth.com',
                     password=generate_password_hash('admin123'), role='admin')
        db.session.add(admin)
        db.session.commit()
        print('Admin created: admin@aurahealth.com / admin123')

with app.app_context():
    db.create_all()
    seed()

if __name__ == '__main__': 
    app.run(debug=True, port=5000)
