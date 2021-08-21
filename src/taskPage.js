/* eslint-disable import/prefer-default-export */
import { format, add } from 'date-fns';
import { DomHelper } from './domHelper';
import BackArrow from './media/back-arrow.svg';
import AddImg from './media/add.svg';
import LowPriority from './media/prioritylow.svg';
import MedPriority from './media/prioritymedium.svg';
import HighPriority from './media/priorityhigh.svg';

export class TaskPage {
  constructor(taskManager, taskDom) {
    this._taskDom = taskDom;
    this._taskManager = taskManager;
    this._editingTask = false;
    this._editTaskId = null;

    this.GoBackToProjectPage = this.GoBackToProjectPage.bind(this);
    this.DisplayModal = this.DisplayModal.bind(this);
    this.HideModal = this.HideModal.bind(this);
    this.AddTask = this.AddTask.bind(this);
    this.CompleteTask = this.CompleteTask.bind(this);
    this.DeleteTask = this.DeleteTask.bind(this);
    this.EditTask = this.EditTask.bind(this);

    this._content = DomHelper.CreateElement('div', ['content-wrapper']);
    this._background = DomHelper.CreateElement('div', ['task-background']);
    this._content.appendChild(this._background);
    this._overlay = DomHelper.CreateElement('div', ['overlay']);
    this._content.appendChild(this._overlay);

    this._background.appendChild(this.CreateHeader());
    this._background.appendChild(this.CreateFooter());
    this._content.appendChild(this.CreateAddTaskModal());
  }

  SetProject(projectName, projectId, tasks) {
    this._projectName = projectName;
    this._projectId = projectId;
    this._tasks = tasks;

    const title = this._background.querySelector('.project-title');
    title.innerText = projectName.toUpperCase();
  }

  SetTasks() {
    let taskWrapper = this._background.querySelector('.task-wrapper');

    if (taskWrapper !== undefined && taskWrapper !== null) {
      this._background.removeChild(taskWrapper);
    }

    taskWrapper = DomHelper.CreateElement('div', ['task-wrapper']);
    for (let i = 0; i < this._tasks.length; i++) {
      taskWrapper.appendChild(this.CreateTask(this._tasks[i]));
    }

    this._background.appendChild(taskWrapper);
  }

  CreateTask(task) {
    const taskDiv = DomHelper.CreateElement('div', ['task-div']);
    taskDiv.dataset.taskId = task.id;

    const taskFlex = DomHelper.CreateElement('div', ['task-flex']);

    let taskCustomCheck;

    if (task.completionStatus) {
      taskCustomCheck = DomHelper.CreateElement('button', [
        'task-custom-check-complete',
      ]);
    } else {
      taskCustomCheck = DomHelper.CreateElement('button', [
        'task-custom-check',
      ]);
    }

    taskCustomCheck.addEventListener('click', this.CompleteTask);

    const taskDataContainer = DomHelper.CreateElement('div', [
      'task-data-container',
    ]);

    const taskData = DomHelper.CreateElement('div', ['task-data']);
    const taskTitlePriority = DomHelper.CreateElement('div', [
      'task-title-priority',
    ]);
    const taskPriority = DomHelper.CreateElement('img', ['task-priority']);

    switch (Number(task.priority)) {
      case 0:
        taskPriority.src = LowPriority;
        taskPriority.title = 'Low Priority';
        break;
      case 1:
        taskPriority.src = MedPriority;
        taskPriority.title = 'Medium Priority';
        break;
      case 2:
        taskPriority.src = HighPriority;
        taskPriority.title = 'High Priority';
        break;
      default:
        break;
    }

    const title = taskTitlePriority.appendChild(
      DomHelper.CreateElement('div', ['task-individual-title'])
    );
    title.innerText = task.name;

    taskTitlePriority.appendChild(taskPriority);

    taskData.appendChild(taskTitlePriority);

    if (task.completionStatus) {
      title.classList.add('task-individual-title-complete');
    }

    const dueDate = taskData.appendChild(
      DomHelper.CreateElement('div', ['task-date'])
    );

    if (task.completionStatus) {
      dueDate.innerText = `Completed: ${format(task.completionDate, 'PPPP')}`;
    } else {
      dueDate.innerText = `Due: ${format(task.dueDate, 'PPPP')}`;
    }

    const taskButtonContainer = DomHelper.CreateElement('div', [
      'task-button-container',
    ]);
    const deleteTask = DomHelper.CreateElement('button', ['delete-task']);
    const editTask = DomHelper.CreateElement('button', ['edit-task']);

    deleteTask.title = 'Delete';
    editTask.title = 'Edit';

    deleteTask.addEventListener('click', this.DeleteTask);
    editTask.addEventListener('click', this.EditTask);

    taskButtonContainer.appendChild(editTask);
    taskButtonContainer.appendChild(deleteTask);
    taskDataContainer.appendChild(taskData);
    taskDataContainer.appendChild(taskButtonContainer);
    taskFlex.appendChild(taskCustomCheck);
    taskFlex.appendChild(taskDataContainer);
    taskDiv.appendChild(taskFlex);

    return taskDiv;
  }

