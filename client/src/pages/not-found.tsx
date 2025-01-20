import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <Card className="w-full max-w-2xl mx-4 shadow-lg border-2">
        <CardContent className="p-12">
          <div className="flex flex-col items-center text-center space-y-6">
            <AlertCircle className="h-24 w-24 text-destructive animate-pulse" />
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-foreground">404 Page Not Found</h1>
              <p className="text-xl text-muted-foreground">
                The page you're looking for doesn't exist or has been moved.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}