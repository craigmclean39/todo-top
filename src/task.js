import { format } from 'date-fns';

export class Task {
    constructor()
    {
        this.name = "";
        this.projectId = "";
        this.description = "";
        this.creationDate = null;
        this.dueDate = null;
        this.priority = "";
    }

    //CreateTask
    CreateTask(name, projectId, description, dueDate, priority)
    {
        this.name = name;
        this.projectId = projectId;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;

        this.creationDate = Date.now();
    }

    get info()
    {
        
        return `Task: ${this.name}, Project: ${this.projectId}, Description: ${this.description}, Creation Date: ${format(this.creationDate, "MMMM do y")}, Due Date: ${format(this.dueDate, "MMMM do y")}, Priority: ${this.priority}`;
    }

    //Change Priority
    //Set DueDate
    //Change Project
}

export class Project {

    static #id = 0;

    static #getNewId() {
        this.#id++;
        return this.#id;
      }

    constructor(projectName)
    {
        this.projectName = projectName;
        this.projectId = Project.#getNewId();
    }

    get name()  {
        return this.projectName;
    }

    get id() {
        return this.projectId;
    }

    get info() {
        return `Project: ${this.projectName} ID: ${this.projectId}`;
    }
}

export class TaskManager {

    constructor()
    {
        this.tasks = [];
        this.projects = [];
    }

    //Get All Tasks
    GetAllTasks() {
        return this.tasks;
    }
    //Get Tasks By Priority
    //Get Tasks By DueDate
    //Get Tasks By Creation Date
    //Get Tasks by Project

    //Get Projects

    
    //Add Project
    AddProject(project)  {
        this.projects.push(project);
    }

    //Add Task
    AddTask(task)
    {
        this.tasks.push(task);
    }
}