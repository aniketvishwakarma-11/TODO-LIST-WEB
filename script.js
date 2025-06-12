// script.js

document.addEventListener("DOMContentLoaded", function () {
  const taskInput = document.getElementById("task-input");
  const daySelect = document.getElementById("day-select");
  const monthSelect = document.getElementById("month-select");
  const yearSelect = document.getElementById("year-select");
  const timeInput = document.getElementById("time-input");
  const taskList = document.getElementById("task-list");
  const addBtn = document.getElementById("add-btn");
  const editIndexInput = document.getElementById("edit-index");
  const searchInput = document.getElementById("search-input");
  const downloadBtn = document.getElementById("download-csv");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function formatDateTime(day, month, year, time) {
    if (!day || !month || !year || !time) return "No date/time set";
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${day} ${monthNames[parseInt(month)]} ${year} at ${time}`;
  }

  function renderTasks(filter = "") {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
      if (task.text.toLowerCase().includes(filter.toLowerCase())) {
        const taskCard = document.createElement("div");
        taskCard.className = "task-card";

        const taskContent = document.createElement("div");
        taskContent.className = "task-content";
        if (task.completed) taskContent.classList.add("completed");

        taskContent.innerHTML = `<strong>${task.text}</strong><small>${formatDateTime(task.day, task.month, task.year, task.time)}</small>`;

        const taskActions = document.createElement("div");
        taskActions.className = "task-actions";

        const completeBtn = document.createElement("button");
        completeBtn.innerHTML = "✅";
        completeBtn.onclick = () => {
          tasks[index].completed = !tasks[index].completed;
          saveTasks();
          renderTasks(searchInput.value);
        };

        const editBtn = document.createElement("button");
        editBtn.innerText = "✏️";
        editBtn.onclick = () => {
          taskInput.value = task.text;
          daySelect.value = task.day;
          monthSelect.value = task.month;
          yearSelect.value = task.year;
          timeInput.value = task.time;
          editIndexInput.value = index;
          addBtn.innerText = "Update Task";
        };

        const deleteBtn = document.createElement("button");
        deleteBtn.innerText = "❌";
        deleteBtn.onclick = () => {
          tasks.splice(index, 1);
          saveTasks();
          renderTasks(searchInput.value);
        };

        taskActions.appendChild(completeBtn);
        taskActions.appendChild(editBtn);
        taskActions.appendChild(deleteBtn);

        taskCard.appendChild(taskContent);
        taskCard.appendChild(taskActions);
        taskList.appendChild(taskCard);
      }
    });
  }

  addBtn.onclick = () => {
    const text = taskInput.value.trim();
    const day = daySelect.value;
    const month = monthSelect.value;
    const year = yearSelect.value;
    const time = timeInput.value;
    const index = editIndexInput.value;

    if (text === "") return alert("Please enter a task.");

    if (index) {
      tasks[index] = { text, day, month, year, time, completed: false };
      editIndexInput.value = "";
      addBtn.innerText = "Add Task";
    } else {
      tasks.push({ text, day, month, year, time, completed: false });
    }

    taskInput.value = "";
    daySelect.value = monthSelect.value = yearSelect.value = timeInput.value = "";
    saveTasks();
    renderTasks(searchInput.value);
  };

  searchInput.addEventListener("input", () => {
    renderTasks(searchInput.value);
  });

  downloadBtn.addEventListener("click", () => {
    let csv = "Task,DateTime,Completed\n";
    tasks.forEach(task => {
      csv += `${task.text},${formatDateTime(task.day, task.month, task.year, task.time)},${task.completed ? "Yes" : "No"}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tasks.csv";
    a.click();
  });

  renderTasks();
});
