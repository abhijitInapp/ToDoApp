let taskList = [];
let taskIDList = [];
let taskDescList = [];
let taskDataList = [];
let taskNum = 0;
let maxNum = 0;

const addTaskBtn = document.getElementById("addTaskBtn");
const addTaskPopup = document.getElementById('addTaskPopup');
const editTaskPopup = document.getElementById('editTaskPopup');

const addTaskForm = document.getElementById('addTaskForm');
const editTaskForm = document.getElementById('editTaskForm');
const taskInput = document.getElementById("taskDetails");
const taskTitle = document.getElementById("taskName");
const editTaskInput = document.getElementById("editTaskDetails");
const editTaskTitle = document.getElementById("editTaskName");
const todoList = document.getElementById("todo-list");
const inProgressList = document.getElementById("in-progress-list");
const completedList = document.getElementById("completed-list");
const addBtn = document.getElementById("submit-button");
addTaskBtn.addEventListener("click", addTask);
const closeBtn = document.getElementById("close-button");
const closeEditBtn = document.getElementById("close-edit-button");

window.onload = function () {
  for (let i = 0; i < localStorage.length; i++) {

    const key = localStorage.key(i);
    if (key.startsWith('task-')) {
      const taskDataString = localStorage.getItem(key);
      const taskData = JSON.parse(taskDataString);
      let taskID = parseInt(taskData.id.slice(1));
      console.log("task id =="+taskID);
      if (taskID > taskNum) {
        
        taskNum = taskID;
        console.log("task num =="+taskNum);
      }
      addTaskFunct(taskData.id, taskData.title, taskData.description, taskData.state);
    }
  }
  taskNum++;
}
closeBtn.addEventListener('click', function () {
  addTaskPopup.style.display = 'none';
});

closeEditBtn.addEventListener('click', function () {
  editTaskPopup.style.display = 'none';
});

function addTask() {
  addTaskPopup.style.display = 'block';
}
inProgressList.addEventListener('dragover', function (event) {
  event.preventDefault();
});
completedList.addEventListener('dragover', function (event) {
  event.preventDefault();
});
todoList.addEventListener('dragover', function (event) {
  event.preventDefault();
});
inProgressList.addEventListener('drop', function (event) {
  event.preventDefault();
  const taskId = event.dataTransfer.getData('text/plain');
  const task = document.getElementById(taskId);
  console.log(task);
  if (task) {
    moveTask('#16C1F7', task, "InProgress",inProgressList);
  }
});

todoList.addEventListener('drop', function (event) {
  event.preventDefault();
  const taskId = event.dataTransfer.getData('text/plain');
  const task = document.getElementById(taskId);
  console.log(task);
  if (task) {
    moveTask('#DC65C9', task, "ToDo",todoList);
  }
})
completedList.addEventListener('drop', function (event) {
  event.preventDefault();
  const taskId = event.dataTransfer.getData('text/plain');
  const task = document.getElementById(taskId);
  console.log(task);
  if (task) {
    const confirmed = confirm('Are you sure you want to move this item to completed list?');
    if (confirmed) {
      moveTask('#51CC83', task, "Completed",completedList);
    }

  }
});

addTaskForm.addEventListener('submit', function (event) {
  event.preventDefault();

  if (taskInput.value.trim() === '' || taskTitle.value.trim() === '') {
    console.log("task title = " + taskTitle.value + "  task details = " + taskInput.value);

    alert('Please enter task details');
    return;
  }
  setTaskToStorage(taskNum, taskTitle.value, taskInput.value, "InProgress");
  addTaskFunct("#" + taskNum, taskTitle.value, taskInput.value);
  taskNum++;

  addTaskPopup.style.display = 'none';
});

function getTaskFromStorage(id, title, desc, state) {
  let idKey = "";
  if (id !== null) {
    idKey = "task-" + id;
  }
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('task-')) {
      const taskDataString = localStorage.getItem(key);
      const taskData = JSON.parse(taskDataString);

      if (key === idKey) {
        setTaskToStorage(id, title, desc, state);
        break;
      }
    }
  }
}

