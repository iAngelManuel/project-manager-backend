import User from '../models/User.js'
import generateId from '../helpers/generateId.js'
import generateJWT from '../helpers/generateJWT.js'
import { emailRegister, emailForgetPassword } from '../helpers/emails.js'

const register = async (req, res) => {
  const { email } = req.body
  const userAlreadyExists = await User.findOne({ email })

  if (userAlreadyExists) {
    const error = new Error("El usuario ya se encuentra registrado")
    return res.status(400).json({ message: error.message })
  }
  try {
    const user = new User(req.body)
    user.token = generateId()
    await user.save()
    emailRegister({ email: user.email, name: user.name, token: user.token })
    res.json({ message: "Has creado una cuenta correctamente, revisa tu email para confirmar tu cuenta" })
  } catch (err) {
    console.log(err)
  }
}

const login = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (!user) {
    const error = new Error("El usuario no existe")
    return res.status(404).json({ message: error.message })
  }
  if (!user.confirmed) {
    const error = new Error("El usuario no esta confirmado")
    return res.status(401).json({ message: error.message })
  }
  if (await user.comparePassword(password)) {
    res.json({ _id: user._id, name: user.name, email: user.email, token: generateJWT(user._id) })
  } else {
    const error = new Error("La contraseña es incorrecta")
    return res.status(401).json({ message: error.message })
  }
}

const confirm = async (req, res) => {
  const { token } = req.params
  const confirmUser = await User.findOne({ token })
  if (!confirmUser) {
    const error = new Error("El usuario ya esta confirmado o el token no existe")
    return res.status(404).json({ message: error.message })
  }
  try {
    confirmUser.confirmed = true
    confirmUser.token = ''
    await confirmUser.save()
    res.json({ message: "Usuario confirmado correctamente" })
  } catch (err) {
    console.log(err)
  }
}

const forgotPassword = async (req, res) => {
  const { email } = req.body
  const user = await User.findOne({ email })
  
  if (!user) {
    const error = new Error("El usuario no existe")
    return res.status(404).json({ message: error.message })
  }
  try {
    user.token = generateId()
    await user.save()
    emailForgetPassword({ email: user.email, name: user.name, token: user.token })
    res.json({ message: "Se ha enviado un email para que puedas recuperar tu cuenta" })
  } catch (err) {
    console.log(err)
  }
}

const checkToken = async (req, res) => {
  const { token } = req.params
  const validToken = await User.findOne({ token })

  if (validToken) {
    res.json({ message: "El token es válido y el usuario existe" })
  } else {
    const error = new Error("El token no es válido")
    return res.status(404).json({ message: error.message })
  }
}

const newPassword = async (req, res) => {
  const { token } = req.params
  const { password } = req.body
  const user = await User.findOne({ token })

  if (!user) {
    const error = new Error("El usuario no existe")
    return res.status(404).json({ message: error.message })
  }
  try {
    user.password = password
    user.token = ''
    await user.save()
    res.json({ message: "La contraseña se ha cambiado correctamente" })
  } catch (err) {
    console.log(err)
  }
}

const profile = async (req, res) => {
  const { user } = req
  res.json(user)
}

export {
  register,
  login,
  confirm,
  forgotPassword,
  checkToken,
  newPassword,
  profile
}
