import { randomUUID as uuid } from 'node:crypto';
import { Database } from './database.js';
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handle: (req, res) => {
      const { search } = req.query;

      const tasks = database.select('tasks', search ? {
        title: search,
        description: search
      }: null);

      return res.end(JSON.stringify(tasks));
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handle: (req, res) => {
      const { title, description } = req.body;

      const task = {
        id: uuid(),
        title,
        description,
        created_at: new Date(),
        updated_at: null,
        completed_at: null,
      }

      database.insert('tasks', task);

      return res.writeHead(201).end();
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handle: (req, res) => {
      const { id } = req.params;

      const [task] = database.select('tasks', { id });

      if (!task) return res.writeHead(404).end();

      database.delete('tasks', id);

      return res.writeHead(204).end();
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handle: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      const [task] = database.select('tasks', { id });

      if (!task) return res.writeHead(404).end();

      database.update('tasks', id, {
        title: title || task.title,
        description: description || task.description,
        created_at: task.created_at,
        updated_at: task.updated_at = new Date(),
        completed_at: task.completed_at
      });

      return res.writeHead(204).end();
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/completed'),
    handle: (req, res) => {
      const { id } = req.params;

      const [task] = database.select('tasks', { id });

      if (!task) return res.writeHead(404).end();

      database.update('tasks', id, {
        title: task.title,
        description: task.description,
        created_at: task.created_at,
        updated_at: new Date(),
        completed_at: new Date()
      });

      return res.writeHead(204).end();
    }
  },
]