import React, {
  createRef,
  ReactEventHandler,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import "./NotesPage.css";

type Note = {
  _id?: string;
  body: string;
};

export default function NotesPage() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [state, setState] = useState("initial");

  const notesRef = createRef<HTMLDivElement>();
  const inputRef = createRef<HTMLInputElement>();

  useEffect(() => {
    if (!notesRef.current) {
      return;
    }
    notesRef.current.scrollTo({ top: notesRef.current.scrollHeight });
  });

  useEffect(() => {
    setState("loading");

    if (state === "initial") {
      axios.get("/api/notes").then((res) => {
        setState("loaded");
        setNotes(res.data);
      });
    }
  }, [state]);

  const handleSaveClicked: ReactEventHandler = async (event) => {
    event?.preventDefault();

    if (inputRef.current) {
      inputRef.current.focus();
    }

    const newNote = { body: note };
    setNotes([...notes, newNote]);
    setNote("");

    await axios.post("/api/notes", newNote);
  };

  const handleNoteChanged = (event: any) => {
    setNote(event?.target?.value);
  };

  return (
    <div className="App">
      <div id="notes" ref={notesRef}>
        {notes.map((note, index) => {
          return (
            <div key={index} className="note">
              <span className="note-body">{note.body}</span>
            </div>
          );
        })}
      </div>
      <div id="textbox">
        <form onSubmit={handleSaveClicked}>
          <input
            ref={inputRef}
            autoFocus={true}
            value={note}
            onChange={handleNoteChanged}
          />
          <button type="submit" hidden={true}></button>
        </form>
      </div>
    </div>
  );
}