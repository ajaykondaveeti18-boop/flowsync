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

  // Fetch tasks and projects
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError("");

      const [tasksResult, projectsResult] = await Promise.all([
        supabase
          .from("tasks")
          .select(`
            *,
            projects (
              id,
              name
            )
          `)
          .order("created_at", { ascending: false }),

        supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false }),
      ]);

      if (tasksResult.error) {
        console.error(
          "Error fetching tasks:",
          tasksResult.error
        );
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

  // Create or update task
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
        .select(`
          *,
          projects (
            id,
            name
          )
        `)
        .single();

      if (error) {
        console.error(
          "Error updating task:",
          error
        );
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
        setError(
          "You must be logged in to create a task."
        );
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
        .select(`
          *,
          projects (
            id,
            name
          )
        `)
        .single();

      if (error) {
        console.error(
          "Error creating task:",
          error
        );
        setError("Unable to create task.");
        return;
      }

      setTasks((prev) => [data, ...prev]);
    }

    setEditingTask(null);
    setIsModalOpen(false);
  };

  // Delete task
  const deleteTask = async (id) => {
    setError("");

    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(
        "Error deleting task:",
        error
      );
      setError("Unable to delete task.");
      return;
    }

    setTasks((prev) =>
      prev.filter((task) => task.id !== id)
    );
  };

  // Toggle task status
  const toggleTask = async (id) => {
    setError("");

    const task = tasks.find(
      (item) => item.id === id
    );

    if (!task) return;

    const newStatus =
      task.status === "Completed"
        ? "Pending"
        : "Completed";

    const { data, error } = await supabase
      .from("tasks")
      .update({
        status: newStatus,
      })
      .eq("id", id)
      .select(`
        *,
        projects (
          id,
          name
        )
      `)
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Tasks
        </h1>

        <Button
          onClick={() => setIsModalOpen(true)}
        >
          + New Task
        </Button>
      </div>

      <TaskSearchBar
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-slate-500">
          Loading tasks...
        </p>
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

      <CreateTaskModal
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