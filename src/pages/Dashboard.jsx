import {
  FolderKanban,
  CheckSquare,
  ClipboardCheck,
  StickyNote,
} from "lucide-react";


import StatCard from "../components/dashboard/StatCard";
import RecentProjects from "../components/dashboard/RecentProjects";
import TodayTasks from "../components/dashboard/TodayTasks";
import AiCard from "../components/dashboard/AiCard";

function Dashboard() {
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
          value="12"
          icon={FolderKanban}
          color="bg-blue-600"
        />

        <StatCard
          title="Tasks"
          value="28"
          icon={CheckSquare}
          color="bg-green-600"
        />

        <StatCard
          title="Completed"
          value="19"
          icon={ClipboardCheck}
          color="bg-purple-600"
        />

        <StatCard
          title="Notes"
          value="14"
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