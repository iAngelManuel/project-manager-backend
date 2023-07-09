import express from "express"
import checkAuth from "../middleware/checkAuth.js"
import { getProjects, createProject, getProject, updateProject, deleteProject, searchPartners, addPartner, removePartner } from "../controllers/projectController.js"

const router = express.Router()

router.route('/').get(checkAuth, getProjects).post(checkAuth, createProject)
router.route('/:id').get(checkAuth, getProject).put(checkAuth, updateProject).delete(checkAuth, deleteProject)
router.post('/partners', checkAuth, searchPartners)
router.post('/partners/:id', checkAuth, addPartner)
router.post('/delete-partner/:id', checkAuth, removePartner)

export default router
