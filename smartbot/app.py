import os
import json
import requests
from dotenv import load_dotenv
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request, Query
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
        "You get CURRENT user's DB data + chat message.\n"
        "ALWAYS show:\n"
        "1. Database summary\n"
        "2. New expenses extracted from chat\n"
        "3. Combined analysis with tables\n"
        "4. % of income spent per category\n"
        "5. Actionable savings tips\n\n"
        "Format with emojis, tables, numbered lists! 💰📊"
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

# ✅ FIXED: DYNAMIC USER DATABASE FETCH
def get_user_database_data(user_id="guest_user"):
    try:
        # ✅ NEW ENDPOINT: /api/expense/summary/public/{userId}
        response = requests.get(f"{BACKEND_URL}/api/expense/summary/public/{user_id}", timeout=5)
        print(f"🔍 SmartBot fetching data for user: {user_id}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ {user_id}: Income ₹{data.get('income',0):,}, Total ₹{data.get('total',0):,}")
            return data
            
    except Exception as e:
        print(f"❌ DB Error for {user_id}: {e}")
    
    return {"income": 0, "expenses": {}, "total": 0, "userId": user_id, "error": "No data yet"}

@app.get("/", response_class=HTMLResponse)
async def get_chat(request: Request, user_id: str = Query("guest_user")):
    return templates.TemplateResponse("chat.html", {"request": request, "user_id": user_id})

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, user_id: str = Query("guest_user")):
    await manager.connect(websocket)

    # ✅ DYNAMIC USER DATA on connect
    db_data = get_user_database_data(user_id)
    
    welcome = (
        f"🤖 Hi {user_id}! Found YOUR database data:\n\n"
        f"💰 Income: ₹{db_data.get('income', 0):,}\n"
        f"📊 Total Expenses: ₹{db_data.get('total', 0):,}\n"
        f"📈 Categories tracked: {len(db_data.get('expenses', {}))}\n\n"
        f"Ask me anything about YOUR finances!\n"
        f"💬 'What are my expenses?'\n"
        f"💬 'Analyze my rent spending'\n"
        f"💬 'Rent ₹12000, food ₹5000'"
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
            print(f"👤 {user_id}: {user_msg}")

            # ✅ ALWAYS fetch CURRENT user's DB
            db_data = get_user_database_data(user_id)

            prompt = f"""🔗 USER DATA FOR: {user_id}

📌 CURRENT DATABASE:
Income: ₹{db_data.get('income', 0):,}
Total Expenses: ₹{db_data.get('total', 0):,}
Expenses by category: {db_data.get('expenses', {})}

💬 USER SAID: "{user_msg}"

📊 TASKS:
1. Extract NEW expenses from chat message
2. Combine with database data  
3. Show professional table analysis
4. Calculate % of income spent per category
5. Give 3 actionable savings tips

**Format with tables + emojis! 💰**"""

            response = model.generate_content(prompt)
            bot_reply = response.text

            await manager.broadcast(json.dumps({
                "message": bot_reply,
                "isUser": False,
                "model": "gemini-2.0-flash"
            }))

    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        print(f"❌ WebSocket error: {e}")

@app.post("/api/chat")
async def chat_api(request: Request):
    data = await request.json()
    user_message = data.get("message", "")
    user_id = data.get("userId", "guest_user")

    db_data = get_user_database_data(user_id)

    prompt = f"""DATABASE FOR {user_id}: {db_data}
USER: {user_message}

➡ Combined analysis in table format."""

    response = model.generate_content(prompt)

    return {
        "response": response.text,
        "database": db_data,
        "userId": user_id
    }

@app.get("/health")
async def health_check(user_id: str = Query("guest_user")):
    db_data = get_user_database_data(user_id)
    return {
        "status": "healthy", 
        "userId": user_id,
        "database": db_data,
        "backend": BACKEND_URL
    }

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8001))
    print(f"🚀 SmartBot connected to backend: {BACKEND_URL}")
    print(f"📡 Ready for any user! Try: http://localhost:{port}/?userId=john_doe")
    uvicorn.run(app, host="0.0.0.0", port=port)
