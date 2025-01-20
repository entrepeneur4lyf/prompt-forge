import { Loader2 } from "lucide-react";
import { Card, CardContent } from "./card";

export function LoadingSpinner() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <Card className="w-full max-w-md mx-4 shadow-lg border-2">
        <CardContent className="p-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">Loading...</h2>
            <p className="text-sm text-muted-foreground">Please wait while we fetch your data</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}