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





// Al inicio de tu archivo JS, puedes definir una función para cargar las tareas desde el almacenamiento local si existen
function loadTasksFromLocalStorage() {
    // Intenta obtener las tareas del almacenamiento local
    var tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // Itera sobre las tareas cargadas y las agrega a la interfaz
    tasks.forEach(function(task) {
        addTaskToUI(task.text, task.date);
    });
}

// Esta función agrega la tarea a la interfaz
function addTaskToUI(taskName, taskDate) {
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

    // Evento para eliminar la tarea
    tasksDiv.addEventListener("click", function () {
        if (confirm("Do you want to delete this task?")) {
            appDiv.removeChild(tasksDiv);
            
            // Obtener el índice de la tarea a eliminar
            var indexToRemove = Array.from(appDiv.children).indexOf(tasksDiv);
            
            // Obtener el array de tareas del almacenamiento local
            var tasks = JSON.parse(localStorage.getItem("tasks")) || [];
            
            // Eliminar la tarea correspondiente del array
            tasks.splice(indexToRemove, 1);
            
            // Volver a guardar el array actualizado en el almacenamiento local
            localStorage.setItem("tasks", JSON.stringify(tasks));
        }
    });
}



// Esta función agrega una nueva tarea y la guarda en el almacenamiento local
function addTask() {
    // Obtener los valores de los campos de entrada
    var taskName = document.getElementById("text-task").value;
    var taskDate = document.getElementById("text-date").value;

    // Verificar que ambos campos no estén vacíos
    if (taskName.trim() === "" || taskDate.trim() === "") {
        alert("Please complete all text-fields.");
        return;
    }

    // Agregar la tarea a la interfaz
    addTaskToUI(taskName, taskDate);

    // Guardar la tarea en el almacenamiento local
    var tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push({ text: taskName, date: taskDate });
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // Limpiar los campos de entrada
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
}



// Al cargar la página, cargamos las tareas guardadas en el almacenamiento local
window.addEventListener('DOMContentLoaded', function() {
    loadTasksFromLocalStorage();
});