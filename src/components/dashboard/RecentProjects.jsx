import { useEffect, useState } from "react";

import { supabase } from "../../lib/supabase";

import Card from "../ui/Card";

function RecentProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getRecentProjects() {
      const { data, error } = await supabase
        .from("projects")
        .select("id, name, status")
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) {
        console.error(
          "Error fetching recent projects:",
          error
        );

        setLoading(false);
        return;
      }

      setProjects(data);
      setLoading(false);
    }

    getRecentProjects();
  }, []);

  return (
    <Card>
      <h2 className="mb-5 text-lg font-semibold">
        Recent Projects
      </h2>

      {loading ? (
        <p className="text-sm text-slate-500">
          Loading projects...
        </p>
      ) : projects.length === 0 ? (
        <p className="text-sm text-slate-500">
          No projects yet.
        </p>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <p className="font-medium">
                {project.name}
              </p>

              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                {project.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export default RecentProjects;