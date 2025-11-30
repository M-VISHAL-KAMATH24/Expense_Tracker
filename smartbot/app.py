import os
import json
import requests
from dotenv import load_dotenv
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
import google.generativeai as genai
import uvicorn

# Load .env
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Backend database server
BACKEND_URL = "http://localhost:5000"

# FastAPI app
app = FastAPI(title="SmartBot - Database Connected", version="3.0")

templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")

# Gemini model
model = genai.GenerativeModel(
    "gemini-2.0-flash",
    system_instruction=(
        "SmartBot AI - Connected to user's REAL expense database.\n"
        "Always fetch DB data, extract new expenses from chat, and give combined analysis."
    )
)

# WebSocket manager
class ConnectionManager:
    def __init__(self):
        self.active_connections = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections[:]:
            try:
                await connection.send_text(message)
            except:
                self.active_connections.remove(connection)


manager = ConnectionManager()

# Get database summary
def get_user_database_data(user_id="default_user"):
    try:
        response = requests.get(
            f"{BACKEND_URL}/api/expense/summary",
            params={"userId": user_id},
            timeout=5
        )
        if response.status_code == 200:
            return response.json()
    except Exception:
        pass

    return {"income": 0, "expenses": {}, "total": 0, "error": "Backend offline"}


# Routes ============================================

@app.get("/", response_class=HTMLResponse)
async def get_chat(request: Request):
    return templates.TemplateResponse("chat.html", {"request": request})


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)

    # Initial DB pull
    db_data = get_user_database_data()

    welcome = (
        f"🤖 Hi! I fetched your database:\n"
        f"💰 Income: ₹{db_data.get('income', 0):,}\n"
        f"📊 Total Expenses: ₹{db_data.get('total', 0):,}\n"
        f"Ask me anything or add new expenses!"
    )

    await manager.broadcast(json.dumps({
        "message": welcome,
        "isUser": False,
        "model": "gemini-2.0-flash-db"
    }))

    try:
        while True:
            data = await websocket.receive_text()
            user_msg = json.loads(data).get("message", "")
            print("User:", user_msg)

            db_data = get_user_database_data()

            prompt = f"""
User said: "{user_msg}"

📌 CURRENT DATABASE:
Income: ₹{db_data.get('income', 0):,}
Expenses: {db_data.get('expenses', {})}

🔍 Extract any NEW expenses from the chat.
📊 Then generate a combined financial analysis in table format.
"""

            response = model.generate_content(prompt)
            bot_reply = response.text

            await manager.broadcast(json.dumps({
                "message": bot_reply,
                "isUser": False,
                "model": "gemini-2.0-flash-db"
            }))

    except WebSocketDisconnect:
        manager.disconnect(websocket)


# REST API =================================================

@app.post("/api/chat")
async def chat_api(request: Request):
    data = await request.json()
    user_message = data.get("message", "")
    user_id = data.get("userId", "default_user")

    db_data = get_user_database_data(user_id)

    prompt = f"""
DATABASE: {db_data}
USER: {user_message}

➡ Generate combined analysis.
"""

    response = model.generate_content(prompt)

    return {
        "response": response.text,
        "database": db_data
    }


# Run server ============================================

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8001))
    print(f"🚀 SmartBot connected to backend: {BACKEND_URL}")
    uvicorn.run(app, host="0.0.0.0", port=port)
