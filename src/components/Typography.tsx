type TypographyProps = React.HTMLAttributes<
  HTMLHeadingElement | HTMLParagraphElement
> & {
  children: React.ReactNode;
};

export function H1({ children, className, ...rest }: TypographyProps) {
  return (
    <h1
      className={`text-4xl font-bold text-black mb-2 ${className ?? ""}`}
      {...rest}
    >
      {children}
    </h1>
  );
}

export function H3({ children, className, ...rest }: TypographyProps) {
  return (
    <h3
      className={`text-xl font-semibold text-gray-900 ${className ?? ""}`}
      {...rest}
    >
      {children}
    </h3>
  );
}

export function H4({ children, className, ...rest }: TypographyProps) {
  return (
    <h4
      className={`text-lg font-semibold text-gray-900 ${className ?? ""}`}
      {...rest}
    >
      {children}
    </h4>
  );
}

export function P({ children, className, ...rest }: TypographyProps) {
  return (
    <p className={`text-base text-gray ${className ?? ""}`} {...rest}>
      {children}
    </p>
  );
}
