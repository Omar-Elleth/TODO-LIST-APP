import {
  AppElement,
  InputElement,
  TaskListElement,
  TaskListLink,
  darkThemeToggleElement,
  getDeleteIcons,
  getcheckBoxElements,
} from "./elements.js";

const toggleDarkMode = () => {
  AppElement.classList.toggle("App--isDark");
  saveToDB("darkModeFlag", AppElement?.classList.contains("App--isDark"));
};

darkThemeToggleElement.addEventListener("click", toggleDarkMode);

const TaskSearchBarButton = document.querySelector(".TaskSearchBar__button");

const fetchData = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : false;
};

const taskListRender = (tasks) => {
  let taskList = "";
  tasks.forEach((task) => {
    taskList += `<li class="TaskList__taskContent">
    <div class='TaskList__checkbox' tabindex="0" role="button">
      <img class='TaskList__checkboxImg' src="./assets/icon-checkmark.svg" alt="">
    </div>
    <div class='TaskList__valueContent'>
      <p class='TaskList__value'>
        ${task.value}
      </p>
      <img src="./assets/icon-basket.svg"
           class='TaskList__deleteIcon'
           alt="basket-icon"
      />
    </div>
  </li>`;
  });

  TaskListElement.innerHTML = taskList;
  InputElement.value = "";

  initTaskListners();
};

const deleteTask = (index) => {
  const answer = confirm("هل أنت متأكد من حذف المهمة ؟");

  if (answer === false) return;

  const tasks = fetchData("tasks");

  tasks.splice(index, 1);
  saveToDB("tasks", tasks);
  initTaskList(tasks);
};

const initTaskListners = () => {
  getDeleteIcons().forEach((icon, index) => {
    icon.addEventListener("click", () => deleteTask(index));
  });
  getcheckBoxElements().forEach((box, index) => {
    box.addEventListener("click", (e) => toggleTask(e, index));
  });
};

const addTask = (e) => {
  e.preventDefault();

  const taskValue = InputElement.value;

  if (!taskValue) return;

  const task = {
    value: taskValue,
    iCompleted: false,
  };

  const tasks = fetchData("tasks") || [];

  tasks.push(task);

  saveToDB("tasks", tasks);

  initTaskList(tasks);
};

const saveToDB = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

TaskSearchBarButton.addEventListener("click", addTask);

const initDataOnStartup = () => {
  fetchData("darkModeFlag") && initDataOnStartup();
  initTaskList(fetchData("tasks"));
};

const renderEmptyState = () => {
  TaskListElement.innerHTML = `
  <li class='EmptyList'>
  <img class='EmptyList__img' src="./assets/icon-empty.svg" alt="list is empty" />
  <p>قائمة المهام فارغة</p>
</li>
  `;
};

const initTaskList = (tasks) => {
  if (tasks?.length) {
    taskListRender(tasks);
  } else {
    renderEmptyState();
  }
};

const toggleTask = (e, index) => {
  const tasks = fetchData("tasks");
  e.currentTarget.parentElement.classList.toggle(
    "TaskList__taskContent--isActive"
  );
  tasks[index].iCompleted = !tasks[index].iCompleted;
  saveToDB("tasks", tasks);
};

TaskListLink?.addEventListener("click", () => {
  TaskListElement?.classList.toggle("TaskList__list--hideCompleted");
  TaskListLink?.classList.toggle("TaskList__link--isActive");
});

renderEmptyState();

/* 
  - Dark Theme
    [x] toggleDarkMode
  - Tasks
    [x] saveToDB
    [x] initDataOnStartup
    [x] renderTaskList
    [x] addTask
    [x] deleteTask
    [ ] toggleTask
    [ ] toggleCompletedTask
*/
