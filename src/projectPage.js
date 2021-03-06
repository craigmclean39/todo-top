/* eslint-disable import/prefer-default-export */
import LogoImg from './media/logo.svg';
import AddImg from './media/add.svg';
import { DomHelper } from './domHelper';

export class ProjectPage {
  constructor(taskManager, taskDom) {
    this._taskManager = taskManager;
    this._taskDom = taskDom;
    this._addProjectModal = null;

    // Bind this to internal eventhandlers
    this.DisplayModal = this.DisplayModal.bind(this);
    this.AddProject = this.AddProject.bind(this);
    this.HideModal = this.HideModal.bind(this);
    this.SelectProject = this.SelectProject.bind(this);

    this._content = DomHelper.CreateElement('div', ['content-wrapper']);
    this._background = DomHelper.CreateElement('div', ['project-background']);
    this._overlay = DomHelper.CreateElement('div', ['overlay']);
    this._content.appendChild(this._background);
    this._content.appendChild(this._overlay);
    this._background.appendChild(ProjectPage.CreateHeader());
    this._background.appendChild(this.CreateFooter());

    this._content.appendChild(this.CreateAddProjectModal());
  }

  static CreateHeader() {
    const header = DomHelper.CreateElement('div', ['project-header']);

    const logo = DomHelper.CreateElement('img', ['project-logo']);
    logo.src = LogoImg;

    const title = DomHelper.CreateElement('h1', ['project-title']);
    title.innerText = 'TASKY';

    header.appendChild(logo);
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

  DisplayModal() {
    this._footerModalWrapper.style.display = 'flex';
    this._addProjectModal.querySelector('.project-modal-text-input').focus();
    this._overlay.classList.add('blur-overlay');

    this._background.querySelector('.project-add').style.display = 'none';
  }

  HideModal() {
    this._footerModalWrapper.style.display = 'none';
    this.ResetProjectModal();

    this._overlay.classList.remove('blur-overlay');
    this._background.querySelector('.project-add').style.display = 'block';
  }

  AddProject(evt) {
    evt.preventDefault();
    this._taskManager.AddProject(this.GetProjectModalInput());

    const projects = this._background.querySelector('.project-wrapper');
    this._background.removeChild(projects);

    this.SetProjects(
      this._taskManager.GetProjectNames(),
      this._taskManager.GetProjectIds(),
      this._taskManager.GetProjectTaskNumbers()
    );

    this.HideModal();
  }

  SelectProject(evt) {
    let { target } = evt;
    while (!target.classList.contains('project-div')) {
      target = target.parentElement;
    }

    this._taskDom.SelectProject(Number(target.dataset.projectId));
  }

  CreateAddProjectModal() {
    this._footerModalWrapper = DomHelper.CreateElement('div', [
      'project-footer-modal-wrapper',
    ]);

    this._addProjectModal = DomHelper.CreateElement('div', ['project-modal']);

    this._addProjectForm = DomHelper.CreateElement('form');

    const projectNameInput = DomHelper.CreateElement('input', [
      'project-modal-text-input',
    ]);
    projectNameInput.required = true;
    projectNameInput.type = 'text';
    projectNameInput.placeholder = 'New Project...';
    projectNameInput.maxLength = 30;
    this._addProjectForm.appendChild(projectNameInput);

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
    addButton.type = 'submit';
    cancelButton.innerText = 'CANCEL';
    cancelButton.type = 'button';

    this._addProjectForm.addEventListener('submit', this.AddProject);
    cancelButton.addEventListener('click', this.HideModal);

    buttonWrapper.appendChild(cancelButton);
    buttonWrapper.appendChild(addButton);

    this._addProjectForm.appendChild(buttonWrapper);

    this._addProjectModal.appendChild(this._addProjectForm);
    this._footerModalWrapper.appendChild(this._addProjectModal);

    return this._footerModalWrapper;
  }

  ResetProjectModal() {
    const text = this._addProjectModal.querySelector(
      '.project-modal-text-input'
    );
    text.value = '';
  }

  GetProjectModalInput() {
    return this._addProjectModal.querySelector('.project-modal-text-input')
      .value;
  }

  GetContent() {
    return this._content;
  }

  SetProjects(projectNames, projectIds, projectTaskNum) {
    this._projectNames = projectNames;
    this._projectIds = projectIds;

    let projectWrapper = this._background.querySelector('.project-wrapper');

    if (projectWrapper !== undefined && projectWrapper !== null) {
      this._background.removeChild(projectWrapper);
    }

    projectWrapper = DomHelper.CreateElement('div', ['project-wrapper']);
    for (let i = 0; i < projectNames.length; i++) {
      projectWrapper.appendChild(
        this.CreateProject(projectNames[i], projectIds[i], projectTaskNum[i])
      );
    }

    this._background.appendChild(projectWrapper);
  }

  CreateProject(projectName, projectId, projectNumTasks) {
    const projectDiv = DomHelper.CreateElement('div', ['project-div']);
    projectDiv.dataset.projectId = projectId;

    const title = projectDiv.appendChild(
      DomHelper.CreateElement('div', ['project-individual-title'])
    );
    title.innerText = projectName;
    const numTasks = projectDiv.appendChild(
      DomHelper.CreateElement('div', ['project-individual-num-tasks'])
    );
    if (projectNumTasks !== 1) {
      numTasks.innerText = `${projectNumTasks} Tasks`;
    } else {
      numTasks.innerText = `${projectNumTasks} Task`;
    }

    projectDiv.addEventListener('click', this.SelectProject);

    return projectDiv;
  }
}
