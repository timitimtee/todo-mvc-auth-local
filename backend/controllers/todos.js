const Todo = require('../models/Todo')

module.exports = {
  getTodos: async (req, res) => {
    try {
      const todoItems = await Todo.find({ userId: req.user.id })
      const itemsLeft = await Todo.countDocuments({ userId: req.user.id, completed: false })
      res.json({ todos: todoItems, left: itemsLeft, user: req.user })
    } catch (err) {
      console.log(err)
    }
  },
  createTodo: async (req, res) => {
    try {
      await Todo.create({ todo: req.body.todoItem, completed: false, userId: req.user.id })
      res.json({ success: true })
    } catch (err) {
      console.log(err)
    }
  },
  markComplete: async (req, res) => {
    try {
      // Scope by userId so a user can only mutate their OWN todo (prevents IDOR).
      const updated = await Todo.findOneAndUpdate({ _id: req.body.todoIdFromJSFile, userId: req.user.id }, { completed: true })
      if (!updated) return res.status(404).json({ error: 'Not found' })
      res.json('Marked Complete')
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Server error' })
    }
  },
  markIncomplete: async (req, res) => {
    try {
      const updated = await Todo.findOneAndUpdate({ _id: req.body.todoIdFromJSFile, userId: req.user.id }, { completed: false })
      if (!updated) return res.status(404).json({ error: 'Not found' })
      res.json('Marked Incomplete')
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Server error' })
    }
  },
  deleteTodo: async (req, res) => {
    try {
      const deleted = await Todo.findOneAndDelete({ _id: req.body.todoIdFromJSFile, userId: req.user.id })
      if (!deleted) return res.status(404).json({ error: 'Not found' })
      res.json('Deleted It')
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Server error' })
    }
  },
}
