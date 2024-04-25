import React from "react";
// import "../styles/Note.css"

function Note({ note, onDelete }) {
    const formattedDate = new Date(note.created_at).toLocaleDateString("en-US")

    // return (
    //     <div className="note-container">
    //         <p className="note-title">{note.title}</p>
    //         <a href={note.file}>download</a>
    //         <p className="note-date">{formattedDate}</p>
    //         <p className="note-date">lsjdldjf {note.id}</p>

    //         <button className="delete-button" onClick={() => onDelete(note.id)}>
    //             Delete
    //         </button>
    //     </div>
    // );

    return(
        <table className="note-table">
    <thead>
        <tr>
            <th>Title</th>
            <th>Download</th>
            <th>Date</th>
            <th>ID</th>
            <th>Action</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>{note.title}</td>
            <td><a href={note.file}>Download</a></td>
            <td>{formattedDate}</td>
            <td>{note.id}</td>
            <td><button onClick={() => onDelete(note.id)}>Delete</button></td>
        </tr>
    </tbody>
</table>

    );
}

export default Note