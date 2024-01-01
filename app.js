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
    const content = document.getElementById('new-note-content').value;
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
    document.getElementById('new-note-content').value = ''; // Clear the input field
}

function displayNotes() {
    const container = document.getElementById('notes-container');
    container.innerHTML = '';
    notes.forEach(note => {
        if (isNoteExpired(note.timestamp)) {
            // Remove expired note and continue to next iteration
            const noteIndex = notes.indexOf(note);
            notes.splice(noteIndex, 1);
            saveNotesToStorage();
            return; // Skip the rest of this iteration
        }

        const noteElement = document.createElement('div');
        noteElement.className = 'note';
        noteElement.style.backgroundColor = note.color;

        // Create and append the note content
        const noteContent = document.createElement('div');
        noteContent.className = 'note-content';
        noteContent.textContent = note.content; // Set the note text
        noteElement.appendChild(noteContent);

        // Create and append the delete button
        const deleteButton = document.createElement('span');
        deleteButton.className = 'delete-button';
        deleteButton.textContent = 'X';
        deleteButton.onclick = function() { deleteNote(note.id); };
        noteElement.appendChild(deleteButton);

        // Create and append the remaining time
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
    const expirationTime = new Date(noteTimestamp).getTime() + (3 * 24 * 60 * 60 * 1000); // 3 days in milliseconds
    const currentTime = Date.now();
    const timeLeft = expirationTime - currentTime;

    // Convert time left from milliseconds to a more readable format
    const days = Math.floor(timeLeft / (24 * 60 * 60 * 1000));
    const hours = Math.floor((timeLeft % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));

    return days > 0 ? `${days}d ${hours}h` : `${hours}h ${minutes}m`;
}

// Call displayNotes on page load
displayNotes();