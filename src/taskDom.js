/* eslint-disable import/prefer-default-export */
// This will handle the UI of the task app

import { TaskManager } from './task';
import { ProjectPage } from './projectPage';
import { TaskPage } from './taskPage';

export class TaskDom {
  constructor(taskManager) {
    // eslint-disable-next-line no-undef
    this._body = document.querySelector('body');
    this._currentPage = null;
    this._taskManager = taskManager;

    this._projectPage = new ProjectPage(taskManager, this);
    this._taskPage = new TaskPage(taskManager, this);

    this.GoToProjectPage();
  }

  SelectProject(projectId) {
    const tasks = this._taskManager.GetTasksByCreationDate(projectId);
    const projectName = this._taskManager.GetProjectNameById(projectId);
    this.GoToTaskPage(projectName, projectId, tasks);
  }

  GoToProjectPage() {
    this.SetPage(this._projectPage.GetContent());
    this._projectPage.SetProjects(
      this._taskManager.GetProjectNames(),
      this._taskManager.GetProjectIds(),
      this._taskManager.GetProjectTaskNumbers()
    );
  }

  GoToTaskPage(projectName, projectId, tasks) {
    this._taskPage.SetProject(projectName, projectId, tasks);
    this._taskPage.SetTasks();
    this.SetPage(this._taskPage.GetContent());
  }

  SetPage(page) {
    // remove current page
    if (this._currentPage != null) {
      this._body.removeChild(this._currentPage);
    }

    // add new page
    this._body.appendChild(page);
    this._currentPage = page;
  }
}
