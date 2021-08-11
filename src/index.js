import './styles/reset.css';
import './styles/fonts.css';
import './styles/styles.css';

import { Task, Project, TaskManager } from "./task";
import { TaskDom, ProjectPage, TaskPage } from "./taskDom";

import { add } from 'date-fns'


let taskManager = new TaskManager();

let p1 = new Project("Home");
let p2 = new Project("Work");

let t1 = new Task();
t1.CreateTask("Go Shopping", p1.projectId, "Do weekly grocery shopping", add(Date.now(), {weeks: 1}), 0);

let t2 = new Task();
t2.CreateTask("Vacuum", p1.projectId, "Vacuum the house", add(Date.now(), {days: 2}), 1);

let t3 = new Task();
t3.CreateTask("Create Project", p2.projectId, "Create a project at work", add(Date.now(), {weeks: 2}), 1);

let t4 = new Task();
t4.CreateTask("Defrag hdd", p2.projectId, "", add(Date.now(), {months: 1}), 0);

let t5 = new Task();
t5.CreateTask("Send Email", p2.projectId, "Send emails to people", add(Date.now(), {days: 4}), 2);

taskManager.AddProject(p1);
taskManager.AddProject(p2);
taskManager.AddTask(t1);
taskManager.AddTask(t2);
taskManager.AddTask(t3);
taskManager.AddTask(t4);
taskManager.AddTask(t5);

let ts = taskManager.GetAllTasks();
for(let i = 0; i < ts.length; i++)
{
    console.log(ts[i].info);
}

console.log("By Priority");
ts = taskManager.GetTasksByPriority();
for(let i = 0; i < ts.length; i++)
{
    console.log(ts[i].info);
}

console.log("By Due Date");
ts = taskManager.GetTasksByDueDate();
for(let i = 0; i < ts.length; i++)
{
    console.log(ts[i].info);
}

console.log("By Creation Date");
ts = taskManager.GetTasksByCreationDate();
for(let i = 0; i < ts.length; i++)
{
    console.log(ts[i].info);
}

console.log("By Project 1");
ts = taskManager.GetTasksByProject(1);
for(let i = 0; i < ts.length; i++)
{
    console.log(ts[i].info);
}

console.log("By Project 2");
ts = taskManager.GetTasksByProject(2);
for(let i = 0; i < ts.length; i++)
{
    console.log(ts[i].info);
}

console.log("By Priority Project 2");
ts = taskManager.GetTasksByPriority(2);
for(let i = 0; i < ts.length; i++)
{
    console.log(ts[i].info);
}


const taskDom = new TaskDom();
const projectPage = new ProjectPage();
const taskPage = new TaskPage();

taskDom.SetPage(projectPage.GetContent());

projectPage.SetProjects(taskManager.GetProjectNames(), taskManager.GetProjectIds());


//taskDom.SetPage(taskPage.GetContent());