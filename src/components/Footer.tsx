import { cn } from "@/lib/utils";

export const Footer = ({ className }: { className?: string }) => {
  return (
    <footer className={cn("w-full border-t bg-background", className)}>
      <div className="container flex flex-col items-center gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2024 WesleyReis. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};