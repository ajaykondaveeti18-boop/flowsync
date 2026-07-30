import ProjectCard from "./ProjectCard";

function ProjectList({ projects, onDelete, onEdit }) {
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