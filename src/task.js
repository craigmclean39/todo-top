import { format, isThisSecond, parse } from 'date-fns';

export class Task {

    static #id = 0;

    static #getNewId() {
        this.#id++;
        return this.#id;
      }

    static SetHighestId(highId)
    {
        this.#id = highId;
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

    SetCompletionDate(date)
    {
        this.taskCompletionDate = date;
    }

    SetTaskId(id)
    {
        this.taskId = id;
    }

    SetCreationDate(date)
    {
        this.taskCreationDate = date;
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
    
    //used when reading projects from local Storage, don't want conflicting ids
    static SetHighestId(highId)
    {
        this.#id = highId;
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

    //used when reading projects from localStorage
    SetId(id)
    {
        this.projectId = id;
    }
}

export class TaskManager {

    constructor()
    {
        this.tasks = [];
        this.projects = [];

        this._localStorageHelper = new LocalStorageHelper();
        //this._localStorageHelper.ClearItems();

        const projectsString = this._localStorageHelper.RetrieveItem("PROJECTS");
        const tasksString = this._localStorageHelper.RetrieveItem("TASKS");

        let parsedProjects, parsedTasks;
        if(projectsString != null)
        {
            parsedProjects = JSON.parse(projectsString);

            //Need to convert back to proper project items
            let highestId = 0;
            for(let i = 0; i < parsedProjects.length; i++)
            {
                let p = new Project(parsedProjects[i].projectName);
                p.SetId(parsedProjects[i].projectId);
                if(parsedProjects[i].projectId > highestId)
                {
                    highestId = parsedProjects[i].projectId;
                }
                this.projects.push(p);
            }
            Project.SetHighestId(highestId);
        }

        if(tasksString != null)
        {
            parsedTasks = JSON.parse(tasksString);
            let highestId = 0;
            for(let i = 0; i < parsedTasks.length; i++)
            {
                let t = new Task();
                t.CreateTask(
                    parsedTasks[i].taskName,
                    parsedTasks[i].projectId,
                    parsedTasks[i].taskDescription,
                    parsedTasks[i].taskDueDate,
                    parsedTasks[i].taskPriority
                )

                if(parsedTasks[i].taskId > highestId)
                {
                    highestId = parsedTasks[i].taskId;
                }
                t.SetTaskId(parsedTasks[i].taskId);
                t.SetCreationDate(parsedTasks[i].taskCreationDate);
                t.SetCompletionStatus(parsedTasks[i].taskComplete);
                t.SetCompletionDate(parsedTasks[i].taskCompletionDate);

                this.tasks.push(t);

                
            }
            Task.SetHighestId(highestId);
            //this.tasks = parsedTasks;
        }
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

        this._localStorageHelper.RemoveItem("PROJECTS");
        this._localStorageHelper.SaveItem("PROJECTS", this.projects);

        return proj;
    }

    //Add Task
    AddTask(taskTitle, taskDesc, projectId, dueDate, priority)
    {
        let task = new Task();
        task.CreateTask(taskTitle, projectId, taskDesc, dueDate, priority);
        this.tasks.push(task);

        this._localStorageHelper.RemoveItem("TASKS");
        this._localStorageHelper.SaveItem("TASKS", this.tasks);

    }   
}

export class LocalStorageHelper {
    constructor(){
        if(typeof(Storage) !== "undefined")
        {
            this._storageAvailable = true;
            console.log("Local Storage Available");
            console.log(window.localStorage);
        }
        else
        {
            this._storageAvailable = false;
            console.log("Local Storage Not Available");
        }
    }

    SaveItem(key, objectToSave)
    {
        if(!this._storageAvailable)
        {
            return;
        }
        
        window.localStorage.setItem(key, JSON.stringify(objectToSave));
    }

    ClearItems()
    {
        if(!this._storageAvailable)
        {
            return;
        }

        window.localStorage.clear();
    }

    RetrieveItem(key)
    {
        if(!this._storageAvailable)
        {
            return undefined;
        }

        return window.localStorage.getItem(key);
    }

    RemoveItem(key)
    {
        if(!this._storageAvailable)
        {
            return;
        }

        window.localStorage.removeItem(key);
    }
}