import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background text-foreground">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-extrabold tracking-tight flex items-center justify-center gap-2">
          Next.js + shadcn/ui <Sparkles className="h-8 w-8 text-yellow-500 animate-pulse" />
        </h1>
        
        <p className="text-muted-foreground max-w-md">
          Ambiente configurado com sucesso usando TypeScript, Tailwind CSS e Lucide Icons.
        </p>

        <Button className="gap-2">
          Continuar <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </main>
  );
}
