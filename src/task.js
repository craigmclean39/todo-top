import { format, isThisSecond } from 'date-fns';

export class Task {

    static #id = 0;

    static #getNewId() {
        this.#id++;
        return this.#id;
      }


    constructor()
    {
        this.taskName = "";
        this.projectId = "";
        this.taskDescription = "";
        this.taskPriority = "";
        this.taskId = -1;
        this.taskComplete = false;

        this.taskCreationDate = null;
        this.taskDueDate = null;
        this.taskCompletionDate = null;
    }

    //CreateTask
    CreateTask(name, projectId, description, dueDate, priority)
    {
        this.taskName = name;
        this.projectId = projectId;
        this.taskDescription = description;
        this.taskDueDate = dueDate;
        this.taskPriority = priority;

        this.taskCreationDate = Date.now();
        
        this.taskId = Task.#getNewId();
    }

    //Complete Task
    SetCompletionStatus(comp)
    {
        if(comp)
        {
            this.taskCompletionDate = Date.now();
            this.taskComplete = true;
        }
        else
        {
            this.taskCompletionDate = null;
            this.taskComplete = false;
        }
        
    }

    get info()
    {
        return `Task: ${this.taskName}, Project: ${this.projectId}, Description: ${this.taskDescription}, Creation Date: ${format(this.taskCreationDate, "MMMM do y")}, Due Date: ${format(this.taskDueDate, "MMMM do y")}, Priority: ${this.taskPriority}, Complete: ${this.taskComplete}`;
    }

    get id()
    {
        return this.taskId;
    }

    get name()
    {
        return this.taskName;
    }

    get description()
    {
        return this.taskDescription;
    }

    get priority()
    {
        return this.taskPriority;
    }

    get completionStatus()
    {
        return this.taskComplete;
    }

    get creationDate()
    {
        return this.taskCreationDate;
    }

    get dueDate()
    {
        return this.taskDueDate;
    }

    get completionDate()
    {
        return this.taskCompletionDate;
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

    #GetTaskNumByProject(project_id)
    {
        let numTasks = 0;
        for(let i = 0; i < this.tasks.length; i++)
        {
            if(this.tasks[i].projectId == project_id)
            {
                numTasks++;
            }
        }
        return numTasks;
    }

    //Get Projects
    GetProjects()
    {
        return this.projects;
    }

    GetProjectNames()
    {
        let projNames = [];

        for(let i = 0; i < this.projects.length; i++)
        {
            projNames.push(this.projects[i].projectName);
        }

        return projNames;
    }

    GetProjectIds()
    {
        let projIds = [];

        for(let i = 0; i < this.projects.length; i++)
        {
            projIds.push(this.projects[i].projectId);
        }
        
        return projIds;
    }

    GetProjectTaskNumbers()
    {
        let taskNums = [];
        for(let i = 0; i < this.projects.length; i++)
        {
            taskNums.push(this.#GetTaskNumByProject(this.projects[i].projectId));
        }
        return taskNums;
    }

    GetProjectNameById(projectId)
    {
        for(let i = 0; i < this.projects.length; i++)
        {
            if(this.projects[i].projectId == projectId)
            {
                return this.projects[i].projectName;
            }
        }

        return undefined;
    }

    
    //Add Project
    AddProject(project)  {
        let proj = new Project(project);
        this.projects.push(proj);
        return proj;
    }

    //Add Task
    AddTask(taskTitle, taskDesc, projectId, dueDate, priority)
    {
        let task = new Task();
        task.CreateTask(taskTitle, projectId, taskDesc, dueDate, priority);
        this.tasks.push(task);
    }
}