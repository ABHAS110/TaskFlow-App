import { createContext, useCallback, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

export const AuthContext = createContext(null);

// ── Action Types ─────────────────────────────────────────────
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  CLEAR_USER: 'CLEAR_USER',
  SET_ERROR: 'SET_ERROR',
};

// ── Reducer ──────────────────────────────────────────────────
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case AUTH_ACTIONS.SET_USER:
      return { ...state, user: action.payload, loading: false, error: null };
    case AUTH_ACTIONS.CLEAR_USER:
      return { ...state, user: null, loading: false, error: null };
    case AUTH_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  loading: true,
  error: null,
};

// ── Provider ─────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user from token on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        dispatch({ type: AUTH_ACTIONS.CLEAR_USER });
        return;
      }
      try {
        const { data } = await api.get('/auth/profile');
        dispatch({ type: AUTH_ACTIONS.SET_USER, payload: data.data });
      } catch {
        localStorage.removeItem('authToken');
        localStorage.removeItem('taskflow_user');
        dispatch({ type: AUTH_ACTIONS.CLEAR_USER });
      }
    };

    loadUser();
  }, []);

  // Listen for forced logout from Axios interceptor
  useEffect(() => {
    const handleForcedLogout = () => {
      dispatch({ type: AUTH_ACTIONS.CLEAR_USER });
      window.location.href = '/login';
    };
    window.addEventListener('auth:logout', handleForcedLogout);
    return () => window.removeEventListener('auth:logout', handleForcedLogout);
  }, []);

  // ── Register ──────────────────────────────────────────────
  const register = useCallback(async (name, email, password, confirmPassword) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    try {
      const { data } = await api.post('/auth/register', {
        name,
        email,
        password,
        confirmPassword,
      });
      localStorage.setItem('authToken', data.data.token);
      dispatch({ type: AUTH_ACTIONS.SET_USER, payload: data.data });
      toast.success(`Welcome, ${data.data.name}! 🎉`);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: message });
      return { success: false, message };
    }
  }, []);

  // ── Login ─────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('authToken', data.data.token);
      dispatch({ type: AUTH_ACTIONS.SET_USER, payload: data.data });
      toast.success(`Welcome back, ${data.data.name}! 👋`);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: message });
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      return { success: false, message };
    }
  }, []);

  // ── Logout ────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('taskflow_user');
    dispatch({ type: AUTH_ACTIONS.CLEAR_USER });
    toast.success('Logged out successfully');
  }, []);

  const value = {
    user: state.user,
    loading: state.loading,
    error: state.error,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
