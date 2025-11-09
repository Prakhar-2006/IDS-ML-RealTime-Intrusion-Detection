import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const Analysis = () => {
  const confusionData = [
    { predicted: "Benign", actual: "Benign", value: 45234 },
    { predicted: "Benign", actual: "Attack", value: 342 },
    { predicted: "Attack", actual: "Benign", value: 287 },
    { predicted: "Attack", actual: "Attack", value: 8912 },
  ];

  const featureImportance = [
    { feature: "Flow Duration", importance: 0.234 },
    { feature: "Total Fwd Packets", importance: 0.189 },
    { feature: "Total Bwd Packets", importance: 0.156 },
    { feature: "Flow Bytes/s", importance: 0.142 },
    { feature: "Flow Packets/s", importance: 0.128 },
    { feature: "Fwd IAT Mean", importance: 0.089 },
    { feature: "Bwd IAT Mean", importance: 0.062 },
  ];

  const attackTypes = [
    { type: "DoS", count: 3421, color: "#ef4444" },
    { type: "DDoS", count: 2134, color: "#f97316" },
    { type: "Port Scan", count: 1789, color: "#f59e0b" },
    { type: "Brute Force", count: 987, color: "#eab308" },
    { type: "Web Attack", count: 581, color: "#84cc16" },
  ];

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
                <div className="text-center">
                  <div className="bg-accent/20 border-2 border-accent rounded-lg p-8">
                    <p className="text-3xl font-bold text-foreground">45,234</p>
                    <p className="text-sm text-muted-foreground mt-2">True Negative</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-destructive/20 border-2 border-destructive rounded-lg p-8">
                    <p className="text-3xl font-bold text-foreground">342</p>
                    <p className="text-sm text-muted-foreground mt-2">False Positive</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-destructive/20 border-2 border-destructive rounded-lg p-8">
                    <p className="text-3xl font-bold text-foreground">287</p>
                    <p className="text-sm text-muted-foreground mt-2">False Negative</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-accent/20 border-2 border-accent rounded-lg p-8">
                    <p className="text-3xl font-bold text-foreground">8,912</p>
                    <p className="text-sm text-muted-foreground mt-2">True Positive</p>
                  </div>
                </div>
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
                  <YAxis dataKey="feature" type="category" width={150} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }} 
                  />
                  <Bar dataKey="importance" fill="hsl(var(--primary))" />
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
                      borderRadius: "8px"
                    }} 
                  />
                  <Bar dataKey="count">
                    {attackTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
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
