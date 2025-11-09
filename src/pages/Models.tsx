import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Cpu, Zap, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Models = () => {
  const models = [
    {
      name: "Random Forest",
      type: "Tree-based",
      accuracy: 0.9823,
      f1Score: 0.9756,
      precision: 0.9801,
      recall: 0.9712,
      status: "deployed",
      icon: Brain,
    },
    {
      name: "XGBoost",
      type: "Gradient Boosting",
      accuracy: 0.9891,
      f1Score: 0.9834,
      precision: 0.9867,
      recall: 0.9802,
      status: "deployed",
      icon: Zap,
    },
    {
      name: "LightGBM",
      type: "Gradient Boosting",
      accuracy: 0.9876,
      f1Score: 0.9821,
      precision: 0.9845,
      recall: 0.9798,
      status: "deployed",
      icon: Cpu,
    },
    {
      name: "Deep Neural Network",
      type: "Deep Learning",
      accuracy: 0.9754,
      f1Score: 0.9678,
      precision: 0.9712,
      recall: 0.9645,
      status: "training",
      icon: Target,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Model Performance</h2>
          <p className="text-muted-foreground">Comparison of trained ML models for intrusion detection</p>
        </div>

        <div className="grid gap-6">
          {models.map((model, index) => {
            const Icon = model.icon;
            return (
              <Card key={index} className="p-6 bg-card border-border hover:border-primary/50 transition-all">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-secondary/50">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{model.name}</h3>
                      <p className="text-sm text-muted-foreground">{model.type}</p>
                    </div>
                  </div>
                  <Badge 
                    variant={model.status === "deployed" ? "default" : "secondary"}
                    className={model.status === "deployed" ? "bg-accent text-accent-foreground" : ""}
                  >
                    {model.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Accuracy</p>
                    <p className="text-2xl font-bold text-foreground">{(model.accuracy * 100).toFixed(2)}%</p>
                    <Progress value={model.accuracy * 100} className="mt-2" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">F1 Score</p>
                    <p className="text-2xl font-bold text-foreground">{(model.f1Score * 100).toFixed(2)}%</p>
                    <Progress value={model.f1Score * 100} className="mt-2" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Precision</p>
                    <p className="text-2xl font-bold text-foreground">{(model.precision * 100).toFixed(2)}%</p>
                    <Progress value={model.precision * 100} className="mt-2" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Recall</p>
                    <p className="text-2xl font-bold text-foreground">{(model.recall * 100).toFixed(2)}%</p>
                    <Progress value={model.recall * 100} className="mt-2" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Models;
