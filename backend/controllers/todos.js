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
      await Todo.findOneAndUpdate({ _id: req.body.todoIdFromJSFile }, { completed: true })
      res.json('Marked Complete')
    } catch (err) {
      console.log(err)
    }
  },
  markIncomplete: async (req, res) => {
    try {
      await Todo.findOneAndUpdate({ _id: req.body.todoIdFromJSFile }, { completed: false })
      res.json('Marked Incomplete')
    } catch (err) {
      console.log(err)
    }
  },
  deleteTodo: async (req, res) => {
    try {
      await Todo.findOneAndDelete({ _id: req.body.todoIdFromJSFile })
      res.json('Deleted It')
    } catch (err) {
      console.log(err)
    }
  },
}
