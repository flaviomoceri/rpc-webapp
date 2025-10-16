import { type ContainerProps } from "@/lib";

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={`max-w-7xl mx-auto px-3 py-3 ${className ?? ""}`}>
      {children}
    </div>
  );
}
