function Badge({ status }) {
  const styles = {
    Planning: "bg-yellow-100 text-yellow-700",
    Pending: "bg-yellow-100 text-yellow-700",
    "In Progress": "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-sm ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export default Badge;