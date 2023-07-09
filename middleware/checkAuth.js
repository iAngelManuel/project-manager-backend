import jwt from "jsonwebtoken"
import User from "../models/User.js"

const checkAuth = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.id).select('-password -confirmed -token -createdAt -updatedAt -__v')
      return next()
    } catch (err) {
      const error = new Error('No autorizado, token fallido')
      return res.status(404).json({ message: error.message })
    }
  }
  if (!token) {
    const error = new Error('No autorizado, no hay token')
    return res.status(401).json({ message: error.message })
  }
  next()
}

export default checkAuth