// Global functions
function handleKeyDown(event) {
    if (event.key === 'Enter') {
        if (event.shiftKey) {
            // Allow default behavior for Shift+Enter (new line)
            return true;
        } else {
            // Prevent default and create note for Enter
            event.preventDefault();
            createNote();
            return false;
        }
    }
}

let notes = JSON.parse(localStorage.getItem('notes')) || [];

function saveNotesToStorage() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

function isNoteExpired(noteTimestamp) {
    const threeDaysInMilliseconds = 3 * 24 * 60 * 60 * 1000;
    const age = Date.now() - new Date(noteTimestamp).getTime();
    return age > threeDaysInMilliseconds;
}

function createNote() {
    const textarea = document.getElementById('new-note-content');
    const content = textarea.value.trim();
    
    if (!content) {
        alert('Please enter some content for the note.');
        return;
    }

    const colors = ['#EBDEF0', '#D6EAF8', '#F5B7B1', '#F9E79F', '#D1F2EB', '#DAF7A6'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const note = { id: Date.now(), content, color, timestamp: new Date() };

    notes.push(note);
    saveNotesToStorage();
    displayNotes();
    textarea.value = '';
}

function displayNotes() {
    const container = document.getElementById('notes-container');
    container.innerHTML = '';
    
    notes.forEach(note => {
        if (isNoteExpired(note.timestamp)) {
            const noteIndex = notes.indexOf(note);
            notes.splice(noteIndex, 1);
            saveNotesToStorage();
            return;
        }

        const noteElement = document.createElement('div');
        noteElement.className = 'note';
        noteElement.style.backgroundColor = note.color;

        const noteContent = document.createElement('div');
        noteContent.className = 'note-content';
        noteContent.textContent = note.content;
        noteElement.appendChild(noteContent);

        const deleteButton = document.createElement('span');
        deleteButton.className = 'delete-button';
        deleteButton.textContent = 'X';
        deleteButton.onclick = () => deleteNote(note.id);
        noteElement.appendChild(deleteButton);

        const timeRemaining = document.createElement('div');
        timeRemaining.className = 'time-remaining';
        timeRemaining.textContent = `Expires in: ${calculateRemainingTime(note.timestamp)}`;
        noteElement.appendChild(timeRemaining);

        container.appendChild(noteElement);
    });
}

function deleteNote(noteId) {
    const noteIndex = notes.findIndex(note => note.id === noteId);
    if (noteIndex !== -1) {
        notes.splice(noteIndex, 1);
        saveNotesToStorage();
        displayNotes();
    }
}

function calculateRemainingTime(noteTimestamp) {
    const expirationTime = new Date(noteTimestamp).getTime() + (3 * 24 * 60 * 60 * 1000);
    const currentTime = Date.now();
    const timeLeft = expirationTime - currentTime;

    const days = Math.floor(timeLeft / (24 * 60 * 60 * 1000));
    const hours = Math.floor((timeLeft % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));

    return days > 0 ? `${days}d ${hours}h` : `${hours}h ${minutes}m`;
}

function closePopup() {
    document.getElementById('popup').style.display = 'none';
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('popup').style.display = 'block';
    displayNotes();
});