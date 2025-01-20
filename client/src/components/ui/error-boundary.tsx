import { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "./card";
import { Button } from "./button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background">
          <Card className="w-full max-w-2xl mx-4 shadow-lg border-2">
            <CardContent className="p-12">
              <div className="flex flex-col items-center text-center space-y-6">
                <AlertCircle className="h-24 w-24 text-destructive animate-pulse" />
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold text-foreground">Something went wrong</h1>
                  <p className="text-xl text-muted-foreground">
                    {this.state.error?.message || "An unexpected error occurred"}
                  </p>
                </div>
                <Button 
                  onClick={() => window.location.reload()} 
                  size="lg"
                  className="mt-4"
                >
                  Refresh Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
