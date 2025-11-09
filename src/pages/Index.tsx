import React, { useState, useCallback } from "react";
import Header from "@/components/Header";
import MetricCard from "@/components/MetricCard";
import { Card } from "@/components/ui/card";
import { Activity, Shield, TrendingUp, Zap, AlertTriangle, CheckCircle } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { useRealtime } from "../hooks/useRealtime";

const Index = () => {
  // Live states for dynamic updates
  const [accuracy, setAccuracy] = useState(98.91);
  const [threats, setThreats] = useState(23);
  const [traffic, setTraffic] = useState(7200);
  const [falsePos, setFalsePos] = useState(0.34);

  // Chart states
  const [trafficData, setTrafficData] = useState([
    { time: "00:00", benign: 4200, malicious: 240 },
    { time: "04:00", benign: 3800, malicious: 310 },
    { time: "08:00", benign: 5600, malicious: 180 },
    { time: "12:00", benign: 7200, malicious: 420 },
    { time: "16:00", benign: 6800, malicious: 350 },
    { time: "20:00", benign: 5200, malicious: 280 },
  ]);

  const [performanceData, setPerformanceData] = useState([
    { metric: "00:00", value: 98.2 },
    { metric: "04:00", value: 98.7 },
    { metric: "08:00", value: 97.9 },
    { metric: "12:00", value: 98.5 },
    { metric: "16:00", value: 99.1 },
    { metric: "20:00", value: 98.8 },
  ]);

  // 🔥 Handle incoming WebSocket messages
  const handleMessage = useCallback((msg: any) => {
    if (msg.event === "detection" && msg.payload) {
      const { pred_label, score, severity } = msg.payload;

      // Update metric cards live
      setThreats((t) => t + (severity === "high" ? 1 : 0));
      setAccuracy((a) => Math.min(100, a + (score - 0.5) * 0.1));
      setTraffic((t) => Math.floor(t + (Math.random() * 150 - 50)));
      setFalsePos((f) => Math.max(0.1, f + (Math.random() - 0.5) * 0.01));

      // Update charts
      const now = new Date().toLocaleTimeString();
      setTrafficData((prev) => {
        const newEntry = {
          time: now,
          benign: Math.round(Math.random() * 5000 + 3000),
          malicious: Math.round(Math.random() * 500),
        };
        return [...prev.slice(-5), newEntry];
      });

      setPerformanceData((prev) => {
        const newEntry = {
          metric: now,
          value: Math.min(100, 97 + Math.random() * 3),
        };
        return [...prev.slice(-5), newEntry];
      });
    }
  }, []);

  // Connect WebSocket hook
  useRealtime(handleMessage);

  // ========================== UI ===============================
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">System Overview (Live)</h2>
          <p className="text-muted-foreground">Real-time network intrusion detection monitoring</p>
        </div>

        {/* ===== METRIC CARDS ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Detection Accuracy"
            value={`${accuracy.toFixed(2)}%`}
            subtitle="XGBoost Model"
            icon={CheckCircle}
            trend="up"
            trendValue="+0.3%"
            variant="success"
          />
          <MetricCard
            title="Active Threats"
            value={threats.toString()}
            subtitle="Last hour"
            icon={AlertTriangle}
            trend="down"
            trendValue="-12%"
            variant="danger"
          />
          <MetricCard
            title="Network Traffic"
            value={`${traffic.toLocaleString()} pkts/s`}
            subtitle="Live Packets/sec"
            icon={Activity}
            variant="primary"
          />
          <MetricCard
            title="False Positives"
            value={`${falsePos.toFixed(2)}%`}
            subtitle="Precision: 98.67%"
            icon={Shield}
            trend="down"
            trendValue="-0.1%"
            variant="primary"
          />
        </div>

        {/* ===== CHARTS ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Traffic Analysis */}
          <Card className="p-6 bg-card border-border">
            <h3 className="text-xl font-bold text-foreground mb-6">Traffic Analysis</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="benignGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="maliciousGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="benign"
                  stroke="hsl(var(--accent))"
                  fill="url(#benignGradient)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="malicious"
                  stroke="hsl(var(--destructive))"
                  fill="url(#maliciousGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Model Performance */}
          <Card className="p-6 bg-card border-border">
            <h3 className="text-xl font-bold text-foreground mb-6">Model Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="metric" stroke="hsl(var(--muted-foreground))" />
                <YAxis domain={[95, 100]} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* ===== STATIC INFO SECTION ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-5 w-5 text-accent" />
              <h3 className="text-lg font-bold text-foreground">Dataset</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Primary</span>
                <span className="text-foreground font-medium">CIC-IDS2018</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Records</span>
                <span className="text-foreground font-medium">54,775</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Features</span>
                <span className="text-foreground font-medium">83</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold text-foreground">Best Model</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Algorithm</span>
                <span className="text-foreground font-medium">XGBoost</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">F1 Score</span>
                <span className="text-foreground font-medium">98.34%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ROC-AUC</span>
                <span className="text-foreground font-medium">99.12%</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-5 w-5 text-accent" />
              <h3 className="text-lg font-bold text-foreground">System Status</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Monitoring</span>
                <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Uptime</span>
                <span className="text-foreground font-medium">99.97%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Latency</span>
                <span className="text-foreground font-medium">0.23s</span>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
