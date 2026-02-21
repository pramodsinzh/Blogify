import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const navigate = useNavigate();

    const [token, setToken] = useState(null)
    // AppContext.jsx
    const [blogs, setBlogs] = useState(null) // ✅ null = still fetching
    const [input, setInput] = useState("");

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

    useEffect(() => {
        fetchBlogs();
        const token = localStorage.getItem('token');
        if (token) {
            setToken(token)
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }
    }, [])

    const value = { axios, navigate, token, setToken, blogs, setBlogs, input, setInput }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    return useContext(AppContext)
}