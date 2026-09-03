import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

import TaskList from "../components/tasks/TaskList";
import TaskSearchBar from "../components/tasks/TaskSearchBar";
import CreateTaskModal from "../components/tasks/CreateTaskModal";
import Button from "../components/ui/Button";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError("");

      const [tasksResult, projectsResult] = await Promise.all([
        supabase
          .from("tasks")
          .select(`*, projects (id, name)`)
          .order("created_at", { ascending: false }),

        supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false }),
      ]);

      if (tasksResult.error) {
        console.error("Error fetching tasks:", tasksResult.error);
        setError("Unable to load tasks.");
        setLoading(false);
        return;
      }

      if (projectsResult.error) {
        console.error(
          "Error fetching projects:",
          projectsResult.error
        );
        setError("Unable to load projects.");
        setLoading(false);
        return;
      }

      setTasks(tasksResult.data);
      setProjects(projectsResult.data);
      setLoading(false);
    }

    loadData();
  }, []);

  const saveTask = async (task) => {
    setError("");

    if (editingTask) {
      const { data, error } = await supabase
        .from("tasks")
        .update({
          title: task.title,
          project_id: Number(task.project_id),
          status: task.status,
        })
        .eq("id", editingTask.id)
        .select(`*, projects (id, name)`)
        .single();

      if (error) {
        console.error("Error updating task:", error);
        setError("Unable to update task.");
        return;
      }

      setTasks((prev) =>
        prev.map((item) =>
          item.id === editingTask.id ? data : item
        )
      );
    } else {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("You must be logged in to create a task.");
        return;
      }

      const { data, error } = await supabase
        .from("tasks")
        .insert([
          {
            user_id: user.id,
            project_id: Number(task.project_id),
            title: task.title,
            status: task.status,
          },
        ])
        .select(`*, projects (id, name)`)
        .single();

      if (error) {
        console.error("Error creating task:", error);
        setError("Unable to create task.");
        return;
      }

      setTasks((prev) => [data, ...prev]);
    }

    setEditingTask(null);
    setIsModalOpen(false);
  };

  const deleteTask = async (id) => {
    setError("");

    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting task:", error);
      setError("Unable to delete task.");
      return;
    }

    setTasks((prev) =>
      prev.filter((task) => task.id !== id)
    );
  };

  const toggleTask = async (id) => {
    setError("");

    const task = tasks.find((item) => item.id === id);

    if (!task) return;

    const newStatus =
      task.status === "Completed"
        ? "Pending"
        : "Completed";

    const { data, error } = await supabase
      .from("tasks")
      .update({ status: newStatus })
      .eq("id", id)
      .select(`*, projects (id, name)`)
      .single();

    if (error) {
      console.error(
        "Error updating task status:",
        error
      );
      setError("Unable to update task status.");
      return;
    }

    setTasks((prev) =>
      prev.map((item) =>
        item.id === id ? data : item
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>

          {!loading && (
            <p className="mt-1 text-sm text-slate-500">
              {tasks.length}{" "}
              {tasks.length === 1 ? "task" : "tasks"} in your workspace
            </p>
          )}
        </div>

        <Button onClick={() => setIsModalOpen(true)}>
          + New Task
        </Button>
      </div>

      {/* Search */}
      <TaskSearchBar
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="rounded-xl border bg-white p-8 text-center">
          <p className="text-sm text-slate-500">
            Loading tasks...
          </p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="rounded-xl border bg-white p-8 text-center">
          <h2 className="text-lg font-semibold text-slate-800">
            {search ? "No tasks found" : "No tasks yet"}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {search
              ? "Try a different search term."
              : "Create your first task to get started."}
          </p>

          {!search && (
            <Button
              className="mt-5"
              onClick={() => setIsModalOpen(true)}
            >
              + Create Task
            </Button>
          )}
        </div>
      ) : (
        <TaskList
          tasks={filteredTasks}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onEdit={(task) => {
            setEditingTask(task);
            setIsModalOpen(true);
          }}
        />
      )}

      {/* Modal */}
     <CreateTaskModal
  key={editingTask?.id ?? "new"}
  open={isModalOpen}
  onClose={() => {
    setIsModalOpen(false);
    setEditingTask(null);
  }}
  onCreate={saveTask}
  editingTask={editingTask}
  projects={projects}
/>
    </div>
  );
}

export default Tasks;