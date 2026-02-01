import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './configs/db.config.js'
import adminRouter from './routes/admin.routes.js'
import blogRouter from './routes/blog.routes.js'
import subscriptionRouter from './routes/subscription.routes.js'


const app = express()

//Database - connect in background, don't block route registration
await connectDB().catch(err => {
    console.error('Database connection error:', err.message); 
});

//Middlewares
app.use(cors())
app.use(express.json())

//Routes
app.get('/', (req, res)=> res.send("API is working"))
// Admin routes
app.use('/admin', adminRouter) 
app.use('/blog', blogRouter)
app.use('/subscription', subscriptionRouter) 

const PORT = Number(process.env.PORT) || 3001;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})

export default app; 