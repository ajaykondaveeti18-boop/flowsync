import Card from "../ui/Card";

const tasks = [
  "Finish Dashboard UI",
  "Create Login Page",
  "Connect Supabase",
];

function TodayTasks() {
  return (
    <Card>
      <h2 className="mb-5 text-lg font-semibold">
        Today's Tasks
      </h2>

      <div className="space-y-4">
        {tasks.map((task) => (
          <label
            key={task}
            className="flex items-center gap-3 rounded-lg border p-4"
          >
            <input type="checkbox" />

            <span>{task}</span>
          </label>
        ))}
      </div>
    </Card>
  );
}

export default TodayTasks;