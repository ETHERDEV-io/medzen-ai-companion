
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isActive?: boolean;
}

export default function FeatureCard({ icon, title, description, isActive = false }: FeatureCardProps) {
  return (
    <Card className={`border dark:border-blue-700/40 ${
      isActive 
        ? "bg-gradient-to-br from-blue-100/80 to-purple-100/60 dark:from-blue-900/40 dark:to-purple-900/40 shadow-md border-blue-200" 
        : "bg-gradient-to-br from-purple-50/80 to-blue-100/60 dark:from-purple-950/40 dark:to-blue-900/40"
    } shadow-sm hover:shadow-md transition-shadow`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex gap-2 items-center text-lg">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
