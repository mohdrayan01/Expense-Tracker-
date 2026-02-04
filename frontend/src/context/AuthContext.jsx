import { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                try {
                    const data = await authService.getMe();
                    setUser(data.user);
                } catch (error) {
                    localStorage.removeItem('token');
                    setToken(null);
                }
            }
            setLoading(false);
        };
        loadUser();
    }, [token]);

    const login = async (credentials) => {
        try {
            const data = await authService.login(credentials);
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setUser(data.user);
            toast.success('Welcome back!');
            return data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
            throw error;
        }
    };

    const signup = async (userData) => {
        try {
            const data = await authService.signup(userData);
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setUser(data.user);
            toast.success('Account created successfully!');
            return data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Signup failed');
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        toast.success('Logged out successfully');
    };

    const updateUser = async (userData) => {
        try {
            const data = await authService.updateProfile(userData);
            setUser(data.user);
            toast.success('Profile updated successfully');
            return data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Update failed');
            throw error;
        }
    };

    const value = {
        user,
        loading,
        token,
        login,
        signup,
        logout,
        updateUser,
        isAuthenticated: !!user
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
