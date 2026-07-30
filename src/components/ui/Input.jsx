function Input({
  type = "text",
  name,
  value,
  onChange,
  placeholder,
}) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
    />
  );
}

export default Input;