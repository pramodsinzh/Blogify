import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import connectDB from './configs/db.config.js'
import { setIO } from './configs/socket.config.js'
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

// Create HTTP server
const httpServer = createServer(app)

// Set up Socket.IO with CORS (allow localhost variants to avoid "closed before established")
const allowedOrigins = [
    process.env.FRONTEND_URL || "http://localhost:5173",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174"
].filter(Boolean);
const uniqueOrigins = [...new Set(allowedOrigins)];
const io = new Server(httpServer, {
    cors: {
        origin: uniqueOrigins.length ? uniqueOrigins : true,
        methods: ["GET", "POST"],
        credentials: true
    },
    allowEIO3: true,
    pingTimeout: 60000,
    pingInterval: 25000
})

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id)

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id)
    })
})

// Start server
httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`) 
}) 

export default app; 