import ProjectCard from "./ProjectCard";

function ProjectList({ projects, onDelete, onEdit }) {
  if (projects.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
        <h3 className="text-lg font-semibold text-slate-800">
          No projects yet
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Create your first project to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

export default ProjectList;