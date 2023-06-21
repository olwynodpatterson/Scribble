let notes = JSON.parse(localStorage.getItem('notes')) || [];

// Possible colors for notes
const colors = ['pink', 'light blue', 'yellow', 'orange', 'light green'];

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
    noteElement.style.backgroundColor = color;
    noteElement.innerHTML = `
    <div class="note-content">
        ${content}
    </div>
    <div class="note-footer">
        <span class="timeRemaining">Time remaining: ${calculateTimeRemaining(creationTime)} minutes</span>
        <button onclick="deleteNote(${id})">Delete Note</button>
    </div>
    `;

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
