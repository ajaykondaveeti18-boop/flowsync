function AiCard() {
  return (
    <div className="rounded-xl bg-slate-900 p-6 text-white">
      <h2 className="text-xl font-semibold">
        AI Assistant
      </h2>

      <p className="mt-3 text-slate-300">
        Need help planning your day?
      </p>

      <button className="mt-5 rounded-lg bg-blue-600 px-5 py-2">
        Ask AI
      </button>
    </div>
  );
}

export default AiCard;