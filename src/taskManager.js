/* eslint-disable import/named */
/* eslint-disable import/prefer-default-export */
import { add } from 'date-fns';
import { LocalStorageHelper } from './localStorageHelper';
import { Task } from './task';
import { Project } from './project';

export class TaskManager {
  constructor() {
    this.tasks = [];
    this.projects = [];
    this.defaultTasks = false;

    this._localStorageHelper = new LocalStorageHelper();
    // this._localStorageHelper.ClearItems();

    this.LoadFromLocalStorage();
    this.CreateDefaultTasks();
  }

  LoadFromLocalStorage() {
    const projectsString = this._localStorageHelper.RetrieveItem('PROJECTS');
    const tasksString = this._localStorageHelper.RetrieveItem('TASKS');

    let parsedProjects;
    let parsedTasks;
    if (projectsString != null) {
      parsedProjects = JSON.parse(projectsString);

      // Need to convert back to proper project items
      let highestId = 0;
      for (let i = 0; i < parsedProjects.length; i++) {
        const p = new Project(parsedProjects[i].projectName);
        p.SetId(parsedProjects[i].projectId);
        if (parsedProjects[i].projectId > highestId) {
          highestId = parsedProjects[i].projectId;
        }
        this.projects.push(p);
      }
      Project.SetHighestId(highestId);
    }

    if (tasksString != null) {
      parsedTasks = JSON.parse(tasksString);
      let highestId = 0;
      for (let i = 0; i < parsedTasks.length; i++) {
        const t = new Task();
        t.CreateTask(
          parsedTasks[i].taskName,
          Number(parsedTasks[i].projectId),
          parsedTasks[i].taskDescription,
          parsedTasks[i].taskDueDate,
          Number(parsedTasks[i].taskPriority)
        );

        if (parsedTasks[i].taskId > highestId) {
          highestId = parsedTasks[i].taskId;
        }
        t.SetTaskId(Number(parsedTasks[i].taskId));
        t.SetCreationDate(parsedTasks[i].taskCreationDate);
        t.SetCompletionStatus(parsedTasks[i].taskComplete);
        t.SetCompletionDate(parsedTasks[i].taskCompletionDate);

        this.tasks.push(t);
      }
      Task.SetHighestId(highestId);
      // this.tasks = parsedTasks;
    }
  }

  CreateDefaultTasks() {
    const defaultTask = this._localStorageHelper.RetrieveItem('DEFAULT');

    if (defaultTask === null) {
      this.defaultTasks = true;
      this._localStorageHelper.SaveItem('DEFAULT', true);

      const p1 = this.AddProject('Home');
      const p2 = this.AddProject('Work');

      this.AddTask(
        'Go Shopping',
        'Do weekly grocery shopping',
        p1.projectId,
        add(Date.now(), { weeks: 1 }),
        0
      );

      this.AddTask(
        'Vacuum',
        'Vacuum the house.',
        p1.projectId,
        add(Date.now(), { weeks: 2 }),
        1
      );

      this.AddTask(
        'Check Emails',
        'Check and reply to all emails',
        p2.projectId,
        add(Date.now(), { days: 1 }),
        1
      );

      this.AddTask(
        'Defrag HDD',
        'Defrag my hard drives',
        p2.projectId,
        add(Date.now(), { weeks: 3 }),
        0
      );

      this.AddTask(
        'Complete Deliverables',
        'Complete my weekly deliverables',
        p2.projectId,
        add(Date.now(), { days: 3 }),
        2
      );
    }
  }

  // Get All Tasks
  GetAllTasks() {
    return this.tasks;
  }

  // Get Tasks By Priority
  GetTasksByPriority(projectId) {
    let returnTasks = [];
    if (projectId === undefined) {
      returnTasks = this.tasks;
    } else {
      returnTasks = this.GetTasksByProject(projectId);
    }

    returnTasks.sort(TaskManager.PriorityCompare);
    return returnTasks;
  }

  static PriorityCompare(task1, task2) {
    // -1 if task1 < task2
    if (task1.priority < task2.priority) {
      return -1;
    }
    // 0 if equal
    if (task1.priority === task2.priority) {
      // if they're equal, go based off of creation date
      if (task1.creationDate < task2.creationDate) {
        return -1;
      }
      if (task2.creationDate < task1.creationDate) {
        return 1;
      }
      return 0;
    }
    if (task1.priority > task2.priority) {
      return 1;
    }

    return 0;
  }

