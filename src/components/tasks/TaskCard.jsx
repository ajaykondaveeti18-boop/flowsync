import { CheckCircle2, Circle, Pencil, Trash2 } from "lucide-react";

function TaskCard({ task, onToggle, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-between rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <button onClick={() => onToggle(task.id)}>
          {task.status === "Completed" ? (
            <CheckCircle2 className="text-green-600" />
          ) : (
            <Circle className="text-slate-400" />
          )}
        </button>

        <div>
          <h3
            className={`font-semibold ${
              task.status === "Completed"
                ? "line-through text-slate-400"
                : ""
            }`}
          >
            {task.title}
          </h3>

          <p className="text-sm text-slate-500">
            {task.project}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(task)}
          className="rounded-lg p-2 hover:bg-slate-100"
        >
          <Pencil size={18} />
        </button>

        <button
          onClick={() => onDelete(task.id)}
          className="rounded-lg p-2 text-red-500 hover:bg-red-100"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

export default TaskCard;