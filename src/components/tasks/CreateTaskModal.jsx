import { useEffect, useState } from "react";

import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";

function CreateTaskModal({
  open,
  onClose,
  onCreate,
  editingTask,
  projects,
}) {
  const [form, setForm] = useState({
    title: "",
    project_id: "",
    status: "Pending",
  });

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title,
        project_id: editingTask.project_id || "",
        status: editingTask.status,
      });
    } else {
      setForm({
        title: "",
        project_id: "",
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
    if (!form.project_id) return;

    onCreate(form);
  };

  const projectOptions = [
    {
      value: "",
      label: "Select Project",
    },
    ...projects.map((project) => ({
      value: project.id,
      label: project.name,
    })),
  ];

  const statusOptions = [
    {
      value: "Pending",
      label: "Pending",
    },
    {
      value: "Completed",
      label: "Completed",
    },
  ];

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
          <Input
            type="text"
            name="title"
            placeholder="Task Title"
            value={form.title}
            onChange={handleChange}
          />

          <Select
            name="project_id"
            value={form.project_id}
            onChange={handleChange}
            options={projectOptions}
          />

          <Select
            name="status"
            value={form.status}
            onChange={handleChange}
            options={statusOptions}
          />

          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button type="submit">
              {editingTask ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTaskModal;