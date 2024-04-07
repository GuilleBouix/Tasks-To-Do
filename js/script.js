function toggleLanguage() {
    var languageButton = document.getElementById('EN');
    var newTaskLabel = document.getElementById('newtask');
    var dateLabel = document.getElementById('date');
    var addTaskButton = document.getElementById('add');
    
    if (languageButton.textContent == 'ESP') {
        languageButton.textContent = 'ENG';
        newTaskLabel.textContent = 'Nueva Tarea';
        dateLabel.textContent = 'Fecha';
        addTaskButton.textContent = 'Añadir Tarea';
    } else {
        languageButton.textContent = 'ESP';
        newTaskLabel.textContent = 'New Task';
        dateLabel.textContent = 'Date';
        addTaskButton.textContent = 'Add Task';
    }
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("tasks").addEventListener("click", function() {
        var answer = confirm("¿Deseas continuar?");
    });
});