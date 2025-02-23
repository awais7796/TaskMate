document.addEventListener('DOMContentLoaded', () => {
    // Get references to the form, input field, task list, and total tasks counter
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const totalTasks = document.getElementById('total-tasks');

    // Retrieve stored tasks from local storage, or initialize an empty array if none exist
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Render tasks when the page loads
    renderTasks();

    // Event listener for form submission (adding new tasks)
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent page reload
        
        const taskText = taskInput.value.trim(); // Get task input value and trim whitespace
        if (!taskText) return; // If input is empty, do nothing

        // Create a new task object
        const newTask = {
            id: Date.now(), // Unique ID based on timestamp
            text: taskText,
            completed: false // Task is initially not completed
        };

        tasks.push(newTask); // Add new task to the tasks array
        saveTasks(); // Save updated tasks to local storage
        renderTasks(); // Re-render the task list

        taskInput.value = ''; // Clear the input field after adding a task
    });

    // Event listener for task actions (marking complete or deleting)
    taskList.addEventListener('click', (e) => {
        const taskItem = e.target.closest('.task-item'); // Get the closest task item element
        if (!taskItem) return; // If no task item is clicked, do nothing

        const taskId = Number(taskItem.dataset.id); // Get the task ID from the dataset

        // If checkbox is clicked, toggle task completion status
        if (e.target.classList.contains('task-checkbox')) {
            toggleTaskStatus(taskId);
        }

        // If delete button is clicked, remove the task
        if (e.target.classList.contains('delete-btn')) {
            deleteTask(taskId);
        }
    });

    // Function to toggle task completion status
    function toggleTaskStatus(taskId) {
        const task = tasks.find(t => t.id === taskId); // Find task by ID
        if (task) {
            task.completed = !task.completed; // Toggle completed status
            saveTasks(); // Save updated tasks to local storage
            renderTasks(); // Re-render the task list
        }
    }

    // Function to delete a task
    function deleteTask(taskId) {
        tasks = tasks.filter(task => task.id !== taskId); // Remove task from the array
        saveTasks(); // Save updated tasks to local storage
        renderTasks(); // Re-render the task list
    }

    // Function to render tasks in the task list
    function renderTasks() {
        taskList.innerHTML = ''; // Clear the task list before rendering

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = 'task-item'; // Add class for styling
            li.dataset.id = task.id; // Store task ID for reference

            // Create task HTML structure
            li.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
                <button class="delete-btn">Delete</button>
            `;

            taskList.appendChild(li); // Append task to the list
        });

        totalTasks.textContent = tasks.length; // Update total tasks counter
    }

    // Function to save tasks to local storage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks)); // Convert tasks to JSON and store
    }
});
