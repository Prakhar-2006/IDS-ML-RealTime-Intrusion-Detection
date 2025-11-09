from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio, time, random, json, os, requests

app = FastAPI(title="Network Guard ML - Backend (Demo)")

# Allow your local frontend. Adjust origins for production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:8080", "*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictRequest(BaseModel):
    samples: list

@app.post("/api/v1/predict")
async def predict(req: PredictRequest):
    """Demo predict endpoint.
    Replace the body with actual model loading and prediction logic.
    """
    preds = []
    for i, s in enumerate(req.samples):
        label = "Benign" if random.random() > 0.35 else random.choice(["DoS","PortScan","BruteForce"])
        score = round(random.uniform(0.6,0.99), 2)
        preds.append({
            "id": s.get("id", f"pkt_{i}"),
            "pred_label": label,
            "score": score,
            "probabilities": {"Benign": round(1-score,2), label: score},
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S")
        })
    return {"predictions": preds, "model": "demo-model-v1"}

@app.websocket("/ws/stream")
async def websocket_stream(ws: WebSocket):
    await ws.accept()
    try:
        while True:
            idn = f"pkt_{random.randint(1,99999)}"
            pred = random.choice(["Benign","DoS","PortScan","BruteForce"])
            score = round(random.uniform(0.6, 0.99), 2)
            payload = {"event":"detection","payload": {
                "id": idn,
                "pred_label": pred,
                "score": score,
                "severity": "high" if pred!="Benign" and score>0.85 else ("medium" if pred!="Benign" else "low"),
                "features": {"src_ip":"10.0.0.1","dst_ip":"10.0.0.5"},
                "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S")
            }}
            await ws.send_text(json.dumps(payload))
            await asyncio.sleep(1.5)
    except WebSocketDisconnect:
        print("WS client disconnected")

# Optional: proxy route to forward requests to Lovable cloud (if you have a cloud endpoint + token)
LOVABLE_BASE = os.environ.get("LOVABLE_BASE","")  # e.g. https://api.lovable.ai/<project-id>
LOVABLE_TOKEN = os.environ.get("LOVABLE_TOKEN","")

@app.post("/proxy/predict")
async def proxy_predict(req: PredictRequest):
    if not LOVABLE_BASE or not LOVABLE_TOKEN:
        return {"error":"LOVABLE_BASE or LOVABLE_TOKEN not set on server."}
    payload = {"samples": req.samples}
    headers = { "Authorization": f"Bearer {LOVABLE_TOKEN}", "Content-Type": "application/json"}
    r = requests.post(f"{LOVABLE_BASE}/predict", json=payload, headers=headers, timeout=10)
    try:
        return r.json()
    except Exception:
        return {"status_code": r.status_code, "text": r.text}
