import pandas as pd

# Load dataset
df = pd.read_csv("SMSSpamCollection", sep='\t', names=["label", "text"])

# Show first 5 rows
print(df.head())
import pandas as pd
import re #in Python is used to include the built-in regular expression module, enabling pattern-based text searching, matching, and manipulation.
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

# Load dataset
df = pd.read_csv("SMSSpamCollection", sep='\t', names=["label", "text"])

# Convert labels
df['label'] = df['label'].map({'ham': 0, 'spam': 1})

# Clean text
def clean_text(text):
    text = text.lower()
    text = re.sub(r"http\S+", "", text)
    text = re.sub(r"[^a-zA-Z]", " ", text)
    return text

df['text'] = df['text'].apply(clean_text)

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    df['text'], df['label'], test_size=0.2, random_state=42
)

# Convert text to numbers
vectorizer = TfidfVectorizer()
X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

# Train model
model = LogisticRegression()
model.fit(X_train_vec, y_train)

# Predict
y_pred = model.predict(X_test_vec)

# Accuracy
accuracy = accuracy_score(y_test, y_pred)
print("Accuracy:", accuracy)

# Test custom input
sample = ["You have won ₹5000 click now"]
sample_vec = vectorizer.transform(sample)
prediction = model.predict(sample_vec)

print("Prediction:", "SCAM" if prediction[0] == 1 else "SAFE")
import pickle

# Save model
pickle.dump(model, open("model.pkl", "wb"))

# Save vectorizer
pickle.dump(vectorizer, open("vectorizer.pkl", "wb"))