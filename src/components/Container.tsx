type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={`max-w-7xl mx-auto px-3 py-3 ${className ?? ""}`}>
      {children}
    </div>
  );
}
