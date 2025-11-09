Network Guard ML - Local Backend (demo)

Files:
- app/main.py        : FastAPI app (REST predict, WebSocket stream, optional proxy)
- mock_streamer.py   : standalone websocket mock server (alternative)
- requirements.txt   : python dependencies

Quick start (PowerShell):
1. cd into backend folder:
    cd backend
2. create venv and activate:
    python -m venv .venv
    .venv\Scripts\activate
3. install deps:
    pip install -r requirements.txt
4. run FastAPI:
    uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

- API docs: http://127.0.0.1:8000/docs
- WebSocket: ws://127.0.0.1:8000/ws/stream
- Proxy endpoint (if you set LOVABLE_BASE and LOVABLE_TOKEN env vars):
    POST http://127.0.0.1:8000/proxy/predict  (body: {"samples":[...]})
