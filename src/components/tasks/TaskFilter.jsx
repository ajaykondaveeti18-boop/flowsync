function TaskFilter({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="rounded-lg border px-3 py-2"
    >
      <option value="All">All</option>
      <option value="Pending">Pending</option>
      <option value="Completed">Completed</option>
    </select>
  );
}

export default TaskFilter;