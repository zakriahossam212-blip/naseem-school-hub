import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface AppCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function AppCard({ children, className, hover = false }: AppCardProps) {
  return (
    <div
      className={cn(
        "bg-card rounded-lg border border-border p-5 shadow-card transition-all duration-200",
        hover && "hover:border-primary/30 hover:shadow-card-hover",
        className
      )}
    >
      {children}
    </div>
  );
}

interface AppCardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function AppCardHeader({ children, className }: AppCardHeaderProps) {
  return (
    <div className={cn("mb-4", className)}>
      {children}
    </div>
  );
}

interface AppCardTitleProps {
  children: ReactNode;
  className?: string;
}

export function AppCardTitle({ children, className }: AppCardTitleProps) {
  return (
    <h3 className={cn("text-lg font-semibold text-foreground", className)}>
      {children}
    </h3>
  );
}

interface AppCardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function AppCardDescription({ children, className }: AppCardDescriptionProps) {
  return (
    <p className={cn("text-sm text-muted-foreground mt-1", className)}>
      {children}
    </p>
  );
}

interface AppCardContentProps {
  children: ReactNode;
  className?: string;
}

export function AppCardContent({ children, className }: AppCardContentProps) {
  return (
    <div className={cn("", className)}>
      {children}
    </div>
  );
}

interface AppCardFooterProps {
  children: ReactNode;
  className?: string;
}

export function AppCardFooter({ children, className }: AppCardFooterProps) {
  return (
    <div className={cn("mt-4 pt-4 border-t border-border", className)}>
      {children}
    </div>
  );
}
