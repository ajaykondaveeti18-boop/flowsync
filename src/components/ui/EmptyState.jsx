function EmptyState({ title, message }) {
  return (
    <div className="rounded-xl border border-dashed p-10 text-center">
      <h2 className="text-xl font-semibold">
        {title}
      </h2>

      <p className="mt-2 text-slate-500">
        {message}
      </p>
    </div>
  );
}

export default EmptyState;