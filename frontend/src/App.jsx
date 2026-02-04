import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Layout
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AddExpense from './pages/AddExpense';
import ExpenseHistory from './pages/ExpenseHistory';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';

import Loader from './components/common/Loader';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <Loader size="lg" className="h-screen" />;
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <Loader size="lg" className="h-screen" />;
    }

    return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

// Main Layout with Navbar
const AppLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen relative bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
            {/* Candy Grid Background */}
            <div className="fixed inset-0 candy-grid pointer-events-none opacity-30 z-0"></div>

            <Navbar onMenuClick={() => setSidebarOpen(true)} />
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="relative z-10 pt-20">
                {children}
            </div>
        </div>
    );
};

function App() {
    return (
        <BrowserRouter>
            <ThemeProvider>
                <AuthProvider>
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 3000,
                            style: {
                                background: '#1e293b',
                                color: '#fff',
                                borderRadius: '12px',
                                padding: '16px'
                            },
                            success: {
                                iconTheme: {
                                    primary: '#10b981',
                                    secondary: '#fff'
                                }
                            },
                            error: {
                                iconTheme: {
                                    primary: '#ef4444',
                                    secondary: '#fff'
                                }
                            }
                        }}
                    />

                    <Routes>
                        {/* Public Routes */}
                        <Route
                            path="/"
                            element={
                                <PublicRoute>
                                    <Landing />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/login"
                            element={
                                <PublicRoute>
                                    <Login />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/signup"
                            element={
                                <PublicRoute>
                                    <Signup />
                                </PublicRoute>
                            }
                        />

                        {/* Protected Routes */}
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <AppLayout>
                                        <Dashboard />
                                    </AppLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/add-expense"
                            element={
                                <ProtectedRoute>
                                    <AppLayout>
                                        <AddExpense />
                                    </AppLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/edit-expense/:id"
                            element={
                                <ProtectedRoute>
                                    <AppLayout>
                                        <AddExpense />
                                    </AppLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/history"
                            element={
                                <ProtectedRoute>
                                    <AppLayout>
                                        <ExpenseHistory />
                                    </AppLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/analytics"
                            element={
                                <ProtectedRoute>
                                    <AppLayout>
                                        <Analytics />
                                    </AppLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <AppLayout>
                                        <Profile />
                                    </AppLayout>
                                </ProtectedRoute>
                            }
                        />

                        {/* Catch all */}
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;
