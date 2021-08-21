/* eslint-disable import/prefer-default-export */
import { format } from 'date-fns';

export class Task {
  static id = 0;

  static getNewId() {
    this.id += 1;
    return this.id;
  }

  static SetHighestId(highId) {
    this.id = highId;
  }

  constructor() {
    this.taskName = '';
    this.projectId = '';
    this.taskDescription = '';
    this.taskPriority = '';
    this.taskId = -1;
    this.taskComplete = false;

    this.taskCreationDate = null;
    this.taskDueDate = null;
    this.taskCompletionDate = null;
  }

  // CreateTask
  CreateTask(name, projectId, description, dueDate, priority) {
    this.taskName = name;
    this.projectId = projectId;
    this.taskDescription = description;
    this.taskDueDate = new Date(dueDate);
    this.taskPriority = priority;

    this.taskCreationDate = Date.now();

    this.taskId = Task.getNewId();
  }

  // Complete Task
  SetCompletionStatus(comp) {
    if (comp) {
      this.taskCompletionDate = Date.now();
      this.taskComplete = true;
    } else {
      this.taskCompletionDate = null;
      this.taskComplete = false;
    }
  }

  ToggleCompletionStatus() {
    this.SetCompletionStatus(!this.taskComplete);
    return this.taskComplete;
  }

  SetCompletionDate(date) {
    this.taskCompletionDate = date;
  }

  SetTaskId(id) {
    this.taskId = id;
  }

  SetCreationDate(date) {
    this.taskCreationDate = new Date(date);
  }

  SetTaskName(name) {
    this.taskName = name;
  }

  SetTaskDueDate(dueDate) {
    this.taskDueDate = dueDate;
  }

  SetTaskDescription(description) {
    this.taskDescription = description;
  }

  SetTaskPriority(priority) {
    this.taskPriority = priority;
  }

  get info() {
    return `Task: ${this.taskName}, Project: ${this.projectId}, Description: ${
      this.taskDescription
    }, Creation Date: ${format(
      this.taskCreationDate,
      'MMMM do y'
    )}, Due Date: ${format(this.taskDueDate, 'MMMM do y')}, Priority: ${
      this.taskPriority
    }, Complete: ${this.taskComplete}`;
  }

  get id() {
    return this.taskId;
  }

  get name() {
    return this.taskName;
  }

  get description() {
    return this.taskDescription;
  }

  get priority() {
    return this.taskPriority;
  }

  get completionStatus() {
    return this.taskComplete;
  }

  get creationDate() {
    return this.taskCreationDate;
  }

  get dueDate() {
    return this.taskDueDate;
  }

  get completionDate() {
    return this.taskCompletionDate;
  }

  // Change Priority
  // Set DueDate
  // Change Project
}
