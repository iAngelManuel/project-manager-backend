import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db.js"
import UserRoutes from "./routes/UserRoutes.js"
import ProjectRoutes from "./routes/ProjectRoutes.js"
import TaskRoutes from "./routes/TaskRoutes.js"

const app = express()
app.use(express.json())
dotenv.config()
connectDB()

const whitelist = [process.env.FRONTEND_URL]
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(cors(corsOptions))

app.use("/api/users", UserRoutes)
app.use("/api/projects", ProjectRoutes)
app.use("/api/tasks", TaskRoutes)

const PORT = 4000 || process.env.PORT
const server = app.listen(PORT, () => {
  console.log("Server is running on port", PORT)
})

// Socket.io
import { Server } from 'socket.io'

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_URL
  }
})

io.on('connection', socket => {
  console.log('New connection')

  socket.on('open-project', id => {
    socket.join(id)
  })

  socket.on('new-task', data => {
    const project = data.project
    socket.to(project).emit('task-send', data)
  })

  socket.on('delete-task', task => {
    const project = task.project
    socket.to(project).emit('task-deleted', task)
  })

  socket.on('update-task', task => {
    const project = task.project._id
    socket.to(project).emit('task-updated', task)
  })

  socket.on('change-status', task => {
    const project = task.project._id
    socket.to(project).emit('status-changed', task)
  })
})
