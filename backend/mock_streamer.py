# Optional standalone websocket mock streamer (requires 'websockets' package)
import asyncio, json, random
from datetime import datetime
import websockets

async def handler(ws, path):
    while True:
        idn = f"pkt_{random.randint(1,99999)}"
        pred = random.choice(["Benign","DoS","PortScan","BruteForce"])
        score = round(random.uniform(0.6, 0.99),2)
        payload = {"event":"detection","payload": {
            "id": idn,
            "pred_label": pred,
            "score": score,
            "severity": "high" if pred!="Benign" and score>0.85 else ("medium" if pred!="Benign" else "low"),
            "timestamp": datetime.utcnow().isoformat()+"Z"
        }}
        await ws.send(json.dumps(payload))
        await asyncio.sleep(1.5)

async def main():
    server = await websockets.serve(handler, "0.0.0.0", 8765)
    print("Mock streamer running on ws://0.0.0.0:8765")
    await server.wait_closed()

if __name__ == "__main__":
    asyncio.run(main())
