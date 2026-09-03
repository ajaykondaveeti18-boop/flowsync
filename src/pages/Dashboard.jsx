import { useEffect, useState } from "react";

import {
  FolderKanban,
  CheckSquare,
  ClipboardCheck,
  StickyNote,
} from "lucide-react";

import { supabase } from "../lib/supabase";

import StatCard from "../components/dashboard/StatCard";
import RecentProjects from "../components/dashboard/RecentProjects";
import TodayTasks from "../components/dashboard/TodayTasks";
import AiCard from "../components/dashboard/AiCard";

function Dashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    tasks: 0,
    completed: 0,
    notes: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getDashboardStats() {
      setLoading(true);

      const [
        projectsResult,
        tasksResult,
        completedTasksResult,
        notesResult,
      ] = await Promise.all([
        supabase
          .from("projects")
          .select("*", { count: "exact", head: true }),

        supabase
          .from("tasks")
          .select("*", { count: "exact", head: true }),

        supabase
          .from("tasks")
          .select("*", { count: "exact", head: true })
          .eq("status", "Completed"),

        supabase
          .from("notes")
          .select("*", { count: "exact", head: true }),
      ]);

      if (projectsResult.error) {
        console.error(
          "Error fetching project count:",
          projectsResult.error
        );
      }

      if (tasksResult.error) {
        console.error(
          "Error fetching task count:",
          tasksResult.error
        );
      }

      if (completedTasksResult.error) {
        console.error(
          "Error fetching completed task count:",
          completedTasksResult.error
        );
      }

      if (notesResult.error) {
        console.error(
          "Error fetching note count:",
          notesResult.error
        );
      }

      setStats({
        projects: projectsResult.count || 0,
        tasks: tasksResult.count || 0,
        completed: completedTasksResult.count || 0,
        notes: notesResult.count || 0,
      });

      setLoading(false);
    }

    getDashboardStats();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back 👋
        </h1>

        <p className="mt-2 text-slate-500">
          Here's an overview of your workspace.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Projects"
          value={loading ? "..." : stats.projects}
          icon={FolderKanban}
          color="bg-blue-600"
        />

        <StatCard
          title="Tasks"
          value={loading ? "..." : stats.tasks}
          icon={CheckSquare}
          color="bg-green-600"
        />

        <StatCard
          title="Completed"
          value={loading ? "..." : stats.completed}
          icon={ClipboardCheck}
          color="bg-purple-600"
        />

        <StatCard
          title="Notes"
          value={loading ? "..." : stats.notes}
          icon={StickyNote}
          color="bg-orange-500"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentProjects />
        <TodayTasks />
      </div>

      <AiCard />
    </div>
  );
}

export default Dashboard;