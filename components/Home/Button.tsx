import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-lg hover:shadow-xl",
    secondary:
      "bg-white text-red-600 border-2 border-red-600 hover:bg-red-50 focus:ring-red-500",
    outline:
      "bg-transparent text-white border-2 border-white hover:bg-white hover:text-red-600 focus:ring-white",
    ghost:
      "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
