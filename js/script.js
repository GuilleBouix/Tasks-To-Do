function toggleLanguage() {
    var languageButton = document.getElementById('ES');
    var newTaskLabel = document.getElementById('newtask');
    var dateLabel = document.getElementById('date');
    var addTaskButton = document.getElementById('add');
    
    if (languageButton.textContent == 'ENG') {
        languageButton.textContent = 'ESP';
        newTaskLabel.textContent = 'Nueva Tarea';
        dateLabel.textContent = 'Fecha u Hora';
        addTaskButton.textContent = 'Añadir Tarea';
    } else {
        languageButton.textContent = 'ENG';
        newTaskLabel.textContent = 'New Task';
        dateLabel.textContent = 'Date or Time';
        addTaskButton.textContent = 'Add Task';
    }
}





function addTask() {
    // Obtener los valores de los campos de entrada
    var taskName = document.getElementById("text-task").value;
    var taskDate = document.getElementById("text-date").value;

    // Verificar que ambos campos no estén vacíos
    if (taskName.trim() === "" || taskDate.trim() === "") {
        alert("Please complete all text-fields.");
        return;
    }

    // Crear los elementos para la nueva tarea
    var tasksDiv = document.createElement("div");
    tasksDiv.classList.add("tasks");

    var taskInfoDiv = document.createElement("div");
    taskInfoDiv.classList.add("task-info");

    var taskLabel = document.createElement("label");
    taskLabel.textContent = taskName;

    var taskDateDiv = document.createElement("div");
    taskDateDiv.classList.add("task-date");

    var taskDateSpan = document.createElement("span");
    taskDateSpan.textContent = taskDate;

    taskDateDiv.appendChild(taskDateSpan);
    taskInfoDiv.appendChild(taskLabel);
    taskInfoDiv.appendChild(taskDateDiv);

    var taskActionsDiv = document.createElement("div");
    taskActionsDiv.classList.add("task-actions");

    var pulseLabel = document.createElement("label");
    pulseLabel.classList.add("pulse");

    taskActionsDiv.appendChild(pulseLabel);

    tasksDiv.appendChild(taskInfoDiv);
    tasksDiv.appendChild(taskActionsDiv);

    // Agregar el elemento .tasks al div con la clase "app"
    var appDiv = document.getElementById("app");
    appDiv.appendChild(tasksDiv);

    document.getElementById("text-task").value = "";
    document.getElementById("text-date").value = "";

    // Mostrar la notificación solo si los campos de entrada no están vacíos
    var notification_box = document.querySelector(".notification_box");
    if (!notification_box.classList.contains('active')) {
        notification_box.classList.add('active');
        setTimeout(function () {
            notification_box.classList.remove('active');
        }, 2000);
    }

    tasksDiv.addEventListener("click", function () {
        if (confirm("Do you want to delete this task?")) {
            appDiv.removeChild(tasksDiv);
        }
    });
}

// Event listener para cerrar la notificación
document.querySelector(".close_btn").addEventListener("click", function () {
    document.querySelector(".notification_box").classList.remove('active');
});