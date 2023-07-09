import User from '../models/User.js'
import Project from '../models/Project.js'
import Task from '../models/Task.js'

const getProjects = async (req, res) => {
  const project = await Project.find({
    '$or': [
      { 'partners': { '$in': req.user } },
      { 'owner': { '$in': req.user } }
    ]
  }).select('-tasks')
  res.json(project)
}

const createProject = async (req, res) => {
  const project = new Project(req.body)
  project.owner = req.user._id

  try {
    const projectSaved = await project.save()
    res.status(201).json(projectSaved)
  } catch (err) {
    console.log(err)
  }
}

const getProject = async (req, res) => {
  const { id } = req.params
  const project = await Project.findById(id)
  .populate({ path: 'tasks', populate: { path: 'completed' } })
  .populate('partners', 'name email')

  if (!project) {
    const error = new Error('No se encontró el proyecto')
    return res.status(404).json({ message: error.message })
  }
  if (project.owner.toString() !== req.user._id.toString() &&
   !project.partners.some(partner => partner._id.toString() === req.user._id.toString()))
   {
    const error = new Error('Acción no válida')
    return res.status(401).json({ message: error.message })
  }
  return res.status(200).json(project)
}

const updateProject = async (req, res) => {
  const { id } = req.params
  const project = await Project.findById(id)

  if (!project) {
    const error = new Error('No se encontró el proyecto')
    return res.status(404).json({ message: error.message })
  }
  if (project.owner.toString() !== req.user._id.toString()) {
    const error = new Error('Acción no válida')
    return res.status(401).json({ message: error.message })
  }
  project.name = req.body.name || project.name
  project.description = req.body.description || project.description
  project.finallyDate = req.body.finallyDate || project.finallyDate
  project.client = req.body.client || project.client
  try {
    const projectSaved = await project.save()
    res.status(201).json(projectSaved)
  } catch (err) {
    console.log(err)
  }
}

const deleteProject = async (req, res) => {
  const { id } = req.params
  const project = await Project.findById(id)

  if (!project) {
    const error = new Error('No se encontró el proyecto')
    return res.status(404).json({ message: error.message })
  }
  if (project.owner.toString() !== req.user._id.toString()) {
    const error = new Error('Acción no válida')
    return res.status(401).json({ message: error.message })
  }
  try {
    await project.deleteOne()
    res.status(201).json({ message: 'Proyecto eliminado' })
  } catch (err) {
    console.log(err)
  }
}

const searchPartners = async (req, res) => {
  const { email } = req.body
  const user = await User.findOne({ email }).select('-password -projects -tasks -__v -createdAt -updatedAt -status -token -confirmed')
  if (!user) {
    const error = new Error('No se encontró el usuario')
    return res.status(404).json({ message: error.message })
  }
  return res.status(200).json(user)
}

const addPartner = async (req, res) => {
  const project = await Project.findById(req.params.id)
  console.log(req.params.id)

  if (!project) {
    const error = new Error('No se encontró el proyecto')
    return res.status(404).json({ message: error.message })
  }
  if (project.owner.toString() !== req.user._id.toString()) {
    const error = new Error('Acción no válida')
    return res.status(401).json({ message: error.message })
  }

  const { email } = req.body
  const user = await User.findOne({ email }).select('-password -projects -tasks -__v -createdAt -updatedAt -status -token -confirmed')

  if (!user) {
    const error = new Error('No se encontró el usuario')
    return res.status(404).json({ message: error.message })
  }
  if (project.owner.toString() === user._id.toString()) {
    const error = new Error('No puedes agregarte como socio')
    return res.status(401).json({ message: error.message })
  }
  if (project.partners.includes(user._id)) {
    const error = new Error('El usuario ya es socio')
    return res.status(401).json({ message: error.message })
  }
  try {
    project.partners.push(user._id)
    await project.save()
  } catch (err) {
    console.log(err)
  }
  return res.status(200).json({ message: 'Colaborador agregado correctamente' })
}

const removePartner = async (req, res) => {
  const project = await Project.findById(req.params.id)
  console.log(req.params.id)

  if (!project) {
    const error = new Error('No se encontró el proyecto')
    return res.status(404).json({ message: error.message })
  }
  if (project.owner.toString() !== req.user._id.toString()) {
    const error = new Error('Acción no válida')
    return res.status(401).json({ message: error.message })
  }

  project.partners.pull(req.body.id)
  await project.save()
  return res.status(200).json({ message: 'Colaborador eliminado correctamente' })
}

export {
  getProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
  searchPartners,
  addPartner,
  removePartner
}
