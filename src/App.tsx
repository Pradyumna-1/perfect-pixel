import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';

import Layout from './components/Layout';
import Home from './pages/Home';

import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Admin from './pages/Admin';

import { AuthProvider, useAuth } from './context/AuthContext';
import { GalleryProvider } from './context/GalleryContext';


// --------------------------------------------------
// Protected Route
// --------------------------------------------------

const ProtectedRoute = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const { isAuthenticated, loading } = useAuth();

    // Still checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-primary text-white">
                Verifying...
            </div>
        );
    }

    // Not logged in → Login page
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Logged in → Admin page
    return <>{children}</>;
};


// --------------------------------------------------
// App
// --------------------------------------------------

function App() {
    return (
        <AuthProvider>
            <GalleryProvider>

                <Router>

                    <Routes>

                        {/* =========================================
                            AUTH ROUTES
                           ========================================= */}

                        <Route
                            path="/login"
                            element={<Login />}
                        />

                        <Route
                            path="/forgot-password"
                            element={<ForgotPassword />}
                        />

                        <Route
                            path="/reset-password/:token"
                            element={<ResetPassword />}
                        />


                        {/* =========================================
                            ADMIN ROUTE
                           ========================================= */}

                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute>
                                    <Admin />
                                </ProtectedRoute>
                            }
                        />


                        {/* =========================================
                            MAIN WEBSITE

                            All these routes render Home.

                            Home contains:
                            - Hero
                            - Services
                            - Gallery
                            - Contact

                            Home.tsx handles scrolling to the
                            appropriate section.
                           ========================================= */}

                        <Route
                            path="/"
                            element={
                                <Layout>
                                    <Home />
                                </Layout>
                            }
                        />

                        <Route
                            path="/services"
                            element={
                                <Layout>
                                    <Home />
                                </Layout>
                            }
                        />

                        <Route
                            path="/gallery"
                            element={
                                <Layout>
                                    <Home />
                                </Layout>
                            }
                        />

                        <Route
                            path="/contact"
                            element={
                                <Layout>
                                    <Home />
                                </Layout>
                            }
                        />


                        {/* =========================================
                            UNKNOWN ROUTES

                            Example:
                            /abc
                            /something
                            /random-page

                            → Go back to Home
                           ========================================= */}

                        <Route
                            path="*"
                            element={
                                <Navigate
                                    to="/"
                                    replace
                                />
                            }
                        />

                    </Routes>

                </Router>

            </GalleryProvider>
        </AuthProvider>
    );
}

export default App;