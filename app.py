from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)

CORS(app, origins=["http://127.0.0.1:5500"])


DATA_FILE = 'notes.json'

def load_notes():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    return {}

def save_notes(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=4)

@app.route('/save-note', methods=['POST'])
def save_note():
    content = request.json
    username = content.get('username', 'anonymous')
    note = content.get('note', '')

    notes = load_notes()
    notes[username] = note
    save_notes(notes)

    return jsonify({"status": "success", "message": f"Note saved for {username}."})

@app.route('/get-note/<username>', methods=['GET'])
def get_note(username):
    notes = load_notes()
    note = notes.get(username, "")
    return jsonify({"note": note})

# ✅ ⬇️ Move this route BEFORE app.run
@app.route('/patients', methods=['GET'])
def get_patients():
    patients = [
        {
            "name": "Ankit Das",
            "age": 25,
            "issue": "Cough & Fever",
            "prescriptions": ["Amoxicillin", "Vitamin C"],
            "history": ["12 Jan 2024 – Flu – Dr. Sharma"]
        },
        {
            "name": "Sneha Roy",
            "age": 31,
            "issue": "Migraine",
            "prescriptions": ["Ibuprofen", "Paracetamol"],
            "history": ["28 Feb 2024 – Allergy – Dr. Roy"]
        }
    ]
    return jsonify(patients)
@app.route('/prescriptions/<patient_name>', methods=['GET'])
def get_prescriptions(patient_name):
    patients = [
        {
            "name": "Ankit Das",
            "prescriptions": ["Amoxicillin", "Vitamin C"]
        },
        {
            "name": "Sneha Roy",
            "prescriptions": ["Ibuprofen", "Paracetamol"]
        }
    ]

    for p in patients:
        if p["name"].lower() == patient_name.lower():
            return jsonify({"prescriptions": p["prescriptions"]})

    return jsonify({"error": "Patient not found"}), 404
@app.route('/history/<patient_name>', methods=['GET'])
def get_history(patient_name):
    patients = [
        {
            "name": "Ankit Das",
            "history": ["12 Jan 2024 – Flu – Dr. Sharma"]
        },
        {
            "name": "Sneha Roy",
            "history": ["28 Feb 2024 – Allergy – Dr. Roy"]
        }
    ]

    for p in patients:
        if p["name"].lower() == patient_name.lower():
            return jsonify({"history": p["history"]})

    return jsonify({"error": "Patient not found"}), 404
# 🔐 Mock user credentials
users = {
    "rohan": {"password": "doc123", "role": "doctor"},
    "ankit": {"password": "pat456", "role": "patient"}
}
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get("username", "").lower()
    password = data.get("password", "")

    user = users.get(username)

    if user and user["password"] == password:
        return jsonify({
            "status": "success",
            "role": user["role"],
            "message": f"Welcome, {username.capitalize()}!"
        })
    else:
        return jsonify({
            "status": "error",
            "message": "Invalid credentials"
        }), 401
@app.route('/patient/<name>', methods=['GET'])
def get_patient_data(name):
    patients = [
        {
            "name": "Ankit Das",
            "age": 25,
            "issue": "Cough & Fever",
            "prescriptions": ["Amoxicillin", "Vitamin C"],
            "history": ["12 Jan 2024 – Flu – Dr. Sharma"]
        },
        {
            "name": "Sneha Roy",
            "age": 31,
            "issue": "Migraine",
            "prescriptions": ["Ibuprofen", "Paracetamol"],
            "history": ["28 Feb 2024 – Allergy – Dr. Roy"]
        }
    ]

    for p in patients:
        if p["name"].lower() == name.lower():
            return jsonify(p)

    return jsonify({"error": "Patient not found"}), 404
@app.route('/doctor/<name>', methods=['GET'])
def get_doctor_patients(name):
    assignments = {
        "Dr.Rohan": [
            {
                "name": "Ankit Das",
                "age": 25,
                "issue": "Cough & Fever"
            },
            {
                "name": "Sneha Roy",
                "age": 31,
                "issue": "Migraine"
            }
        ],
        "Dr.Sharma": [
            {
                "name": "Priya Mehra",
                "age": 28,
                "issue": "Back Pain"
            }
        ]
    }

    patients = assignments.get(name)
    if patients:
        return jsonify(patients)
    else:
        return jsonify({"error": "Doctor not found or no patients assigned"}), 404


# ✅ Only after all routes are registered
if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=5000)

