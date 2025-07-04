import { ReactNode } from "react";
import { Brain } from "lucide-react";

interface SetupLayoutProps {
  children: ReactNode;
}

export const SetupLayout = ({ children }: SetupLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Simple header without any notification components */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 relative z-50">
        <div className="flex h-16 items-center gap-3 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Brain className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg">FlowIQ</span>
              <p className="text-xs text-muted-foreground">Practice Management Platform</p>
            </div>
          </div>
        </div>
      </header>
      
      {/* Use a container that prevents any global positioned elements from showing */}
      <main className="flex-1 relative">
        <div className="isolate">
          {children}
        </div>
      </main>
    </div>
  );
};