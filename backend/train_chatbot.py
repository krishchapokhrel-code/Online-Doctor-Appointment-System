import pandas as pd
import pickle
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, "medical_chatbot.csv")

# Extra training samples for timings and conversational booking
extra_samples = [
    ("what is the timing of doctor", "doctor_timings"),
    ("when is the doctor available", "doctor_timings"),
    ("is dr james anderson available", "doctor_timings"),
    ("show me doctor timings", "doctor_timings"),
    ("what hours are available", "doctor_timings"),
    ("check doctor schedule", "doctor_timings"),
    ("when are the slots free", "doctor_timings"),
    ("what time can I see a doctor", "doctor_timings"),
    ("timings of the clinic", "doctor_timings"),
    ("are there any available slots today", "doctor_timings"),
    ("what are Dr. Anderson's timings", "doctor_timings"),
    ("list doctor slots", "doctor_timings"),
    ("can I see doctor schedules", "doctor_timings"),
    ("tell me doctor timings", "doctor_timings"),
    ("book doctor james anderson", "booking"),
    ("can I schedule an appointment with dr anderson", "booking"),
    ("make a booking with doctor", "booking"),
    ("I need to schedule a visit", "booking"),
    ("book a slot for tomorrow", "booking")
]

def train():
    print("📈 Preparing dataset...")
    if not os.path.exists(CSV_PATH):
        raise FileNotFoundError(f"Base dataset {CSV_PATH} not found!")

    # Read original dataset
    df = pd.read_csv(CSV_PATH)
    
    # Check if extra samples already appended, if not, append them
    existing_texts = set(df['text'].str.lower())
    new_rows = []
    for text, label in extra_samples:
        if text.lower() not in existing_texts:
            new_rows.append({'text': text, 'label': label})
            
    if new_rows:
        df_new = pd.DataFrame(new_rows)
        df = pd.concat([df, df_new], ignore_index=True)
        # Write back updated csv for inspection
        df.to_csv(CSV_PATH, index=False)
        print(f"Added {len(new_rows)} extra training samples. Total: {len(df)}")
        
    X = df['text']
    y = df['label']
    
    print("🧠 Training ML classification model...")
    # Build text classifier pipeline
    pipeline = make_pipeline(
        TfidfVectorizer(ngram_range=(1, 2), lowercase=True),
        LogisticRegression(C=10)
    )
    
    pipeline.fit(X, y)
    
    # Save components separately as expected
    vectorizer = pipeline.named_steps['tfidfvectorizer']
    model = pipeline.named_steps['logisticregression']
    
    with open(os.path.join(BASE_DIR, "vectorizer.pkl"), "wb") as f:
        pickle.dump(vectorizer, f)
    with open(os.path.join(BASE_DIR, "model.pkl"), "wb") as f:
        pickle.dump(model, f)
        
    print("✅ Model trained and saved successfully (model.pkl, vectorizer.pkl)!")

if __name__ == "__main__":
    train()
