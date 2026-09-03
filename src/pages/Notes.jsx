import { useEffect, useState } from "react";

import { supabase } from "../lib/supabase";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import Textarea from "../components/ui/Textarea";

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
    setError("");
    setIsModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content || "");
    setError("");
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingNote(null);
    setTitle("");
    setContent("");
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

    closeModal();
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Notes
          </h1>

          {!loading && (
            <p className="mt-1 text-sm text-slate-500">
              {notes.length}{" "}
              {notes.length === 1 ? "note" : "notes"} in your workspace
            </p>
          )}
        </div>

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
      {error && !isModalOpen && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Notes */}
      {loading ? (
        <div className="rounded-xl border bg-white p-8 text-center">
          <p className="text-sm text-slate-500">
            Loading notes...
          </p>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-white p-8 text-center">
          <h2 className="text-lg font-semibold text-slate-800">
            {search ? "No notes found" : "No notes yet"}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {search
              ? "Try a different search term."
              : "Create your first note to get started."}
          </p>

          {!search && (
            <Button
              className="mt-5"
              onClick={openCreateModal}
            >
              + Create Note
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="flex min-h-[220px] flex-col rounded-xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <h2 className="mb-2 break-words text-xl font-semibold">
                {note.title}
              </h2>

              <p className="mb-5 flex-1 whitespace-pre-wrap break-words text-sm text-slate-600">
                {note.content || "No content"}
              </p>

              <div className="flex flex-wrap justify-end gap-2">
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
      <Modal open={isModalOpen}>
        <h2 className="mb-5 text-2xl font-bold">
          {editingNote ? "Edit Note" : "Create Note"}
        </h2>

        {/* Modal Error */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form
          onSubmit={saveNote}
          className="space-y-4"
        >
          {/* Note Title */}
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note Title"
          />

          {/* Note Content */}
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note..."
            rows={6}
          />

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={closeModal}
            >
              Cancel
            </Button>

            <Button type="submit">
              {editingNote ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Notes;