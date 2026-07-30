import { useEffect, useState } from "react";

function CreateTaskModal({
  open,
  onClose,
  onCreate,
  editingTask,
}) {
  const [form, setForm] = useState({
    title: "",
    project: "",
    status: "Pending",
  });

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title,
        project: editingTask.project,
        status: editingTask.status,
      });
    } else {
      setForm({
        title: "",
        project: "",
        status: "Pending",
      });
    }
  }, [editingTask]);

  if (!open) return null;

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title.trim()) return;

    onCreate(form);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6">
        <h2 className="mb-5 text-2xl font-bold">
          {editingTask ? "Edit Task" : "Create Task"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            type="text"
            name="title"
            placeholder="Task Title"
            value={form.title}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
          />

          <input
            type="text"
            name="project"
            placeholder="Project Name"
            value={form.project}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
          >
            <option>Pending</option>
            <option>Completed</option>
          </select>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-white"
            >
              {editingTask ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTaskModal;