import TaskCard from "./TaskCard";

function TaskList({
  tasks,
  onToggle,
  onEdit,
  onDelete,
}) {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default TaskList;