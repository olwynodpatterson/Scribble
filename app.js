let notes = JSON.parse(localStorage.getItem('notes')) || [];

// Possible colors for notes
const colors = ['#EBDEF0', '#D6EAF8', '#F5B7B1', '#F9E79F', '#D1F2EB', '#DAF7A6'];

// Load existing notes
window.onload = () => {
    notes.forEach(note => {
        displayNote(note.id, note.content, note.color, note.creationTime);
    });

    // Set interval to check for notes that should be deleted every minute
    setInterval(checkNoteDeletion, 60 * 1000);
};

// Function to create a new note
function createNote() {
    const noteContent = prompt("Enter your note:");
    const noteColor = colors[Math.floor(Math.random() * colors.length)];
    const noteId = new Date().getTime();
    const noteCreationTime = new Date();
    
    const note = {
        id: noteId,
        content: noteContent,
        color: noteColor,
        creationTime: noteCreationTime
    };
    
    notes.push(note);
    localStorage.setItem('notes', JSON.stringify(notes));

    displayNote(noteId, noteContent, noteColor, noteCreationTime);
}

// Function to display a note on the screen
function displayNote(id, content, color, creationTime) {
    const noteElement = document.createElement('div');
    noteElement.classList.add('note');

    let noteContentHTML = `<div class="note-content">${content}</div>`;
    const timeRemaining = calculateTimeRemaining(creationTime);
    if (timeRemaining <= 30) {
        noteContentHTML += `<div class="note-footer"><span class="timeRemaining">Time remaining: ${timeRemaining} minutes</span></div>`;
    }

    // New code to add a delete button (X symbol)
    noteContentHTML += `<div class="delete-button" onclick="deleteNote(${id})">&times;</div>`;

    noteElement.innerHTML = noteContentHTML;

    // Set background color based on the color provided
    noteElement.style.backgroundColor = color;

    document.getElementById('notesContainer').appendChild(noteElement);
}

// Function to delete a note
function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
    localStorage.setItem('notes', JSON.stringify(notes));

    document.getElementById('notesContainer').innerHTML = '';
    notes.forEach(note => {
        displayNote(note.id, note.content, note.color, note.creationTime);
    });
}

// Function to calculate time remaining until note is auto-deleted
function calculateTimeRemaining(creationTime) {
    const currentTime = new Date();
    const timeElapsed = Math.abs(currentTime - new Date(creationTime));
    const timeRemaining = Math.round((3*24*60*60*1000 - timeElapsed) / (60*1000));
    return timeRemaining; 
}

// Function to check for notes that should be deleted
function checkNoteDeletion() {
    const currentTime = new Date();
    notes = notes.filter(note => {
        const timeElapsed = Math.abs(currentTime - new Date(note.creationTime));
        return timeElapsed < 3*24*60*60*1000;
    });

    localStorage.setItem('notes', JSON.stringify(notes));

    document.getElementById('notesContainer').innerHTML = '';
    notes.forEach(note => {
        displayNote(note.id, note.content, note.color, note.creationTime);
    });
}