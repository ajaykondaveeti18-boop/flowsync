function Textarea({
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
  disabled = false,
}) {
  return (
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      className="w-full resize-none rounded-lg border border-slate-300 p-3 outline-none transition focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
    />
  );
}

export default Textarea;