
/* ================== DOM SELECT ================== */
const titleInput = document.querySelector('input[type="text"]');
const descInput = document.querySelector("textarea");
const addBtn = document.querySelector("main button");

const allBtn = document.getElementById("all-btn");
const activeBtn = document.getElementById("active-btn");
const completedBtn = document.getElementById("completed-btn");

const allNoTask = document.getElementById("all-no-task");
const activeNoTask = document.getElementById("active-no-task");
const completedNoTask = document.getElementById("completed-no-task");

const main = document.querySelector("main");

/* ================== STATE ================== */
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

/* ================== INIT ================== */
init();

function init() {
  setActiveButton(allBtn);
  renderTasks();
}

/* ================== ADD TASK ================== */
addBtn.addEventListener("click", addTask);
titleInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

function addTask() {
  const title = titleInput.value.trim();
  const desc = descInput.value.trim();

  if (!title) return alert("Task title লাগবে 😅");

  tasks.push({
    id: Date.now(),
    title,
    desc,
    completed: false,
  });

  titleInput.value = "";
  descInput.value = "";

  saveTasks();
  renderTasks();
}

/* ================== SAVE ================== */
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* ================== RENDER ================== */
function renderTasks() {
  removeOldTasks();
  hideAllEmptyStates();

  if (tasks.length === 0) {
    allNoTask.classList.remove("hidden");
    updateCounts();
    return;
  }

  const filteredTasks = getFilteredTasks();

  if (filteredTasks.length === 0) {
    showEmptyStateByFilter();
  }

  filteredTasks.forEach((task) => createTaskCard(task));
  updateCounts();
}

/* ================== FILTER LOGIC ================== */
function getFilteredTasks() {
  if (currentFilter === "active") return tasks.filter((t) => !t.completed);
  if (currentFilter === "completed") return tasks.filter((t) => t.completed);
  return tasks;
}

/* ================== CREATE TASK CARD ================== */
function createTaskCard(task) {
  const card = document.createElement("section");
  card.className =
    "task-card bg-base-100 rounded-2xl border border-base-300 shadow-sm px-8 py-6 mb-4";

  card.innerHTML = `
    <div class="flex justify-between items-center gap-4">
      <div class="flex-1 min-w-0">
        <h3 class="text-lg font-bold break-words ${task.completed ? "line-through text-gray-400" : ""}">
          ${task.title}
        </h3>
        <p class="text-sm text-gray-500">${task.desc || ""}</p>
      </div>
      <div class="flex gap-2 shrink-0">
        <button class="done-btn btn btn-sm border-none ${task.completed ? "bg-green-700 text-white" : "bg-gray-200"}">
          ${task.completed ? "Undo" : "Done"}
        </button>
        <button class="delete-btn btn btn-sm btn-success text-black border-none">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    </div>
  `;

  // Done / Undo
  card.querySelector(".done-btn").addEventListener("click", () => {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  });

  // Delete
  card.querySelector(".delete-btn").addEventListener("click", () => {
    tasks = tasks.filter((t) => t.id !== task.id);
    saveTasks();
    renderTasks();
  });

  main.insertBefore(card, allNoTask);
}

/* ================== EMPTY STATE ================== */
function hideAllEmptyStates() {
  allNoTask.classList.add("hidden");
  activeNoTask.classList.add("hidden");
  completedNoTask.classList.add("hidden");
}

function showEmptyStateByFilter() {
  if (currentFilter === "all") allNoTask.classList.remove("hidden");
  else if (currentFilter === "active") activeNoTask.classList.remove("hidden");
  else if (currentFilter === "completed") completedNoTask.classList.remove("hidden");
}

/* ================== REMOVE OLD TASKS ================== */
function removeOldTasks() {
  document.querySelectorAll(".task-card").forEach((card) => card.remove());
}

/* ================== COUNT UPDATE ================== */
function updateCounts() {
  allBtn.querySelector("span:last-child").innerText = `(${tasks.length})`;
  activeBtn.querySelector("span:last-child").innerText = `(${tasks.filter((t) => !t.completed).length})`;
  completedBtn.querySelector("span:last-child").innerText = `(${tasks.filter((t) => t.completed).length})`;
}

/* ================== BUTTON STYLE ================== */
function setActiveButton(button) {
  [allBtn, activeBtn, completedBtn].forEach((btn) => {
    btn.classList.remove("bg-green-700", "text-white");
  });
  button.classList.add("bg-green-700", "text-white");
}

/* ================== FILTER BUTTON EVENTS ================== */
allBtn.addEventListener("click", () => {
  currentFilter = "all";
  setActiveButton(allBtn);
  renderTasks();
});

activeBtn.addEventListener("click", () => {
  currentFilter = "active";
  setActiveButton(activeBtn);
  renderTasks();
});

completedBtn.addEventListener("click", () => {
  currentFilter = "completed";
  setActiveButton(completedBtn);
  renderTasks();
});