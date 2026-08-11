import { CheckCircle2, Circle, Pencil, Trash2 } from "lucide-react";

import Button from "../ui/Button";

function TaskCard({ task, onToggle, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-between rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => onToggle(task.id)}
          className="rounded-full"
          aria-label={
            task.status === "Completed"
              ? "Mark task as pending"
              : "Mark task as completed"
          }
        >
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
            {task.projects?.name || "No project"}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="icon"
          onClick={() => onEdit(task)}
          aria-label="Edit task"
        >
          <Pencil size={18} />
        </Button>

        <Button
          variant="iconDanger"
          onClick={() => onDelete(task.id)}
          aria-label="Delete task"
        >
          <Trash2 size={18} />
        </Button>
      </div>
    </div>
  );
}

export default TaskCard;