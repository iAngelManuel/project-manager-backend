import mongoose from "mongoose"

const projectsSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  finallyDate: {
    type: Date,
    default: Date.now(),
    required: true
  },
  client: {
    type: String,
    required: true,
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task"
    }
  ],
  partners: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]
}, {
  timestamps: true
})
const Project = mongoose.model('Project', projectsSchema)
export default Project