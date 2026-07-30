function TaskSearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder="Search tasks..."
      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
    />
  );
}

export default TaskSearchBar;