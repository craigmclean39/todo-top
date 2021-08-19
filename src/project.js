/* eslint-disable import/prefer-default-export */
export class Project {
  static id = 0;

  static getNewId() {
    this.id += 1;
    return this.id;
  }

  // used when reading projects from local Storage, don't want conflicting ids
  static SetHighestId(highId) {
    this.id = highId;
  }

  constructor(projectName) {
    this.projectName = projectName;
    this.projectId = Project.getNewId();
  }

  get name() {
    return this.projectName;
  }

  get id() {
    return this.projectId;
  }

  get info() {
    return `Project: ${this.projectName} ID: ${this.projectId}`;
  }

  // used when reading projects from localStorage
  SetId(id) {
    this.projectId = id;
  }
}