  DeleteTask(evt) {
    let taskId = -1;
    let parent = evt.target.parentElement;

    while (!parent.classList.contains('task-div')) {
      parent = parent.parentElement;
    }

    taskId = Number(parent.dataset.taskId);

    this._taskManager.DeleteTask(taskId);
    this.RefreshTasks();
  }

  EditTask(evt) {
    let taskId = -1;
    let parent = evt.target.parentElement;

    while (!parent.classList.contains('task-div')) {
      parent = parent.parentElement;
    }

    taskId = Number(parent.dataset.taskId);

    for (let i = 0; i < this._tasks.length; i++) {
      if (this._tasks[i].taskId === taskId) {
        this.PopulateModalForEdit(this._tasks[i]);
        break;
      }
    }
  }

  CompleteTask(evt) {
    let taskId = -1;
    let parent = evt.target.parentElement;

    while (!parent.classList.contains('task-div')) {
      parent = parent.parentElement;
    }

    taskId = Number(parent.dataset.taskId);

    const completionStatus = this._taskManager.SetTaskComplete(taskId);

    const taskDiv = evt.target.parentElement.parentElement;
    const taskTitle = taskDiv.querySelector('.task-individual-title');
    const taskDate = taskDiv.querySelector('.task-date');

    if (completionStatus) {
      evt.target.classList.remove('task-custom-check');
      evt.target.classList.add('task-custom-check-complete');

      taskTitle.classList.add('task-individual-title-complete');
      taskDate.classList.add('task-date-complete');

      taskDate.innerText = `Completed: ${format(
        this._taskManager.GetTaskCompletionDate(taskId),
        'PPPP'
      )}`;
    } else {
      evt.target.classList.remove('task-custom-check-complete');
      evt.target.classList.add('task-custom-check');

      taskTitle.classList.remove('task-individual-title-complete');
      taskDate.classList.remove('task-date-complete');

      taskDate.innerText = `Due: ${format(
        this._taskManager.GetTaskDueDate(taskId),
        'PPPP'
      )}`;
    }
  }

  GoBackToProjectPage() {
    this._taskDom.GoToProjectPage();
  }

  CreateHeader() {
    const header = DomHelper.CreateElement('div', ['project-header']);

    const backBtn = DomHelper.CreateElement('input', ['task-back']);
    backBtn.setAttribute('type', 'image');
    backBtn.src = BackArrow;
    backBtn.addEventListener('click', this.GoBackToProjectPage);

    const title = DomHelper.CreateElement('h1', ['project-title']);
    title.innerText = 'Project Title';

    header.appendChild(backBtn);
    header.appendChild(title);

    return header;
  }

  CreateFooter() {
    const footerWrapper = DomHelper.CreateElement('div', [
      'project-footer-wrapper',
    ]);
    const footer = DomHelper.CreateElement('div', ['project-footer']);
    const addBtn = DomHelper.CreateElement('input', ['project-add']);
    addBtn.setAttribute('type', 'image');
    addBtn.src = AddImg;
    addBtn.addEventListener('click', this.DisplayModal);

    footer.appendChild(addBtn);
    footerWrapper.appendChild(footer);

    return footerWrapper;
  }

