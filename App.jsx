import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
// import { nanoid } from "nanoid"
import { onSnapshot,addDoc, doc, deleteDoc, setDoc} from "firebase/firestore"
import { notesCollection ,db} from "./firebase"

export default function App() {
    const [notes, setNotes] = React.useState([])
    const [currentNoteId, setCurrentNoteId] = React.useState("")
    const [tempNoteText,setTempNoteText] = React.useState("")
    
    
    const currentNote = 
        notes.find(note => note.id === currentNoteId) 
        || notes[0]
    // to sort the notes in such a way that the updated notes comes on top.
    const sortedNotes = notes.sort((a,b)=> b.updatedAt -a.updatedAt)
    // creating document in the Firebase data base.
    React.useEffect(() => {
        const unsubscribe = onSnapshot(notesCollection, function(snapshot){
            const notesArr = snapshot.docs.map(doc =>({
                ...doc.data(),
                id: doc.id
            }))
            setNotes(notesArr)
        })
        return unsubscribe
    }, [])
   // stting node id as its created and gets info from firebase
    React.useEffect(()=> {
        if(!currentNoteId){
            setCurrentNoteId(notes[0]?.id)
        }
    }, [notes])
    
    React.useEffect(() => {
        if (currentNote) {
            setTempNoteText(currentNote.body)
        }
    }, [currentNote])
    
    React.useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (tempNoteText !== currentNote.body) {
                updateNote(tempNoteText)
            }
        }, 500)
        return () => clearTimeout(timeoutId)
    }, [tempNoteText])
    // createing a new node when + button in clicked making sure we keep it in firebase 
    async function createNewNote() {
        const newNote = {
            body: "# Type your markdown note's title here",
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
        //creating id using firebase
        const newNoteRef = await addDoc(notesCollection, newNote)
        setCurrentNoteId(newNoteRef.id)
    }
    // updating notes in firebase for every key stroke.
    async function updateNote(text) {
        const docRef = doc(db,"notes", currentNoteId)
        // to add channges to the existing firebase component we do the below, merge: true will make sure we are not overwritng code
        await setDoc(docRef,{body: text, updatedAt: Date.now()}, {merge: true})

    }
 // deleting notes using firebase
    async function deleteNote(noteId) {
        const docRef = doc(db,"notes", noteId)
        await deleteDoc(docRef)
    }

    return (
        <main>
            {
                notes.length > 0
                    ?
                    <Split
                        sizes={[30, 70]}
                        direction="horizontal"
                        className="split"
                    >
                        <Sidebar
                            notes={sortedNotes} // makeing sure that the updated notes is on top
                            currentNote={currentNote}
                            setCurrentNoteId={setCurrentNoteId}
                            newNote={createNewNote}
                            deleteNote={deleteNote}
                        />
                            <Editor
                                tempNoteText={tempNoteText}
                                setTempNoteText={setTempNoteText}
                            />
                        
                    </Split>
                    :
                    <div className="no-notes">
                        <h1>You have no notes</h1>
                        <button
                            className="first-note"
                            onClick={createNewNote}
                        >
                            Create one now
                </button>
                    </div>

            }
        </main>
    )
}
