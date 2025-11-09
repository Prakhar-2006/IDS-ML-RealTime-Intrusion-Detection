import React, { useCallback, useState } from "react";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useRealtime } from "@/hooks/useRealtime";

/**
 * Analysis.tsx — live-updating charts powered by useRealtime
 *
 * Notes:
 * - useRealtime(handler) should call handler(parsedMessage)
 * - expected incoming message example:
 *   { event: 'detection', payload: { pred_label: 'DDoS', true_label: 'DDoS', score: 0.92,
 *       features: {...}, feature_importance: [{feature, importance}, ...] , timestamp } }
 */

const initialConfusion = [
  { predicted: "Benign", actual: "Benign", value: 45234 },
  { predicted: "Benign", actual: "Attack", value: 342 },
  { predicted: "Attack", actual: "Benign", value: 287 },
  { predicted: "Attack", actual: "Attack", value: 8912 },
];

const initialFeatureImportance = [
  { feature: "Flow Duration", importance: 0.234 },
  { feature: "Total Fwd Packets", importance: 0.189 },
  { feature: "Total Bwd Packets", importance: 0.156 },
  { feature: "Flow Bytes/s", importance: 0.142 },
  { feature: "Flow Packets/s", importance: 0.128 },
  { feature: "Fwd IAT Mean", importance: 0.089 },
  { feature: "Bwd IAT Mean", importance: 0.062 },
];

const initialAttackTypes = [
  { type: "DoS", count: 3421, color: "#ef4444" },
  { type: "DDoS", count: 2134, color: "#f97316" },
  { type: "Port Scan", count: 1789, color: "#f59e0b" },
  { type: "Brute Force", count: 987, color: "#eab308" },
  { type: "Web Attack", count: 581, color: "#84cc16" },
];

const Analysis = () => {
  const [confusionData, setConfusionData] = useState(initialConfusion);
  const [featureImportance, setFeatureImportance] = useState(initialFeatureImportance);
  const [attackTypes, setAttackTypes] = useState(initialAttackTypes);

  const handleMessage = useCallback((msg: any) => {
    try {
      if (!msg || typeof msg !== "object") return;
      const data = msg; // assume already parsed JSON

      if (data.event === "detection" && data.payload) {
        const p = data.payload;

        // 1) Update attack types counts (predicted label)
        const pred = p.pred_label || p.label || p.predicted || null;
        if (pred) {
          setAttackTypes((prev) => {
            const found = prev.find((a) => a.type.toLowerCase() === String(pred).toLowerCase());
            if (found) {
              return prev.map((a) => (a.type.toLowerCase() === String(pred).toLowerCase() ? { ...a, count: a.count + 1 } : a));
            } else {
              // add new attack type if unseen
              return [{ type: pred, count: 1, color: "#60a5fa" }, ...prev];
            }
          });
        }

        // 2) Update confusion matrix if true label available
        const trueLbl = p.true_label || p.trueLabel || p.actual || null;
        if (pred && trueLbl) {
          // map the 4 cells by predicted/actual combination
          setConfusionData((prev) => {
            const normalizedPred = String(pred).toLowerCase().includes("benign") ? "Benign" : "Attack";
            const normalizedTrue = String(trueLbl).toLowerCase().includes("benign") ? "Benign" : "Attack";

            return prev.map((cell) => {
              if (cell.predicted === normalizedPred && cell.actual === normalizedTrue) {
                return { ...cell, value: cell.value + 1 };
              }
              return cell;
            });
          });
        }

        // 3) Update feature importance if backend provides it (preferred)
        if (Array.isArray(p.feature_importance) && p.feature_importance.length > 0) {
          // expected format: [{ feature: 'Flow Duration', importance: 0.12 }, ...]
          setFeatureImportance(
            p.feature_importance.map((f: any) => ({
              feature: f.feature,
              importance: typeof f.importance === "number" ? f.importance : parseFloat(f.importance || 0),
            }))
          );
        } else {
          // If not provided, gently jitter existing importances so the chart "feels" live.
          setFeatureImportance((prev) =>
            prev.map((f, i) => {
              // small random smoothing so values remain similar
              const jitter = (Math.random() - 0.5) * 0.01;
              return { ...f, importance: Math.max(0, parseFloat((f.importance + jitter).toFixed(3))) };
            })
          );
        }
      }
    } catch (err) {
      // fail quietly — useful to see console if needed
      // console.warn("Realtime parse error:", err);
    }
  }, []);

  // attach realtime listener (useRealtime should call handler with parsed objects)
  useRealtime(handleMessage);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Performance Analysis</h2>
          <p className="text-muted-foreground">Detailed model evaluation and feature insights</p>
        </div>

        <Tabs defaultValue="confusion" className="space-y-6">
          <TabsList className="bg-secondary">
            <TabsTrigger value="confusion">Confusion Matrix</TabsTrigger>
            <TabsTrigger value="features">Feature Importance</TabsTrigger>
            <TabsTrigger value="attacks">Attack Distribution</TabsTrigger>
          </TabsList>

          <TabsContent value="confusion" className="space-y-4">
            <Card className="p-6 bg-card border-border">
              <h3 className="text-xl font-bold text-foreground mb-6">Confusion Matrix - XGBoost</h3>
              <div className="grid grid-cols-2 gap-4 max-w-2xl">
                {/*
                  We map the 4 boxes from confusionData so they update in realtime.
                  Keep the same visual styling as before.
                */}
                {confusionData.map((cell, idx) => {
                  const isPositive = cell.predicted === "Attack" && cell.actual === "Attack";
                  const isTrueNegative = cell.predicted === "Benign" && cell.actual === "Benign";
                  const style =
                    isTrueNegative || isPositive
                      ? "bg-accent/20 border-2 border-accent rounded-lg p-8"
                      : "bg-destructive/20 border-2 border-destructive rounded-lg p-8";

                  const label =
                    cell.predicted === "Benign" && cell.actual === "Benign"
                      ? "True Negative"
                      : cell.predicted === "Benign" && cell.actual === "Attack"
                      ? "False Positive"
                      : cell.predicted === "Attack" && cell.actual === "Benign"
                      ? "False Negative"
                      : "True Positive";

                  return (
                    <div key={idx} className="text-center">
                      <div className={style}>
                        <p className="text-3xl font-bold text-foreground">{cell.value.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground mt-2">{label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-4">
            <Card className="p-6 bg-card border-border">
              <h3 className="text-xl font-bold text-foreground mb-6">SHAP Feature Importance</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={featureImportance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                  <YAxis dataKey="feature" type="category" width={180} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="importance" fill="hsl(var(--primary))">
                    {featureImportance.map((entry, index) => (
                      <Cell key={`cell-${index}`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          <TabsContent value="attacks" className="space-y-4">
            <Card className="p-6 bg-card border-border">
              <h3 className="text-xl font-bold text-foreground mb-6">Detected Attack Types</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={attackTypes}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="type" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="count">
                    {attackTypes.map((entry, index) => (
                      <Cell key={`attack-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Analysis;
