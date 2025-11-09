import { useEffect } from "react";

export function useRealtime(onMessage: (data: any) => void) {
  useEffect(() => {
    const url = import.meta.env.VITE_WS_URL || "ws://localhost:8000/ws/stream";
    const ws = new WebSocket(url);

    ws.onopen = () => console.log("✅ WebSocket connected:", url);
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        onMessage(msg);
      } catch (err) {
        console.error("❌ WS parse error:", err);
      }
    };
    ws.onclose = () => console.log("🔌 WebSocket closed");
    ws.onerror = (err) => console.error("⚠️ WebSocket error", err);

    return () => ws.close();
  }, [onMessage]);
}
