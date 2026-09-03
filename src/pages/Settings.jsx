import { useEffect, useState } from "react";

import { supabase } from "../lib/supabase";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

function Settings() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setEmail(user.email || "");
      }

      setLoading(false);
    }

    getUser();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Settings
        </h1>

        <p className="mt-2 text-slate-500">
          Manage your workspace preferences and account settings.
        </p>
      </div>

      {/* Account */}
      <Card>
        <h2 className="text-xl font-semibold text-slate-900">
          Account
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Manage your account information.
        </p>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Email
          </label>

          <input
            type="email"
            value={loading ? "Loading..." : email}
            disabled
            className="w-full rounded-lg border border-slate-300 bg-slate-100 p-3 text-slate-500 outline-none"
          />
        </div>
      </Card>

      {/* Workspace */}
      <Card>
        <h2 className="text-xl font-semibold text-slate-900">
          Workspace
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Configure your workspace preferences.
        </p>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Workspace Name
          </label>

          <input
            type="text"
            defaultValue="FlowSync"
            className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
          />
        </div>

        <div className="mt-6 flex justify-end">
          <Button>
            Save Changes
          </Button>
        </div>
      </Card>

      {/* Preferences */}
      <Card>
        <h2 className="text-xl font-semibold text-slate-900">
          Preferences
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Customize how FlowSync behaves.
        </p>

        <div className="mt-6 space-y-5">
          <label className="flex cursor-pointer items-center justify-between gap-4">
            <div>
              <p className="font-medium text-slate-800">
                Email Notifications
              </p>

              <p className="text-sm text-slate-500">
                Receive notifications about your workspace.
              </p>
            </div>

            <input
              type="checkbox"
              defaultChecked
              className="h-5 w-5"
            />
          </label>

          <label className="flex cursor-pointer items-center justify-between gap-4">
            <div>
              <p className="font-medium text-slate-800">
                AI Suggestions
              </p>

              <p className="text-sm text-slate-500">
                Allow AI to analyze your tasks and projects.
              </p>
            </div>

            <input
              type="checkbox"
              defaultChecked
              className="h-5 w-5"
            />
          </label>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card>
        <h2 className="text-xl font-semibold text-red-600">
          Danger Zone
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Actions in this section can permanently affect your workspace.
        </p>

        <div className="mt-6 flex flex-col gap-4 rounded-lg border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-red-800">
              Delete Workspace
            </p>

            <p className="text-sm text-red-600">
              This action cannot be undone.
            </p>
          </div>

          <Button variant="danger">
            Delete
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default Settings;