import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const TOKEN_KEY = 'lf_token';
const USER_KEY = 'lf_user';

export function AuthProvider({ children }) {
	const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
	const [user, setUser] = useState(() => {
		const raw = localStorage.getItem(USER_KEY);
		try {
			return raw ? JSON.parse(raw) : null;
		} catch {
			return null;
		}
	});
	const [loading, setLoading] = useState(true);

	const persistSession = (nextToken, nextUser) => {
		setToken(nextToken);
		setUser(nextUser);
		localStorage.setItem(TOKEN_KEY, nextToken);
		localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
	};

	const clearSession = () => {
		setToken('');
		setUser(null);
		localStorage.removeItem(TOKEN_KEY);
		localStorage.removeItem(USER_KEY);
	};

	useEffect(() => {
		const validateSession = async () => {
			if (!token) {
				setLoading(false);
				return;
			}

			// Backward compatibility for old login responses that don't include JWT yet.
			if (token.startsWith('legacy_')) {
				setLoading(false);
				return;
			}

			try {
				const { data } = await axios.get('http://localhost:5000/Users/session', {
					headers: { Authorization: `Bearer ${token}` },
				});

				persistSession(token, data.user);
			} catch {
				clearSession();
			} finally {
				setLoading(false);
			}
		};

		validateSession();
	}, []);

	const value = useMemo(
		() => ({
			token,
			user,
			loading,
			isAuthenticated: Boolean(token && user),
			login: persistSession,
			logout: clearSession,
		}),
		[token, user, loading]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within AuthProvider');
	}
	return context;
}
