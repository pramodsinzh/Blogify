import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './configs/db.config.js'


const app = express()

//Database
await connectDB()

//Middlewares
app.use(cors())
app.use(express.json())

app.get('/', (req, res)=> res.send("API is working"))

const PORT = Number(process.env.PORT) || 3001;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
    console.log(`Access the API at: http://localhost:${PORT}`)
}) 

export default app; 