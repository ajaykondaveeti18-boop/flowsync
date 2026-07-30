import { useState } from "react";

import taskData from "../data/tasks";

import TaskList from "../components/tasks/TaskList";
import TaskSearchBar from "../components/tasks/TaskSearchBar";
import CreateTaskModal from "../components/tasks/CreateTaskModal";
import Button from "../components/ui/Button";

function Tasks() {
  const [tasks, setTasks] = useState(taskData);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
const [editingTask, setEditingTask] = useState(null);

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              status:
                task.status === "Completed"
                  ? "Pending"
                  : "Completed",
            }
          : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) =>
      prev.filter((task) => task.id !== id)
    );
  };
  const saveTask = (task) => {
  if (editingTask) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === editingTask.id
          ? { ...task, id: editingTask.id }
          : t
      )
    );
  } else {
    setTasks((prev) => [
      {
        id: Date.now(),
        ...task,
      },
      ...prev,
    ]);
  }

  setEditingTask(null);
  setIsModalOpen(false);
};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Tasks
        </h1>

   <Button onClick={() => setIsModalOpen(true)}>
  + New Task
</Button>
      </div>

      <TaskSearchBar
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <TaskList
  tasks={filteredTasks}
  onToggle={toggleTask}
  onDelete={deleteTask}
  onEdit={(task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  }}
/>
    
    <CreateTaskModal
  open={isModalOpen}
  onClose={() => {
    setIsModalOpen(false);
    setEditingTask(null);
  }}
  onCreate={saveTask}
  editingTask={editingTask}
/>
    </div>
  );
}

export default Tasks;