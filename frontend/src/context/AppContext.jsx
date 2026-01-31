import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from "react-hot-toast";
import { io } from 'socket.io-client';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const navigate = useNavigate();

    const [token, setToken] = useState(null)
    const [blogs, setBlogs] = useState([])
    const [input, setInput] = useState("");
    const socketRef = useRef(null);

    const fetchBlogs = async () => {
        try {
            const { data } = await axios.get('/blog/all')
            if (data.success) {
                setBlogs(Array.isArray(data.blogs) ? data.blogs : [])
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Single Socket.IO connection for the whole app (avoids duplicate connections and "closed before established")
    useEffect(() => {
        const backendURL = import.meta.env.VITE_BASE_URL || 'http://localhost:3001';
        // Strip trailing slash and ensure we have a clean URL for socket
        const baseURL = backendURL.replace(/\/$/, '');
        const socket = io(baseURL, {
            transports: ['polling', 'websocket'], // polling first often more reliable, then upgrade
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            timeout: 10000,
        });
        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Socket connected');
        });

        socket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
        });

        socket.on('connect_error', (err) => {
            console.warn('Socket connect_error:', err.message);
        });

        // Listen for new blog – show toast for anyone on the site
        socket.on('newBlog', (blogData) => {
            setBlogs(prev => {
                const exists = prev.some(b => b._id === blogData.id);
                if (!exists && blogData.id) {
                    return [{ _id: blogData.id, title: blogData.title, subTitle: blogData.subTitle, category: blogData.category, image: blogData.image, createdAt: blogData.createdAt }, ...prev];
                }
                return prev;
            });
            toast.success(
                (t) => (
                    <div className="flex flex-col">
                        <span className="font-semibold">New Blog Posted! 🎉</span>
                        <span className="text-sm">{blogData.title}</span>
                    </div>
                ),
                { duration: 5000, icon: '📝' }
            );
        });

        return () => {
            socket.removeAllListeners();
            socket.disconnect();
            socketRef.current = null;
        };
    }, []);

    useEffect(() => {
        fetchBlogs();
        const token = localStorage.getItem('token');
        if (token) {
            setToken(token)
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }
    }, [])

    const value = { axios, navigate, token, setToken, blogs, setBlogs, input, setInput, socket: socketRef.current }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    return useContext(AppContext)
}