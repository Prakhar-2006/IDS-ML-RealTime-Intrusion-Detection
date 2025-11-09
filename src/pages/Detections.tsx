import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, Shield, Clock } from "lucide-react";

const Detections = () => {
  const recentDetections = [
    {
      id: "DET-001",
      timestamp: "2024-01-09 14:23:45",
      sourceIP: "192.168.1.143",
      destIP: "10.0.0.5",
      attackType: "DDoS",
      severity: "high",
      confidence: 0.967,
      status: "blocked",
    },
    {
      id: "DET-002",
      timestamp: "2024-01-09 14:22:12",
      sourceIP: "172.16.0.89",
      destIP: "10.0.0.12",
      attackType: "Port Scan",
      severity: "medium",
      confidence: 0.823,
      status: "monitoring",
    },
    {
      id: "DET-003",
      timestamp: "2024-01-09 14:20:33",
      sourceIP: "10.1.1.254",
      destIP: "10.0.0.8",
      attackType: "Brute Force",
      severity: "high",
      confidence: 0.941,
      status: "blocked",
    },
    {
      id: "DET-004",
      timestamp: "2024-01-09 14:18:56",
      sourceIP: "192.168.2.71",
      destIP: "10.0.0.3",
      attackType: "Web Attack",
      severity: "medium",
      confidence: 0.789,
      status: "monitoring",
    },
    {
      id: "DET-005",
      timestamp: "2024-01-09 14:15:22",
      sourceIP: "203.0.113.42",
      destIP: "10.0.0.15",
      attackType: "DoS",
      severity: "critical",
      confidence: 0.993,
      status: "blocked",
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-destructive text-destructive-foreground";
      case "high": return "bg-destructive/70 text-destructive-foreground";
      case "medium": return "bg-warning-glow/70 text-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    return status === "blocked" ? <Shield className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Real-time Detections</h2>
          <p className="text-muted-foreground">Live intrusion detection and threat monitoring</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-card border-border shadow-[0_0_20px_-5px_hsl(var(--danger-glow))]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Threats</p>
                <p className="text-3xl font-bold text-foreground">127</p>
                <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </Card>

          <Card className="p-6 bg-card border-border shadow-[0_0_20px_-5px_hsl(var(--success-glow))]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Blocked</p>
                <p className="text-3xl font-bold text-foreground">89</p>
                <p className="text-xs text-muted-foreground mt-1">70% blocked rate</p>
              </div>
              <Shield className="h-8 w-8 text-accent" />
            </div>
          </Card>

          <Card className="p-6 bg-card border-border shadow-[0_0_20px_-5px_hsl(var(--cyber-glow))]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg Response</p>
                <p className="text-3xl font-bold text-foreground">0.23s</p>
                <p className="text-xs text-muted-foreground mt-1">Detection latency</p>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </Card>
        </div>

        <Card className="p-6 bg-card border-border">
          <h3 className="text-xl font-bold text-foreground mb-6">Recent Detections</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Source IP</TableHead>
                <TableHead>Destination IP</TableHead>
                <TableHead>Attack Type</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentDetections.map((detection) => (
                <TableRow key={detection.id}>
                  <TableCell className="font-mono text-sm">{detection.id}</TableCell>
                  <TableCell className="text-sm">{detection.timestamp}</TableCell>
                  <TableCell className="font-mono text-sm">{detection.sourceIP}</TableCell>
                  <TableCell className="font-mono text-sm">{detection.destIP}</TableCell>
                  <TableCell>
                    <span className="font-medium text-foreground">{detection.attackType}</span>
                  </TableCell>
                  <TableCell>
                    <Badge className={getSeverityColor(detection.severity)}>
                      {detection.severity}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {(detection.confidence * 100).toFixed(1)}%
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(detection.status)}
                      <span className="text-sm capitalize">{detection.status}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </main>
    </div>
  );
};

export default Detections;
