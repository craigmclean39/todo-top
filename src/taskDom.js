//This will handle the UI of the task app

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

        this._background.innerText = "BG";

        this._content.appendChild(this._background);
    }

    GetContent()
    {
        return this._content;
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