import nodemailer from 'nodemailer'

export const emailRegister = async (data) => {
  const { email, name, token } = data

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  })

  const info = await transport.sendMail({
    from: '"Project Managment" <account@pm.com>',
    to: email,
    subject: "Confirma tu cuenta en Project Managment",
    text: "Confirma tu cuenta en Project Managment",
    html: `
      <div>
        <h1>Hola ${name}, comprueba tu cuenta para continuar!</h1>
        <p>Confirma tu cuenta en Project Managment haciendo click en el siguiente enlace</p>
        <p>Si tu no create esta cuenta, puedes ignorar el correo</p>
        <a href="${process.env.FRONTEND_URL}/confirm-account/${token}">Confirmar cuenta</a>
      </div>
    `
  })
}

export const emailForgetPassword = async (data) => {
  const { email, name, token } = data

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  })

  const info = await transport.sendMail({
    from: '"Project Managment" <account@pm.com>',
    to: email,
    subject: "Reestablece tu contraseña en Project Managment",
    text: "Reestablece tu contraseña en Project Managment",
    html: `
      <div>
        <h1>Hola ${name}, comprueba que eres tu el que solicita cambiar la contraseña!</h1>
        <p>Solo tienes que darle click al boton y Project Managment te llevará a cambiar tu nuevo password</p>
        <p>Si tu no solicitaste esta petición, contacta con soporte o cambia tus credenciales</p>
        <a href="${process.env.FRONTEND_URL}/fotget-password/${token}">Reestablecer contraseña</a>
      </div>
    `
  })
}