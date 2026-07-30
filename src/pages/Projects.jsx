import { useState } from "react";

import { useEffect } from "react";
import { supabase } from "../lib/supabase";

import SearchBar from "../components/projects/SearchBar";
import ProjectList from "../components/projects/ProjectList";
import CreateProjectModal from "../components/projects/CreateProjectModal";

import projectData from "../data/projects";
import Button from "../components/ui/Button";

function Projects() {
  const [projects, setProjects] = useState(projectData);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(search.toLowerCase())
  );

  const saveProject = (project) => {
  if (editingProject) {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === editingProject.id
          ? { ...project, id: editingProject.id }
          : p
      )
    );
  } else {
    setProjects((prev) => [
      {
        id: Date.now(),
        ...project,
      },
      ...prev,
    ]);
  }

  setEditingProject(null);
  setIsModalOpen(false);
};

  const deleteProject = (id) => {
  setProjects((prev) => prev.filter((project) => project.id !== id));
};

useEffect(() => {
  async function getProjects() {
    const { data, error } = await supabase
      .from("projects")
      .select("*");

    console.log("Projects:", data);
    console.log("Error:", error);
  }

  getProjects();
}, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projects</h1>

        <Button onClick={() => setIsModalOpen(true)}>
  + New Project
</Button>
      </div>

      <SearchBar
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <ProjectList
  projects={filteredProjects}
  onDelete={deleteProject}
  onEdit={(project) => {
  setEditingProject(project);
  setIsModalOpen(true);
}}
/>

      <CreateProjectModal
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