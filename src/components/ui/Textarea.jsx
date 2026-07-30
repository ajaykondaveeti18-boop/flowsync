function Textarea({
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
}) {
  return (
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
    />
  );
}

export default Textarea;