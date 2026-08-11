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
      {options.map((option) => {
        const optionValue =
          typeof option === "object"
            ? option.value
            : option;

        const optionLabel =
          typeof option === "object"
            ? option.label
            : option;

        return (
          <option
            key={optionValue}
            value={optionValue}
          >
            {optionLabel}
          </option>
        );
      })}
    </select>
  );
}

export default Select;