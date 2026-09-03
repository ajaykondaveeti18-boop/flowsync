import { useState } from "react";

import Button from "../ui/Button";
import Input from "../ui/Input";
import Modal from "../ui/Modal";
import Textarea from "../ui/Textarea";
import Select from "../ui/Select";

function CreateProjectModal({
  open,
  onClose,
  onCreate,
  editingProject,
}) {
  const [form, setForm] = useState({
    name: editingProject?.name || "",
    description: editingProject?.description || "",
    status: editingProject?.status || "Planning",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) return;

    onCreate(form);

    setForm({
      name: "",
      description: "",
      status: "Planning",
    });
  };

  if (!open) return null;

  return (
    <Modal open={open}>
      <h2 className="mb-5 text-2xl font-bold">
        {editingProject ? "Edit Project" : "Create Project"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Project Name"
        />

        <Textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
        />

        <Select
          name="status"
          value={form.status}
          onChange={handleChange}
          options={[
            "Planning",
            "In Progress",
            "Completed",
          ]}
        />

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button type="submit">
            {editingProject ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default CreateProjectModal;