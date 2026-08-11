import { useEffect, useState } from "react";

import { supabase } from "../lib/supabase";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch notes from Supabase
  useEffect(() => {
    async function getNotes() {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching notes:", error);
        setError("Unable to load notes.");
        setLoading(false);
        return;
      }

      setNotes(data);
      setLoading(false);
    }

    getNotes();
  }, []);

  // Filter notes
  const filteredNotes = notes.filter((note) => {
    const searchText = search.toLowerCase();

    return (
      note.title.toLowerCase().includes(searchText) ||
      (note.content || "").toLowerCase().includes(searchText)
    );
  });

  // Open create modal
  const openCreateModal = () => {
    setEditingNote(null);
    setTitle("");
    setContent("");
    setIsModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content || "");
    setIsModalOpen(true);
  };

  // Create or update note
  const saveNote = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Note title is required.");
      return;
    }

    setError("");

    if (editingNote) {
      // Update note
      const { data, error } = await supabase
        .from("notes")
        .update({
          title: title.trim(),
          content: content.trim(),
        })
        .eq("id", editingNote.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating note:", error);
        setError("Unable to update note.");
        return;
      }

      setNotes((prev) =>
        prev.map((note) =>
          note.id === editingNote.id ? data : note
        )
      );
    } else {
      // Get logged-in user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("You must be logged in to create a note.");
        return;
      }

      // Create note
      const { data, error } = await supabase
        .from("notes")
        .insert([
          {
            user_id: user.id,
            title: title.trim(),
            content: content.trim(),
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error creating note:", error);
        setError("Unable to create note.");
        return;
      }

      setNotes((prev) => [data, ...prev]);
    }

    setTitle("");
    setContent("");
    setEditingNote(null);
    setIsModalOpen(false);
  };

  // Delete note
  const deleteNote = async (id) => {
    setError("");

    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting note:", error);
      setError("Unable to delete note.");
      return;
    }

    setNotes((prev) =>
      prev.filter((note) => note.id !== id)
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Notes
        </h1>

        <Button onClick={openCreateModal}>
          + New Note
        </Button>
      </div>

      {/* Search */}
      <Input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search notes..."
      />

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Notes */}
      {loading ? (
        <p className="text-slate-500">
          Loading notes...
        </p>
      ) : filteredNotes.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center text-slate-500">
          No notes found.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="rounded-xl border bg-white p-5 shadow-sm"
            >
              <h2 className="mb-2 text-xl font-semibold">
                {note.title}
              </h2>

              <p className="mb-5 whitespace-pre-wrap text-sm text-slate-600">
                {note.content}
              </p>

              <div className="flex justify-end gap-2">
                <Button
                  variant="secondary"
                  onClick={() => openEditModal(note)}
                >
                  Edit
                </Button>

                <Button
                  variant="danger"
                  onClick={() => deleteNote(note.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6">
            <h2 className="mb-5 text-2xl font-bold">
              {editingNote ? "Edit Note" : "Create Note"}
            </h2>

            <form
              onSubmit={saveNote}
              className="space-y-4"
            >
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note Title"
              />

              <textarea
                value={content}
                onChange={(e) =>
                  setContent(e.target.value)
                }
                placeholder="Write your note..."
                rows={6}
                className="w-full resize-none rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
              />

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingNote(null);
                  }}
                >
                  Cancel
                </Button>

                <Button type="submit">
                  {editingNote ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notes;