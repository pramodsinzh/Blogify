import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from "react-hot-toast";
import { useAuth, useUser } from "@clerk/react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const navigate = useNavigate();

    const [isAdmin, setIsadmin] = useState(false)


    const [token, setToken] = useState(null)
    // AppContext.jsx
    const [blogs, setBlogs] = useState(null) // ✅ null = still fetching
    const [input, setInput] = useState("");

    const {user} = useUser()
    const {getToken} = useAuth()
    const location = useLocation()

    const fetchIsAdmin = async()=> {
        try {
            const {data} = await axios.get('/admin/is-admin', {headers: {Authorization: `Bearer ${await getToken()}`}})
            setIsadmin(data.isAdmin)

            if(!data.isAdmin && location.pathname.startsWith('/admin')){
                navigate('/')
                toast.error("You are not authorized to access the admin panel!")
            }
        } catch (error) {
            console.error(error)
        }
    }


    const fetchBlogs = async () => {
        try {
            const { data } = await axios.get('/blog/all')
            if (data.success) {
                const list = Array.isArray(data.blogs) ? data.blogs : []
                const sorted = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                setBlogs(sorted)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(()=> {
        if(user){
            fetchIsAdmin()
        }
    }, [user])

    useEffect(() => {
        fetchBlogs();
        const token = localStorage.getItem('token');
        if (token) {
            setToken(token)
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }
    }, [])

    const value = { axios, navigate, token, setToken, blogs, setBlogs, input, setInput, fetchBlogs, fetchIsAdmin, user, getToken, isAdmin }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    return useContext(AppContext)
}