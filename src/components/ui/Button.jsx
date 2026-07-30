function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
}) {
  const styles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "border bg-white hover:bg-slate-100",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium transition ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;