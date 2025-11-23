document.addEventListener("DOMContentLoaded", function () {
  const taskInput = document.getElementById("taskInput");
  const addBtn = document.getElementById("addBtn");
  const taskList = document.getElementById("taskList");
  const clearAllBtn = document.getElementById("clearAllBtn");
  const clearCompletedBtn = document.getElementById("clearCompletedBtn");
  const taskCount = document.getElementById("taskCount");

  // Load saved tasks
  loadTasks();

  addBtn.addEventListener("click", addTask);
  taskInput.addEventListener("keypress", e => e.key === "Enter" && addTask());

  clearAllBtn.addEventListener("click", () => {
    if (confirm("Delete ALL tasks?")) {
      taskList.innerHTML = "";
      saveTasks();
      updateCounter();
    }
  });

  clearCompletedBtn.addEventListener("click", () => {
    document.querySelectorAll(".completed").forEach(task => task.remove());
    saveTasks();
    updateCounter();
  });

  function addTask() {
    const text = taskInput.value.trim();
    if (!text) return alert("Please type a task!");

    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = text;
    span.onclick = () => {
      li.classList.toggle("completed");
      saveTasks();
      updateCounter();
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";
    deleteBtn.onclick = () => {
      li.style.animation = "slideIn 0.4s reverse";
      setTimeout(() => { li.remove(); saveTasks(); updateCounter(); }, 300);
    };

    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);

    taskInput.value = "";
    saveTasks();
    updateCounter();
  }

  function saveTasks() {
    const tasks = [];
    document.querySelectorAll("li").forEach(li => {
      tasks.push({
        text: li.querySelector("span").textContent,
        completed: li.classList.contains("completed")
      });
    });
    localStorage.setItem("glassTodoTasks", JSON.stringify(tasks));
  }

  function loadTasks() {
    const saved = localStorage.getItem("glassTodoTasks");
    if (saved) {
      JSON.parse(saved).forEach(task => {
        const li = document.createElement("li");
        if (task.completed) li.classList.add("completed");

        const span = document.createElement("span");
        span.textContent = task.text;
        span.onclick = () => {
          li.classList.toggle("completed");
          saveTasks();
          updateCounter();
        };

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";
        deleteBtn.onclick = () => {
          li.remove();
          saveTasks();
          updateCounter();
        };

        li.appendChild(span);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
      });
    }
    updateCounter();
  }

  function updateCounter() {
    const total = taskList.children.length;
    const completed = document.querySelectorAll(".completed").length;
    taskCount.textContent = `${total} task${total !== 1 ? 's' : ''} • ${completed} completed`;
  }
});