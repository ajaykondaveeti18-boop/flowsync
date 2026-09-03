import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

import SearchBar from "../components/projects/SearchBar";
import ProjectList from "../components/projects/ProjectList";
import CreateProjectModal from "../components/projects/CreateProjectModal";
import Button from "../components/ui/Button";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    async function getProjects() {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching projects:", error);
        setError("Unable to load projects.");
        setLoading(false);
        return;
      }

      setProjects(data);
      setLoading(false);
    }

    getProjects();
  }, []);

  const saveProject = async (project) => {
    setError("");

    if (editingProject) {
      const { data, error } = await supabase
        .from("projects")
        .update({
          name: project.name,
          description: project.description,
          status: project.status,
        })
        .eq("id", editingProject.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating project:", error);
        setError("Unable to update project.");
        return;
      }

      setProjects((prev) =>
        prev.map((p) =>
          p.id === editingProject.id ? data : p
        )
      );
    } else {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("You must be logged in to create a project.");
        return;
      }

      const { data, error } = await supabase
        .from("projects")
        .insert([
          {
            user_id: user.id,
            name: project.name,
            description: project.description,
            status: project.status,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error creating project:", error);
        setError("Unable to create project.");
        return;
      }

      setProjects((prev) => [data, ...prev]);
    }

    setEditingProject(null);
    setIsModalOpen(false);
  };

  const deleteProject = async (id) => {
    setError("");

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting project:", error);
      setError("Unable to delete project.");
      return;
    }

    setProjects((prev) =>
      prev.filter((project) => project.id !== id)
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">Projects</h1>

        <Button
          onClick={() => {
            setEditingProject(null);
            setIsModalOpen(true);
          }}
        >
          + New Project
        </Button>
      </div>

      {/* Search */}
      <SearchBar
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="rounded-xl border bg-white p-8 text-center">
          <p className="text-sm text-slate-500">
            Loading projects...
          </p>
        </div>
      ) : filteredProjects.length === 0 ? (
        /* Empty state */
        <div className="rounded-xl border bg-white p-8 text-center">
          <h2 className="text-lg font-semibold text-slate-800">
            {search
              ? "No projects found"
              : "No projects yet"}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {search
              ? "Try a different search term."
              : "Create your first project to get started."}
          </p>
        </div>
      ) : (
        <ProjectList
          projects={filteredProjects}
          onDelete={deleteProject}
          onEdit={(project) => {
            setEditingProject(project);
            setIsModalOpen(true);
          }}
        />
      )}

      {/* Modal */}
     <CreateProjectModal
  key={editingProject?.id ?? "new"}
  open={isModalOpen}
  onClose={() => {
    setIsModalOpen(false);
    setEditingProject(null);
  }}
  onCreate={saveProject}
  editingProject={editingProject}
/>
    </div>
  );
}

export default Projects;