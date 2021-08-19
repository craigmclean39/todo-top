/* eslint-disable no-console */
import './styles/reset.css';
import './styles/fonts.css';
import './styles/styles.css';

import { TaskManager } from './taskManager';
import { TaskDom } from './taskDom';

const taskManager = new TaskManager();

/* const p1 = taskManager.AddProject('Home');
const p2 = taskManager.AddProject('Work');

taskManager.AddTask(
  'Go Shopping',
  'Do weekly grocery shopping',
  p1.projectId,
  add(Date.now(), { weeks: 1 }),
  0
);

taskManager.AddTask(
  'Vacuum',
  'Vacuum the house.',
  p1.projectId,
  add(Date.now(), { weeks: 2 }),
  1
);

taskManager.AddTask(
  'Check Emails',
  'Check and reply to all emails',
  p2.projectId,
  add(Date.now(), { days: 1 }),
  1
);

taskManager.AddTask(
  'Defrag HDD',
  'Defrag my hard drives',
  p2.projectId,
  add(Date.now(), { weeks: 3 }),
  0
);

taskManager.AddTask(
  'Complete Deliverables',
  'Complete my weekly deliverables',
  p2.projectId,
  add(Date.now(), { days: 3 }),
  2
); */

// eslint-disable-next-line no-unused-vars
const taskDom = new TaskDom(taskManager);
