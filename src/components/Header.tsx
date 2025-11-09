import { Shield, Activity, Database, BarChart3, AlertTriangle } from "lucide-react";
import { NavLink } from "./NavLink";

const Header = () => {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Shield className="h-8 w-8 text-primary" />
              <div className="absolute inset-0 animate-pulse blur-md bg-primary/50" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">IDS-ML</h1>
              <p className="text-xs text-muted-foreground">Intrusion Detection System</p>
            </div>
          </div>
          
          <nav className="flex items-center gap-1">
            <NavLink
              to="/"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
              activeClassName="text-primary bg-secondary"
            >
              <Activity className="h-4 w-4" />
              <span className="text-sm font-medium">Dashboard</span>
            </NavLink>
            <NavLink
              to="/models"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
              activeClassName="text-primary bg-secondary"
            >
              <Database className="h-4 w-4" />
              <span className="text-sm font-medium">Models</span>
            </NavLink>
            <NavLink
              to="/analysis"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
              activeClassName="text-primary bg-secondary"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="text-sm font-medium">Analysis</span>
            </NavLink>
            <NavLink
              to="/detections"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
              activeClassName="text-primary bg-secondary"
            >
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">Detections</span>
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