function setTaskToStorage(id, title, desc, state) {

  const taskData = {
    id: "#" + id,
    title: title,
    description: desc,
    state: state
  };

  const taskDataString = JSON.stringify(taskData);
  localStorage.setItem(`task-${id}`, taskDataString);
}

function addTaskFunct(idValue, taskTitleValue, taskDescValue, stateValue) {
  const newTask = document.createElement("li");
  const deleteBtn = document.createElement("button");
  const editBtn = document.createElement("button");
  const taskID = document.createElement("span");
  const taskTitle = document.createElement("span");
  const taskDesc = document.createElement("div");
  editBtn.id = 'editBtn';
  deleteBtn.id = 'deleteBtn';
  deleteBtn.innerText = "Delete";
  editBtn.innerText = "Edit";
  taskTitle.innerText = taskTitleValue;
  taskDesc.className = 'task-desc';
  taskTitle.className = 'task-title';
  taskID.className = 'task-id';
  taskID.innerText = idValue;
  taskDesc.innerText = taskDescValue;
  newTask.className = 'task';
  newTask.draggable = true;
  newTask.id = "task" + idValue.slice(1);
  newTask.setAttribute('state', stateValue);
  taskDesc.appendChild(editBtn);
  taskDesc.appendChild(deleteBtn);
  newTask.appendChild(taskID);
  newTask.appendChild(taskTitle);
  newTask.appendChild(taskDesc);

  if(stateValue === "InProgress"){
    moveTask('#16C1F7', newTask, "InProgress",inProgressList);
  }
  else if(stateValue === "Completed"){
    moveTask('#51CC83', newTask, "Completed",completedList);
    deleteBtn.remove();
    editBtn.remove();
  }
  else{
    moveTask('#DC65C9', newTask, "ToDo",todoList);
  }

  taskList.push(taskInput.value);
  taskIDList.push(taskID.value);
  taskDescList.push(taskDesc.value);

  //setTaskToStorage(taskNum, TaskTitle.value, taskInput.value, "InProgress");

  //taskNum++;

  deleteBtn.addEventListener("click", function () {
    const taskIDNum = taskID.innerText;
    const idVal = taskIDNum.slice(1);
    localStorage.removeItem('task-' + idVal);
    newTask.remove();

  })

  editBtn.addEventListener("click", function () {
    editTaskPopup.style.display = 'block';
    editTaskForm.addEventListener('submit', function (event) {
      event.preventDefault();

      if (editTaskInput.value.trim() === '' || editTaskTitle.value.trim() === '') {
        alert('Please enter task details');
        return;
      }
      else {
        taskTitle.innerText = editTaskTitle.value;
        taskDesc.innerText = editTaskInput.value;
        taskDesc.appendChild(editBtn);
        taskDesc.appendChild(deleteBtn);
        editTaskPopup.style.display = 'none';
        const taskIDNum = taskID.innerText;
        const idVal = taskIDNum.slice(1);

        getTaskFromStorage(idVal, editTaskTitle.value, editTaskInput.value, newTask.getAttribute('state'));
      }

    });

  });

  taskInput.value = "";
  newTask.addEventListener('dragstart', function (event) {
    event.dataTransfer.setData('text/plain', event.target.id);
  });
}

function moveTask(color, task, state,parent) {
  //task.parentNode.removeChild(task);
  parent.appendChild(task);
  task.style.backgroundColor = color;
  const id = task.children[0].innerText.slice(1);
  const title = task.children[1].innerText;
  const desc = task.children[2].childNodes[0].nodeValue;
  task.setAttribute('state',state);
  if(state === "Completed"){
    task.removeAttribute('draggable');
      const buttonParent = task.children[2];
      const buttons = buttonParent.querySelectorAll('button');
      buttons.forEach(button => {
        buttonParent.removeChild(button);
      });
  }
  setTaskToStorage(id, title, desc, state);
}






