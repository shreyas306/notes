import { useState, useEffect, useContext, createContext } from "react";
import "./App.css";


// Theme Context
const ThemeContext = createContext();

function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button className="theme-btn" onClick={toggleTheme}>
      {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
    </button>
  );
}

function NoteItem({ note, onDelete }) {
  const { theme } = useContext(ThemeContext);

  return (
    <li className={`note-item ${theme}`}>
      <span>{note.text}</span>
      <button className="delete-btn" onClick={() => onDelete(note.id)}>
        Delete
      </button>
    </li>
  );
}

function NotesApp() {
  const [input, setInput] = useState("");

  const [notes, setNotes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("notes")) || [];
    } catch {
      return [];
    }
  });

  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  // Update browser tab title
  useEffect(() => {
    document.title = `Notes (${notes.length})`;
  }, [notes.length]);

  // Add note
  const addNote = () => {
    const text = input.trim();

    if (!text) return;

    const newNote = {
      id: crypto.randomUUID(),
      text,
    };

    setNotes((prev) => [...prev, newNote]);
    setInput("");
  };

  // Delete note
  const deleteNote = (id) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      addNote();
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`app ${theme}`}>
        <div className="notes-container">
          <header>
            <h1>📝 My Notes</h1>
            <ThemeToggle />
          </header>

          <div className="note-input">
            <input
              type="text"
              placeholder="Write your note here..."
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
            />

            <button className="add-btn" onClick={addNote}>
              + Add Note
            </button>
          </div>

          <h2>My Notes ({notes.length})</h2>

          {notes.length === 0 ? (
            <p className="empty-message">No notes yet.</p>
          ) : (
            <ul className="notes-list">
              {notes.map((note) => (
                <NoteItem
                  key={note.id}
                  note={note}
                  onDelete={deleteNote}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

export default NotesApp;