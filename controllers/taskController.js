import Project from '../models/Project.js'
import Task from '../models/Task.js'

const addTask = async (req, res) => {
  const { project } = req.body
  const projectExists = await Project.findById(project)

  if (!projectExists) {
    const error = new Error('Proyecto no encontrado')
    return res.status(404).json({ message: error.message })
  }
  if (projectExists.owner.toString() !== req.user._id.toString()) {
    const error = new Error('No tienes permiso para realizar esta acción')
    return res.status(403).json({ message: error.message })
  }
  try {
    const taskSaved = await Task.create(req.body)
    projectExists.tasks.push(taskSaved._id)
    await projectExists.save()
    res.status(201).json(taskSaved)
  } catch (err) {
    console.log(err)
  }
}

const getTask = async (req, res) => {
  const { id } = req.params
  const task = await Task.findById(id).populate('project')

  if (!task) {
    const error = new Error('Tarea no encontrada')
    return res.status(404).json({ message: error.message })
  }
  if (task.project.owner.toString() !== req.user._id.toString()) {
    const error = new Error('No tienes permiso para realizar esta acción')
    return res.status(403).json({ message: error.message })
  }
  res.status(200).json(task)
}

const updateTask = async (req, res) => {
  const { id } = req.params
  const task = await Task.findById(id).populate('project')

  if (!task) {
    const error = new Error('Tarea no encontrada')
    return res.status(404).json({ message: error.message })
  }
  if (task.project.owner.toString() !== req.user._id.toString()) {
    const error = new Error('No tienes permiso para realizar esta acción')
    return res.status(403).json({ message: error.message })
  }
  task.name = req.body.name || task.name
  task.description = req.body.description || task.description
  task.finallyDate = req.body.finallyDate || task.finallyDate
  task.priority = req.body.priority || task.priority
  try {
    const taskSaved = await task.save()
    res.status(200).json(taskSaved)
  } catch (err) {
    console.log(err)
  }
}

const deleteTask = async (req, res) => {
  const { id } = req.params
  const task = await Task.findById(id).populate('project')
  
  if (!task) {
    const error = new Error('Tarea no encontrada')
    return res.status(404).json({ message: error.message })
  }
  if (task.project.owner.toString() !== req.user._id.toString()) {
    const error = new Error('No tienes permiso para realizar esta acción')
    return res.status(403).json({ message: error.message })
  }
  try {
    const project = await Project.findById(task.project)
    project.tasks.pull(task._id)
    await Promise.all([project.save(), task.deleteOne()])
    
    res.status(201).json({ message: 'La tarea se eliminó correctamente' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}

const changeStatus = async (req, res) => {
  const { id } = req.params
  const task = await Task.findById(id).populate('project')

  if (!task) {
    const error = new Error('Tarea no encontrada')
    return res.status(404).json({ error: error.message })
  }
  if (task.project.owner.toString() !== req.user._id.toString() &&
  !task.project.partners.some(partner => partner.toString() === req.user._id.toString()))
  {
    const error = new Error('No tienes permiso para realizar esta acción')
    return res.status(403).json({ message: error.message })
  }
  try {
    task.status = !task.status
    task.completed = req.user._id
    await task.save()
    const savedTask = await Task.findById(id).populate('project').populate('completed')
    res.json(savedTask)
  } catch (err) {
    console.log(err)
  }
}

export {
  addTask,
  getTask,
  updateTask,
  deleteTask,
  changeStatus
}