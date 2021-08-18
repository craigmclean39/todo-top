import BackArrow from "./media/back-arrow.svg";
import AddImg from "./media/add.svg";
import { format, add } from 'date-fns';
import { DomHelper } from "./domHelper";

export class TaskPage {
    constructor(taskManager, taskDom) {

        this._taskDom = taskDom;
        this._taskManager = taskManager;

        this.GoBackToProjectPage = this.GoBackToProjectPage.bind(this);
        this.DisplayModal = this.DisplayModal.bind(this);
        this.HideModal = this.HideModal.bind(this);
        this.AddTask = this.AddTask.bind(this);

        this._content = DomHelper.CreateElement("div", ["content-wrapper"]);
        this._background = DomHelper.CreateElement("div", ["task-background"]);
        this._content.appendChild(this._background);
        this._overlay = DomHelper.CreateElement("div", ["overlay"]);
        this._content.appendChild(this._overlay);

        this._background.appendChild(this.#CreateHeader());
        this._background.appendChild(this.#CreateFooter());
        this._content.appendChild(this.#CreateAddTaskModal());

    }

    SetProject(projectName, projectId, tasks)
    {
        this._projectName = projectName;
        this._projectId = projectId;
        this._tasks = tasks;

        const title = this._background.querySelector(".project-title");
        title.innerText = projectName.toUpperCase();
    }

    SetTasks()
    {
        let taskWrapper = this._background.querySelector(".task-wrapper");

        if(taskWrapper != undefined)
        {
            this._background.removeChild(taskWrapper);
        }

        taskWrapper = DomHelper.CreateElement("div", ["task-wrapper"]);
        for(let i = 0; i < this._tasks.length; i++)
        {
            taskWrapper.appendChild(this.#CreateTask(this._tasks[i]));
        }


        this._background.appendChild(taskWrapper);

    }

    #CreateTask(task)
    {
        const taskDiv = DomHelper.CreateElement("div", ["task-div"]);
        taskDiv.dataset.taskId = task.id;

        let title = taskDiv.appendChild(DomHelper.CreateElement("div", ["task-individual-title"]));
        title.innerText = task.name;

        let dueDate = taskDiv.appendChild(DomHelper.CreateElement("div", ["task-due-date"]));
        dueDate.innerText = `Due: ${format(task.dueDate, "PPPP")}`;

        //taskDiv.addEventListener("click", this.SelectProject);

        return taskDiv;
    }


    GoBackToProjectPage()
    {
        this._taskDom.GoToProjectPage();
    }

    #CreateHeader()
    {
        const header = DomHelper.CreateElement("div", ["project-header"]);

        const backBtn = DomHelper.CreateElement("input", ["task-back"]);
        backBtn.setAttribute("type", "image");
        backBtn.src = BackArrow;
        backBtn.addEventListener("click", this.GoBackToProjectPage);

        const title = DomHelper.CreateElement("h1", ["project-title"]);
        title.innerText = "Project Title";

        header.appendChild(backBtn);
        header.appendChild(title);

        return header;
    }

    #CreateFooter()
    {
        const footerWrapper = DomHelper.CreateElement("div", ["project-footer-wrapper"]);
        const footer = DomHelper.CreateElement("div", ["project-footer"]);
        const addBtn = DomHelper.CreateElement("input", ["project-add"]);
        addBtn.setAttribute("type", "image");
        addBtn.src = AddImg;
        addBtn.addEventListener("click", this.DisplayModal);

        footer.appendChild(addBtn);
        footerWrapper.appendChild(footer);
        
        return footerWrapper;
    }

    #CreateAddTaskModal()
    {
        this._addTaskModalWrapper = DomHelper.CreateElement("div", ["add-task-modal-wrapper"]);
        this._addTaskModal = DomHelper.CreateElement("div", ["add-task-modal"]);

        let taskNameInput = DomHelper.CreateElement("input", ["task-modal-name-input"]);
        taskNameInput.type = "text";
        taskNameInput.placeholder = "Task Name...";
        taskNameInput.maxLength = 40;
        this._addTaskModal.appendChild(taskNameInput);

        let taskDescInput = DomHelper.CreateElement("textarea", ["task-modal-desc-input"]);
        taskDescInput.resize = "none";
        taskDescInput.placeholder = "Description...";
        taskDescInput.maxLength = 400;
        this._addTaskModal.appendChild(taskDescInput);


        let taskDatePriorityWrapper = DomHelper.CreateElement("div", ["task-modal-datepriority-wrapper"]);

        let taskDueDate = DomHelper.CreateElement("input", ["task-modal-date-input"]);
        taskDueDate.type = "datetime-local";
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

        let priorityInput = DomHelper.CreateElement("select", ["task-modal-priority-input"]);
        let lowP = DomHelper.CreateElement("option");
        let medP = DomHelper.CreateElement("option");
        let highP = DomHelper.CreateElement("option");
        lowP.value = 0;
        lowP.innerText = "Low";
        medP.value = 1;
        medP.innerText = "Medium";
        highP.value = 2;
        highP.innerText = "High";
        priorityInput.appendChild(lowP);
        priorityInput.appendChild(medP);
        priorityInput.appendChild(highP);

        taskDatePriorityWrapper.appendChild(priorityInput);

        this._addTaskModal.appendChild(taskDatePriorityWrapper);

        let buttonWrapper = DomHelper.CreateElement("div", ["project-modal-button-wrapper"]);
        let addButton = DomHelper.CreateElement("button", ["project-modal-add-button" ,"project-modal-button"]);
        let cancelButton = DomHelper.CreateElement("button", ["project-modal-cancel-button", "project-modal-button"]);

        addButton.innerText = "OK";
        cancelButton.innerText = "CANCEL";

        addButton.addEventListener("click", this.AddTask);
        cancelButton.addEventListener("click", this.HideModal);

        buttonWrapper.appendChild(cancelButton);
        buttonWrapper.appendChild(addButton);
        

        this._addTaskModal.appendChild(buttonWrapper);
        this._addTaskModalWrapper.appendChild(this._addTaskModal);

        return this._addTaskModalWrapper;
    }

    DisplayModal()
    {
        this.ResetModal();
        this._addTaskModalWrapper.style.display = "flex";
        this._overlay.classList.add("blur-overlay");
    }

    HideModal()
    {
        this._addTaskModalWrapper.style.display = "none";
        //this.#ResetProjectModal();

        this._overlay.classList.remove("blur-overlay");
    }

    ResetModal()
    {
        this._addTaskModal.querySelector(".task-modal-name-input").value = "";
        this._addTaskModal.querySelector(".task-modal-desc-input").value = "";

        const currentDate = Date.now();
        const formattedDate = format(currentDate, 'yyyy-MM-dd');
        const formattedTime = format(currentDate, 'HH:mm');

        this._addTaskModal.querySelector(".task-modal-date-input").value = `${formattedDate}T${formattedTime}`;
    }

    AddTask()
    {
        let input = this.#GetTaskModalInput();

        this._taskManager.AddTask(input.taskName, input.taskDesc, input.projectId, new Date(input.taskDate), input.taskPriority);

        this.HideModal();
    }

    #GetTaskModalInput()
    {
        return {
            projectId: this._projectId,
            taskName: this._addTaskModal.querySelector(".task-modal-name-input").value,
            taskDesc: this._addTaskModal.querySelector(".task-modal-desc-input").value,
            taskDate: this._addTaskModal.querySelector(".task-modal-date-input").value,
            taskPriority:this._addTaskModal.querySelector(".task-modal-priority-input").value
        };
    }

    GetContent()
    {
        return this._content;
    }
}