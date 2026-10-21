from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from pathlib import Path
import sqlite3
import urllib.request
import json

DB_PATH = Path(__file__).resolve().parent / "giftbox.db"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Optional: Paste your free Formspree endpoint URL here later (e.g. "https://formspree.io/f/xxxxxxx")
FORMSPREE_WEBHOOK_URL = ""

class LoginRequest(BaseModel):
    pin: str

class AnswerRequest(BaseModel):
    step_number: int
    answer: str

@app.post("/api/login")
def login(request: LoginRequest):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE username='partner' AND pin=?", (request.pin,))
    user = cursor.fetchone()
    conn.close()

    if user:
        return {"success": True, "user_id": user[0]}
    else:
        raise HTTPException(status_code=401, detail="Invalid PIN")

@app.get("/api/coupons")
def get_coupons():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM coupons WHERE user_id = 1 ORDER BY is_redeemed ASC, id ASC")
    rows = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return {"coupons": rows}

@app.post("/api/coupons/{coupon_id}/redeem")
def redeem_coupon(coupon_id: int):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM coupons WHERE id = ? AND user_id = 1", (coupon_id,))
    coupon = cursor.fetchone()

    if not coupon:
        conn.close()
        raise HTTPException(status_code=404, detail="Coupon not found")

    if coupon["is_redeemed"]:
        conn.close()
        raise HTTPException(status_code=400, detail="Coupon already redeemed")

    now_str = datetime.now().strftime("%b %d, %Y at %I:%M %p")
    cursor.execute(
        "UPDATE coupons SET is_redeemed = 1, redeemed_at = ? WHERE id = ?",
        (now_str, coupon_id)
    )
    conn.commit()
    conn.close()

    # Trigger live email/phone notification if webhook is configured
    if FORMSPREE_WEBHOOK_URL:
        try:
            payload = json.dumps({
                "subject": f"🎟️ Coupon Redeemed: {coupon['title']}",
                "message": f"Your partner just redeemed: {coupon['title']} ({now_str})"
            }).encode("utf-8")
            req = urllib.request.Request(
                FORMSPREE_WEBHOOK_URL,
                data=payload,
                headers={"Content-Type": "application/json", "Accept": "application/json"}
            )
            urllib.request.urlopen(req, timeout=5)
        except Exception as e:
            print(f"Webhook notification skipped/failed: {e}")

    return {"success": True, "id": coupon_id, "title": coupon["title"], "redeemed_at": now_str}

@app.post("/api/coupons/reset")
def reset_coupons():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("UPDATE coupons SET is_redeemed = 0, redeemed_at = NULL WHERE user_id = 1")
    conn.commit()
    conn.close()
    return {"success": True}

@app.get("/api/hunt")
def get_hunt_stages():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, step_number, chapter_title, subtitle, riddle_prompt, hint, memory_title, memory_story, is_unlocked FROM scavenger_clues WHERE user_id = 1 ORDER BY step_number ASC"
    )
    rows = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return {"stages": rows}

@app.post("/api/hunt/verify")
def verify_hunt_answer(req: AnswerRequest):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM scavenger_clues WHERE step_number = ? AND user_id = 1",
        (req.step_number,)
    )
    stage = cursor.fetchone()

    if not stage:
        conn.close()
        raise HTTPException(status_code=404, detail="Stage not found")

    cleaned_input = req.answer.strip().lower()
    valid_options = [ans.strip().lower() for ans in stage["accepted_answers"].split("|")]

    is_correct = any(
        cleaned_input == opt or (len(opt) >= 3 and opt in cleaned_input)
        for opt in valid_options
    )

    if not is_correct:
        conn.close()
        raise HTTPException(status_code=400, detail="Not quite right! Try again or tap the hint.")

    cursor.execute(
        "UPDATE scavenger_clues SET is_unlocked = 1 WHERE step_number = ? AND user_id = 1",
        (req.step_number,)
    )
    conn.commit()
    conn.close()

    return {
        "success": True,
        "step_number": req.step_number,
        "memory_title": stage["memory_title"],
        "memory_story": stage["memory_story"],
    }

@app.post("/api/hunt/reset")
def reset_hunt():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("UPDATE scavenger_clues SET is_unlocked = 0 WHERE user_id = 1")
    conn.commit()
    conn.close()
    return {"success": True}