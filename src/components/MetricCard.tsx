import { LucideIcon } from "lucide-react";
import { Card } from "./ui/card";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down";
  trendValue?: string;
  variant?: "primary" | "success" | "warning" | "danger";
}

const MetricCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  trendValue,
  variant = "primary" 
}: MetricCardProps) => {
  const glowColor = {
    primary: "shadow-[0_0_20px_-5px_hsl(var(--cyber-glow))]",
    success: "shadow-[0_0_20px_-5px_hsl(var(--success-glow))]",
    warning: "shadow-[0_0_20px_-5px_hsl(var(--warning-glow))]",
    danger: "shadow-[0_0_20px_-5px_hsl(var(--danger-glow))]",
  };

  const iconColor = {
    primary: "text-primary",
    success: "text-accent",
    warning: "text-warning-glow",
    danger: "text-destructive",
  };

  return (
    <Card className={`p-6 bg-card border-border hover:border-primary/50 transition-all ${glowColor[variant]}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg bg-secondary/50 ${iconColor[variant]}`}>
          <Icon className="h-6 w-6" />
        </div>
        {trend && trendValue && (
          <div className={`text-sm font-medium ${trend === "up" ? "text-accent" : "text-destructive"}`}>
            {trend === "up" ? "↑" : "↓"} {trendValue}
          </div>
        )}
      </div>
      <h3 className="text-sm text-muted-foreground mb-1">{title}</h3>
      <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
    </Card>
  );
};

export default MetricCard;
