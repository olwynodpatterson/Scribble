let notes = JSON.parse(localStorage.getItem('notes')) || [];

function saveNotesToStorage() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

function createNote() {
    const content = document.getElementById('new-note-content').value;
    if (!content) {
        alert('Please enter some content for the note.');
        return;
    }

    const colors = ['pink', 'light blue', 'yellow', 'orange', 'green'];
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

        // Append the note element to the container
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

// Call displayNotes on page load
displayNotes();