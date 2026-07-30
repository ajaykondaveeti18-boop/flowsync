import Card from "../ui/Card";

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>

          <h2 className="mt-2 text-3xl font-bold">{value}</h2>
        </div>

        <div className={`rounded-xl p-3 ${color}`}>
          <Icon className="text-white" size={24} />
        </div>
      </div>
    </Card>
  );
}

export default StatCard;