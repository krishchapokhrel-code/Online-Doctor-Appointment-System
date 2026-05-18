#!/bin/bash
echo "🏥 Starting MedBook Backend..."
cd "$(dirname "$0")/backend"
pip install flask flask-cors flask-sqlalchemy werkzeug --break-system-packages -q
python3 app.py