  CreateAddTaskModal() {
    this._addTaskModalWrapper = DomHelper.CreateElement('div', [
      'add-task-modal-wrapper',
    ]);
    this._addTaskModal = DomHelper.CreateElement('div', ['add-task-modal']);

    const taskNameInput = DomHelper.CreateElement('input', [
      'task-modal-name-input',
    ]);
    taskNameInput.type = 'text';
    taskNameInput.placeholder = 'Task Name...';
    taskNameInput.maxLength = 40;
    this._addTaskModal.appendChild(taskNameInput);

    const taskDescInput = DomHelper.CreateElement('textarea', [
      'task-modal-desc-input',
    ]);
    taskDescInput.resize = 'none';
    taskDescInput.placeholder = 'Description...';
    taskDescInput.maxLength = 400;
    this._addTaskModal.appendChild(taskDescInput);

    const taskDatePriorityWrapper = DomHelper.CreateElement('div', [
      'task-modal-datepriority-wrapper',
    ]);

    const taskDueDate = DomHelper.CreateElement('input', [
      'task-modal-date-input',
    ]);
    taskDueDate.type = 'datetime-local';
    const currentDate = Date.now();
    const formattedDate = format(currentDate, 'yyyy-MM-dd');
    const formattedTime = format(currentDate, 'HH:mm');

    const timeValue = `${formattedDate}T${formattedTime}`;
    taskDueDate.value = timeValue;
    taskDueDate.min = timeValue;

    const futureDate = add(currentDate, { years: 10 });
    const formattedFutureDate = format(futureDate, 'yyyy-MM-dd');
    const formattedFutureTime = format(futureDate, 'HH:mm');
    const timeFutureValue = `${formattedFutureDate}T${formattedFutureTime}`;
    taskDueDate.max = timeFutureValue;

    taskDatePriorityWrapper.appendChild(taskDueDate);

    const priorityInput = DomHelper.CreateElement('select', [
      'task-modal-priority-input',
    ]);
    const lowP = DomHelper.CreateElement('option');
    const medP = DomHelper.CreateElement('option');
    const highP = DomHelper.CreateElement('option');
    lowP.value = 0;
    lowP.innerText = 'Low';
    medP.value = 1;
    medP.innerText = 'Medium';
    highP.value = 2;
    highP.innerText = 'High';
    priorityInput.appendChild(lowP);
    priorityInput.appendChild(medP);
    priorityInput.appendChild(highP);

    taskDatePriorityWrapper.appendChild(priorityInput);

    this._addTaskModal.appendChild(taskDatePriorityWrapper);

    const buttonWrapper = DomHelper.CreateElement('div', [
      'project-modal-button-wrapper',
    ]);
    const addButton = DomHelper.CreateElement('button', [
      'project-modal-add-button',
      'project-modal-button',
    ]);
    const cancelButton = DomHelper.CreateElement('button', [
      'project-modal-cancel-button',
      'project-modal-button',
    ]);

    addButton.innerText = 'OK';
    cancelButton.innerText = 'CANCEL';

    addButton.addEventListener('click', this.AddTask);
    cancelButton.addEventListener('click', this.HideModal);

    buttonWrapper.appendChild(cancelButton);
    buttonWrapper.appendChild(addButton);

    this._addTaskModal.appendChild(buttonWrapper);
    this._addTaskModalWrapper.appendChild(this._addTaskModal);

    return this._addTaskModalWrapper;
  }

  DisplayModal() {
    this.ResetModal();
    this._addTaskModalWrapper.style.display = 'flex';
    this._addTaskModal.querySelector('.task-modal-name-input').focus();
    this._overlay.classList.add('blur-overlay');
  }

  DisplayModalForEdit() {
    this._addTaskModalWrapper.style.display = 'flex';
    this._addTaskModal.querySelector('.task-modal-name-input').focus();
    this._overlay.classList.add('blur-overlay');
  }

  HideModal() {
    this._addTaskModalWrapper.style.display = 'none';
    this._overlay.classList.remove('blur-overlay');
    this._editingTask = false;
  }

  ResetModal() {
    this._addTaskModal.querySelector('.task-modal-name-input').value = '';
    this._addTaskModal.querySelector('.task-modal-desc-input').value = '';
    this._addTaskModal.querySelector('.task-modal-priority-input').value = 0;

    const currentDate = Date.now();
    const formattedDate = format(currentDate, 'yyyy-MM-dd');
    const formattedTime = format(currentDate, 'HH:mm');

    this._addTaskModal.querySelector(
      '.task-modal-date-input'
    ).value = `${formattedDate}T${formattedTime}`;
  }

  AddTask() {
    const input = this.GetTaskModalInput();

    if (!this._editingTask) {
      this._taskManager.AddTask(
        input.taskName,
        input.taskDesc,
        input.projectId,
        new Date(input.taskDate),
        input.taskPriority
      );
    } else {
      this._taskManager.EditTask(
        this._editTaskId,
        input.taskName,
        input.taskDesc,
        input.projectId,
        new Date(input.taskDate),
        input.taskPriority
      );
    }

    this.RefreshTasks();
    this.HideModal();
  }

  GetTaskModalInput() {
    return {
      projectId: this._projectId,
      taskName: this._addTaskModal.querySelector('.task-modal-name-input')
        .value,
      taskDesc: this._addTaskModal.querySelector('.task-modal-desc-input')
        .value,
      taskDate: this._addTaskModal.querySelector('.task-modal-date-input')
        .value,
      taskPriority: this._addTaskModal.querySelector(
        '.task-modal-priority-input'
      ).value,
    };
  }

  PopulateModalForEdit(task) {
    const nameInput = this._addTaskModal.querySelector(
      '.task-modal-name-input'
    );
    const descInput = this._addTaskModal.querySelector(
      '.task-modal-desc-input'
    );
    const dateInput = this._addTaskModal.querySelector(
      '.task-modal-date-input'
    );
    const priorityInput = this._addTaskModal.querySelector(
      '.task-modal-priority-input'
    );

    nameInput.value = task.taskName;
    descInput.value = task.description;

    const { dueDate } = task;
    const formattedDate = format(dueDate, 'yyyy-MM-dd');
    const formattedTime = format(dueDate, 'HH:mm');

    dateInput.value = `${formattedDate}T${formattedTime}`;

    priorityInput.value = task.priority;

    this._editTaskId = task.taskId;
    this._editingTask = true;

    this.DisplayModalForEdit();
  }

  RefreshTasks() {
    this._tasks = this._taskManager.GetTasksByCreationDate(this._projectId);
    this.SetTasks();
  }

  GetContent() {
    return this._content;
  }
}
