function Select({
  name,
  value,
  onChange,
  options,
}) {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
    >
      {options.map((option) => (
        <option
          key={option}
          value={option}
        >
          {option}
        </option>
      ))}
    </select>
  );
}

export default Select;