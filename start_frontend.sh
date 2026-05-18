#!/bin/bash
echo "🏥 Starting MedBook Frontend..."
cd "$(dirname "$0")/frontend"
npm install --legacy-peer-deps
npm start
