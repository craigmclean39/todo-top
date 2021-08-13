//This will handle the UI of the task app
import LogoImg from "./media/logo.svg";

class DomHelper {
    constructor() {

    }

    static CreateElement(selector, classNames)
    {
        let element = document.createElement(selector);
        for(let i = 0; i < classNames.length; i++)
        {
            element.classList.add(classNames[i]);
        }

        return element;
    }
}

export class TaskDom {
    constructor() {

        this._body = document.querySelector("body");
        this._currentPage = null;
    }

    SetPage(page)
    {
        //remove current page
        if(this._currentPage != null)
        {
            this._body.removeChild(this._currentPage);
        }

        //add new page
        this._body.appendChild(page);
        this._currentPage = page;
    }
}

export class ProjectPage {
    constructor() {

        this._content = DomHelper.CreateElement("div", ["content-wrapper"]);
        this._background = DomHelper.CreateElement("div", ["project-background"]);
        this._content.appendChild(this._background);
        this._background.appendChild(this.#CreateHeader());
    }

    #CreateHeader()
    {
        const header = DomHelper.CreateElement("div", ["project-header"]);

        const logo = DomHelper.CreateElement("img", ["project-logo"]);
        logo.src = LogoImg;

        const title = DomHelper.CreateElement("h1", ["project-title"]);
        title.innerText = "TASKER";

        header.appendChild(logo);
        header.appendChild(title);

        return header;
    }

    GetContent()
    {
        return this._content;
    }

    SetProjects(projectNames, projectIds, projectTaskNum)
    {
        this._projectNames = projectNames;
        this._projectIds = projectIds;

        const projectWrapper = DomHelper.CreateElement("div", ["project-wrapper"]);
        for(let i = 0; i < projectNames.length; i++)
        {
            projectWrapper.appendChild(this.#CreateProject(projectNames[i], projectIds[i] ,projectTaskNum[i]));
        }

        this._background.appendChild(projectWrapper);
    }

    #CreateProject(projectName, projectId, projectNumTasks)
    {
        const projectDiv = DomHelper.CreateElement("div", ["project-div"]);
        projectDiv.dataset.projectId = projectId;

        let title = projectDiv.appendChild(DomHelper.CreateElement("div", ["project-individual-title"]));
        title.innerText = projectName;
        let numTasks = projectDiv.appendChild(DomHelper.CreateElement("div", ["project-individual-num-tasks"]));
        numTasks.innerText = `${projectNumTasks} Tasks`;

        return projectDiv;
    }
}

export class TaskPage {
    constructor() {

        this._content = DomHelper.CreateElement("div", ["content-wrapper"]);
        this._background = DomHelper.CreateElement("div", ["task-background"]);

        this._background.innerText = "Tasks";

        this._content.appendChild(this._background);
    }

    GetContent()
    {
        return this._content;
    }
}