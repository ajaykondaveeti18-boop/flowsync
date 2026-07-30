import Card from "../ui/Card";

const projects = [
  {
    name: "FlowSync",
    status: "In Progress",
  },
  {
    name: "Portfolio Website",
    status: "Completed",
  },
  {
    name: "Expense Tracker",
    status: "Planning",
  },
];

function RecentProjects() {
  return (
    <Card>
      <h2 className="mb-5 text-lg font-semibold">
        Recent Projects
      </h2>

      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.name}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <p>{project.name}</p>

            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
              {project.status}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default RecentProjects;