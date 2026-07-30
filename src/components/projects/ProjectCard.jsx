import { Pencil, Trash2 } from "lucide-react";

import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

function ProjectCard({ project, onDelete, onEdit }) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            {project.name}
          </h3>

          <p className="mt-2 text-slate-500">
            {project.description}
          </p>

          <div className="mt-4">
            <Badge status={project.status} />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
  variant="secondary"
  className="p-2"
  onClick={() => onEdit(project)}
>
  <Pencil size={18} />
</Button>

<Button
  variant="danger"
  className="p-2"
  onClick={() => onDelete(project.id)}
>
  <Trash2 size={18} />
</Button>
        </div>
      </div>
    </Card>
  );
}

export default ProjectCard;