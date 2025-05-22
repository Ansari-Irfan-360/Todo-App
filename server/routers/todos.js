const express = require('express');
const router = express.Router();
const db = require('../utils/db');

router.get('/', async (req, res) => {
  const result = await db.query('SELECT * FROM todos');
  res.json(result.rows);
});

router.post('/create', async (req, res) => {
  const { todo } = req.body;
  const result = await db.query('INSERT INTO todos (todo) VALUES ($1) RETURNING *', [todo]);
  res.json(result.rows[0]);
});

router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { todo } = req.body;
  const result = await db.query('UPDATE todos SET todo = $1 WHERE id = $2 RETURNING *', [todo, id]);
  res.json(result.rows[0]);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await db.query('DELETE FROM todos WHERE id = $1', [id]);
  res.sendStatus(204);
});

module.exports = router;
