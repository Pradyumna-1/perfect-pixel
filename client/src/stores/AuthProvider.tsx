import React, { useState } from 'react';
import { AuthContext, type AuthUser } from './auth-store';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(() =>
        localStorage.getItem('token') ? { username: 'admin' } : null
    );
    const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(localStorage.getItem('token')));

    const login = (token: string) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
        setUser({ username: 'admin' });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading: false }}>
            {children}
        </AuthContext.Provider>
    );
};
