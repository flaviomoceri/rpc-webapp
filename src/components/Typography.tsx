type TypographyProps = React.HTMLAttributes<
  HTMLHeadingElement | HTMLParagraphElement
> & {
  children: React.ReactNode;
};

export function H1({ children, className, ...rest }: TypographyProps) {
  return (
    <h1
      className={`text-2xl font-bold text-black mb-1 ${className ?? ""}`}
      {...rest}
    >
      {children}
    </h1>
  );
}

export function H3({ children, className, ...rest }: TypographyProps) {
  return (
    <h3
      className={`text-base font-semibold text-gray-900 ${className ?? ""}`}
      {...rest}
    >
      {children}
    </h3>
  );
}

export function H4({ children, className, ...rest }: TypographyProps) {
  return (
    <h4
      className={`text-sm font-semibold text-gray-900 ${className ?? ""}`}
      {...rest}
    >
      {children}
    </h4>
  );
}

export function P({ children, className, ...rest }: TypographyProps) {
  return (
    <p className={`text-sm text-gray ${className ?? ""}`} {...rest}>
      {children}
    </p>
  );
}
