import { useState } from "react";
import { supabase } from "../../lib/supabase";

function AiCard() {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAskAI = async () => {
    setLoading(true);
    setError("");
    setAnswer("");

    try {
      const { data: projects, error: projectsError } = await supabase
        .from("projects")
        .select("id, name, description, status")
        .order("created_at", { ascending: false });

      if (projectsError) {
        throw projectsError;
      }

      const { data: tasks, error: tasksError } = await supabase
        .from("tasks")
        .select("id, title, status, project_id")
        .order("created_at", { ascending: false });

      if (tasksError) {
        throw tasksError;
      }

      const prompt = `
You are an AI productivity assistant for a project management workspace.

Analyze the user's workspace.

Projects:
${JSON.stringify(projects, null, 2)}

Tasks:
${JSON.stringify(tasks, null, 2)}

First, prioritize every task:
- High
- Medium
- Low

Then analyze the overall workspace.

Return the response EXACTLY in this format:

HIGH
Task name | Short reason

MEDIUM
Task name | Short reason

LOW
Task name | Short reason

NEXT_FOCUS
The single most important task

WHY
Short explanation

RECOMMENDATION
One practical productivity suggestion

WORKSPACE_INSIGHT
A short summary of the workspace, including:
- Number of projects
- Number of tasks
- Number of completed tasks
- Number of pending tasks
- One important observation

Keep everything concise.
`;

      const { data, error: aiError } =
        await supabase.functions.invoke("ai-assistant", {
          body: {
            prompt,
          },
        });

      if (aiError) {
        throw aiError;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setAnswer(data.answer);
    } catch (error) {
      console.error("AI error:", error);
      setError("Unable to get AI suggestions.");
    } finally {
      setLoading(false);
    }
  };

  const parseAIResponse = () => {
    if (!answer) return null;

    const getSection = (section, nextSection) => {
      const start = answer.indexOf(section);

      if (start === -1) return "";

      const contentStart = start + section.length;
      const end = nextSection
        ? answer.indexOf(nextSection, contentStart)
        : answer.length;

      return answer
        .slice(contentStart, end === -1 ? answer.length : end)
        .trim();
    };

    return {
      high: getSection("HIGH", "MEDIUM"),
      medium: getSection("MEDIUM", "LOW"),
      low: getSection("LOW", "NEXT_FOCUS"),
      nextFocus: getSection("NEXT_FOCUS", "WHY"),
      why: getSection("WHY", "RECOMMENDATION"),
      recommendation: getSection("RECOMMENDATION"),
      workspaceInsight: getSection("WORKSPACE_INSIGHT"),
    };
  };

  const parsed = parseAIResponse();

  return (
    <div className="rounded-xl bg-slate-900 p-6 text-white">
      <div>
        <h2 className="text-xl font-semibold">AI Assistant</h2>

        <p className="mt-2 text-slate-400">
          Get intelligent task priorities and productivity suggestions.
        </p>
      </div>

      <button
        onClick={handleAskAI}
        disabled={loading}
        className="mt-5 rounded-lg bg-blue-600 px-5 py-2 font-medium transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Analyzing..." : "Ask AI"}
      </button>

      {error && (
        <div className="mt-5 rounded-lg bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {parsed && (
        <div className="mt-6 space-y-4">

          {/* High Priority */}
          {parsed.high && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
              <h3 className="font-semibold text-red-300">
                🔴 High Priority
              </h3>

              <p className="mt-2 whitespace-pre-line text-sm text-slate-300">
                {parsed.high}
              </p>
            </div>
          )}

          {/* Medium Priority */}
          {parsed.medium && (
            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
              <h3 className="font-semibold text-yellow-300">
                🟡 Medium Priority
              </h3>

              <p className="mt-2 whitespace-pre-line text-sm text-slate-300">
                {parsed.medium}
              </p>
            </div>
          )}

          {/* Low Priority */}
          {parsed.low && (
            <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4">
              <h3 className="font-semibold text-green-300">
                🟢 Low Priority
              </h3>

              <p className="mt-2 whitespace-pre-line text-sm text-slate-300">
                {parsed.low}
              </p>
            </div>
          )}

          {/* Next Focus */}
          {parsed.nextFocus && (
            <div className="rounded-lg bg-blue-500/10 p-4">
              <h3 className="font-semibold text-blue-300">
                🎯 Next Focus
              </h3>

              <p className="mt-2 text-sm text-slate-300">
                {parsed.nextFocus}
              </p>
            </div>
          )}

          {/* Why */}
          {parsed.why && (
            <div className="rounded-lg bg-slate-800 p-4">
              <h3 className="font-semibold text-slate-200">
                Why?
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                {parsed.why}
              </p>
            </div>
          )}

          {/* Recommendation */}
          {parsed.recommendation && (
            <div className="rounded-lg bg-purple-500/10 p-4">
              <h3 className="font-semibold text-purple-300">
                💡 Recommendation
              </h3>

              <p className="mt-2 text-sm text-slate-300">
                {parsed.recommendation}
              </p>
            </div>
          )}
          {/* Workspace Insight */}
          {parsed.workspaceInsight && (
            <div className="rounded-lg bg-cyan-500/10 p-4">
              <h3 className="font-semibold text-cyan-300">
                📊 Workspace Insight
              </h3>

              <p className="mt-2 whitespace-pre-line text-sm text-slate-300">
                {parsed.workspaceInsight}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AiCard;