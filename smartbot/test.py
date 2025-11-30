import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

print("🚀 Testing Gemini 2.0 Flash...")

# ✅ Gemini 2.0 Flash (FREE + FAST)
model = genai.GenerativeModel('gemini-2.0-flash')
response = model.generate_content("""
You are Expense Tracker AI. Analyze: ₹8000 monthly rent expense. 
Categories: Rent 🏠, Food 🍽️, Groceries 🛒, Travel ✈️
Give savings tips with emojis!
""")

print("✅ GEMINI 2.0 FLASH WORKS!")
print("🤖 Response:", response.text)
