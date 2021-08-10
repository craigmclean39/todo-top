import { format, isThisSecond } from 'date-fns';

export class Task {

    static #id = 0;

    static #getNewId() {
        this.#id++;
        return this.#id;
      }


    constructor()
    {
        this.name = "";
        this.projectId = "";
        this.description = "";
        this.priority = "";
        this.taskId = -1;
        this.complete = false;

        this.creationDate = null;
        this.dueDate = null;
        this.completionDate = null;
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
        
        this.taskId = Task.#getNewId();
    }

    //Complete Task
    SetCompletionStatus(comp)
    {
        if(comp)
        {
            this.completionDate = Date.now();
            this.complete = true;
        }
        else
        {
            this.completionDate = null;
            this.complete = false;
        }
        
    }

    get info()
    {
        return `Task: ${this.name}, Project: ${this.projectId}, Description: ${this.description}, Creation Date: ${format(this.creationDate, "MMMM do y")}, Due Date: ${format(this.dueDate, "MMMM do y")}, Priority: ${this.priority}, Complete: ${this.complete}`;
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
    GetTasksByPriority(project_id)
    {
        let returnTasks = [];
        if(project_id == undefined)
        {
            returnTasks = this.tasks;

        }
        else{
            returnTasks = this.GetTasksByProject(project_id);
        }

        returnTasks.sort(this.#PriorityCompare);
        return returnTasks;
    }

    #PriorityCompare(task1, task2)
    {
        //-1 if task1 < task2
        if(task1.priority < task2.priority)
        {
            return -1;
        }
        //0 if equal
        else if(task1.priority === task2.priority)
        {
            //if they're equal, go based off of creation date
            if(task1.creationDate < task2.creationDate)
            {
                return -1;
            }
            else if(task2.creationDate < task1.creationDate)
            {
                return 1;
            }
            else
            {
                return 0;
            }

        }
        else if(task1.priority > task2.priority)
        {
            return 1;
        }

        return 0;
    }
    //Get Tasks By DueDate
    GetTasksByDueDate(project_id)
    {
        let returnTasks = [];
        if(project_id == undefined)
        {
            returnTasks = this.tasks;

        }
        else{
            returnTasks = this.GetTasksByProject(project_id);
        }

        returnTasks.sort(this.#DueDateCompare);
        return returnTasks;
    }

    #DueDateCompare(task1, task2)
    {
        //-1 if task1 < task2
        if(task1.dueDate < task2.dueDate)
        {
            return -1;
        }
        //0 if equal
        else if(task1.dueDate === task2.dueDate)
        {
            //if they're equal, go based off of creation date
            if(task1.creationDate < task2.creationDate)
            {
                return -1;
            }
            else if(task2.creationDate < task1.creationDate)
            {
                return 1;
            }
            else
            {
                return 0;
            }

        }
        else if(task1.dueDate > task2.dueDate)
        {
            return 1;
        }

        return 0;
    }
    //Get Tasks By Creation Date
    GetTasksByCreationDate(project_id)
    {
        let returnTasks = [];
        if(project_id == undefined)
        {
            returnTasks = this.tasks;

        }
        else{
            returnTasks = this.GetTasksByProject(project_id);
        }

        returnTasks.sort(this.#CreationDateCompare);
        return returnTasks;
    }

    #CreationDateCompare(task1, task2)
    {
        //-1 if task1 < task2
        if(task1.creationDate < task2.creationDate)
        {
            return -1;
        }
        //0 if equal
        else if(task1.creationDate === task2.creationDate)
        {
            return 0;
        }
        else if(task1.creationDate > task2.creationDate)
        {
            return 1;
        }

        return 0;
    }

    //Get Tasks by Project
    GetTasksByProject(project_id)
    {
        let projTasks = [];
        for(let i = 0; i < this.tasks.length; i++)
        {
            if(this.tasks[i].projectId == project_id)
            {
                projTasks.push(this.tasks[i]);
            }
        }
        return projTasks;
    }

    //Get Projects
    GetProjects()
    {
        return this.projects;
    }

    
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