  // Get Tasks By DueDate
  GetTasksByDueDate(projectId) {
    let returnTasks = [];
    if (projectId === undefined) {
      returnTasks = this.tasks;
    } else {
      returnTasks = this.GetTasksByProject(projectId);
    }

    returnTasks.sort(TaskManager.DueDateCompare);
    return returnTasks;
  }

  static DueDateCompare(task1, task2) {
    // -1 if task1 < task2
    if (task1.dueDate < task2.dueDate) {
      return -1;
    }
    // 0 if equal
    if (task1.dueDate === task2.dueDate) {
      // if they're equal, go based off of creation date
      if (task1.creationDate < task2.creationDate) {
        return -1;
      }
      if (task2.creationDate < task1.creationDate) {
        return 1;
      }
      return 0;
    }
    if (task1.dueDate > task2.dueDate) {
      return 1;
    }

    return 0;
  }

  // Get Tasks By Creation Date
  GetTasksByCreationDate(projectId) {
    let returnTasks = [];
    if (projectId === undefined) {
      returnTasks = this.tasks;
    } else {
      returnTasks = this.GetTasksByProject(projectId);
    }

    returnTasks.sort(TaskManager.CreationDateCompare);
    return returnTasks;
  }

  static CreationDateCompare(task1, task2) {
    // -1 if task1 < task2
    if (task1.creationDate < task2.creationDate) {
      return -1;
    }
    // 0 if equal
    if (task1.creationDate === task2.creationDate) {
      return 0;
    }
    if (task1.creationDate > task2.creationDate) {
      return 1;
    }

    return 0;
  }

  // Get Tasks by Project
  GetTasksByProject(projectId) {
    const projTasks = [];
    for (let i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].projectId === projectId) {
        projTasks.push(this.tasks[i]);
      }
    }
    return projTasks;
  }

  GetTaskNumByProject(projectId) {
    let numTasks = 0;
    for (let i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].projectId === projectId) {
        numTasks += 1;
      }
    }
    return numTasks;
  }

  // Get Projects
  GetProjects() {
    return this.projects;
  }

  GetProjectNames() {
    const projNames = [];

    for (let i = 0; i < this.projects.length; i++) {
      projNames.push(this.projects[i].projectName);
    }

    return projNames;
  }

  GetProjectIds() {
    const projIds = [];

    for (let i = 0; i < this.projects.length; i++) {
      projIds.push(this.projects[i].projectId);
    }

    return projIds;
  }

  GetProjectTaskNumbers() {
    const taskNums = [];
    for (let i = 0; i < this.projects.length; i++) {
      taskNums.push(this.GetTaskNumByProject(this.projects[i].projectId));
    }
    return taskNums;
  }

  GetProjectNameById(projectId) {
    for (let i = 0; i < this.projects.length; i++) {
      if (this.projects[i].projectId === projectId) {
        return this.projects[i].projectName;
      }
    }

    return undefined;
  }

  // Add Project
  AddProject(project) {
    const proj = new Project(project);
    this.projects.push(proj);

    this._localStorageHelper.RemoveItem('PROJECTS');
    this._localStorageHelper.SaveItem('PROJECTS', this.projects);

    return proj;
  }

  // Add Task
  AddTask(taskTitle, taskDesc, projectId, dueDate, priority) {
    const task = new Task();
    task.CreateTask(taskTitle, projectId, taskDesc, dueDate, priority);
    this.tasks.push(task);

    this._localStorageHelper.RemoveItem('TASKS');
    this._localStorageHelper.SaveItem('TASKS', this.tasks);
  }

  SetTaskComplete(taskId) {
    let returnValue = false;
    for (let i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].taskId === taskId) {
        returnValue = this.tasks[i].ToggleCompletionStatus();
        break;
      }
    }

    this._localStorageHelper.RemoveItem('TASKS');
    this._localStorageHelper.SaveItem('TASKS', this.tasks);

    return returnValue;
  }

  GetTaskCompletionDate(taskId)
  {
    for (let i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].taskId === taskId) {
        return this.tasks[i].completionDate;
      }
    }
    return null;
  }

  GetTaskDueDate(taskId)
  {
    for (let i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].taskId === taskId) {
        return this.tasks[i].dueDate;
      }
    }
    return null;
  }
}
