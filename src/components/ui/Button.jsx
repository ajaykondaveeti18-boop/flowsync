function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
}) {
  const styles = {
    primary:
      "bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow-md active:scale-[0.98]",

    secondary:
      "border border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-50 active:scale-[0.98]",

    danger:
      "bg-red-600 text-white shadow-sm hover:bg-red-700 active:scale-[0.98]",

    icon:
      "p-2 text-slate-600 hover:bg-slate-100",

    iconDanger:
      "p-2 text-red-500 hover:bg-red-100",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;