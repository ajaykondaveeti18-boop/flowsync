import { useEffect, useState } from "react";

import { supabase } from "../../lib/supabase";

import Card from "../ui/Card";

function TodayTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getTodayTasks() {
      const { data, error } = await supabase
        .from("tasks")
        .select("id, title, status, created_at")
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) {
        console.error(
          "Error fetching today's tasks:",
          error
        );

        setLoading(false);
        return;
      }

      setTasks(data);
      setLoading(false);
    }

    getTodayTasks();
  }, []);

  const toggleTask = async (task) => {
    const newStatus =
      task.status === "Completed"
        ? "Pending"
        : "Completed";

    const { data, error } = await supabase
      .from("tasks")
      .update({
        status: newStatus,
      })
      .eq("id", task.id)
      .select("id, title, status, created_at")
      .single();

    if (error) {
      console.error(
        "Error updating task:",
        error
      );
      return;
    }

    setTasks((prev) =>
      prev.map((item) =>
        item.id === task.id ? data : item
      )
    );
  };

  return (
    <Card>
      <h2 className="mb-5 text-lg font-semibold">
        Today's Tasks
      </h2>

      {loading ? (
        <p className="text-sm text-slate-500">
          Loading tasks...
        </p>
      ) : tasks.length === 0 ? (
        <p className="text-sm text-slate-500">
          No tasks yet.
        </p>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <label
              key={task.id}
              className="flex cursor-pointer items-center gap-3 rounded-lg border p-4"
            >
              <input
                type="checkbox"
                checked={task.status === "Completed"}
                onChange={() => toggleTask(task)}
                className="h-4 w-4"
              />

              <span
                className={
                  task.status === "Completed"
                    ? "text-slate-400 line-through"
                    : ""
                }
              >
                {task.title}
              </span>
            </label>
          ))}
        </div>
      )}
    </Card>
  );
}

export default TodayTasks;