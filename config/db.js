import mongoose from "mongoose"

const connectDB = async () => {
  try {
    const conection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    const url = `${conection.connection.host}:${conection.connection.port}`
    console.log(`MongoDB connected: ${url}`)
  } catch (err) {
    console.log(`Error: ${err.message}`)
    process.exit(1)
  }
}
export default connectDB
