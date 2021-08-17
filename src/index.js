/* eslint-disable no-console */
import './styles/reset.css';
import './styles/fonts.css';
import './styles/styles.css';

import { add } from 'date-fns';

import { Task, TaskManager } from './task';
import { TaskDom } from './taskDom';

const taskManager = new TaskManager();

const p1 = taskManager.AddProject('Home');
const p2 = taskManager.AddProject('Work');
/* const p3 = new Project('Home');
const p4 = new Project('Work');
const p5 = new Project('Home');
const p6 = new Project('Work');
const p7 = new Project('Home');
const p8 = new Project('Work'); */

const t1 = new Task();
t1.CreateTask(
  'Go Shopping',
  p1.projectId,
  'Do weekly grocery shopping',
  add(Date.now(), { weeks: 1 }),
  0
);

const t2 = new Task();
t2.CreateTask(
  'Vacuum',
  p1.projectId,
  'Vacuum the house',
  add(Date.now(), { days: 2 }),
  1
);

const t3 = new Task();
t3.CreateTask(
  'Create Project',
  p2.projectId,
  'Create a project at work',
  add(Date.now(), { weeks: 2 }),
  1
);

const t4 = new Task();
t4.CreateTask(
  'Defrag hdd',
  p2.projectId,
  '',
  add(Date.now(), { months: 1 }),
  0
);

const t5 = new Task();
t5.CreateTask(
  'Send Email',
  p2.projectId,
  'Send emails to people',
  add(Date.now(), { days: 4 }),
  2
);

/* taskManager.AddProject(p3);
taskManager.AddProject(p4);
taskManager.AddProject(p5);
taskManager.AddProject(p6);
taskManager.AddProject(p7);
taskManager.AddProject(p8); */
taskManager.AddTask(t1);
taskManager.AddTask(t2);
taskManager.AddTask(t3);
taskManager.AddTask(t4);
taskManager.AddTask(t5);

let ts = taskManager.GetAllTasks();
for (let i = 0; i < ts.length; i++) {
  console.log(ts[i].info);
}

console.log('By Priority');
ts = taskManager.GetTasksByPriority();
for (let i = 0; i < ts.length; i++) {
  console.log(ts[i].info);
}

console.log('By Due Date');
ts = taskManager.GetTasksByDueDate();
for (let i = 0; i < ts.length; i++) {
  console.log(ts[i].info);
}

console.log('By Creation Date');
ts = taskManager.GetTasksByCreationDate();
for (let i = 0; i < ts.length; i++) {
  console.log(ts[i].info);
}

console.log('By Project 1');
ts = taskManager.GetTasksByProject(1);
for (let i = 0; i < ts.length; i++) {
  console.log(ts[i].info);
}

console.log('By Project 2');
ts = taskManager.GetTasksByProject(2);
for (let i = 0; i < ts.length; i++) {
  console.log(ts[i].info);
}

console.log('By Priority Project 2');
ts = taskManager.GetTasksByPriority(2);
for (let i = 0; i < ts.length; i++) {
  console.log(ts[i].info);
}

const taskDom = new TaskDom(taskManager);
