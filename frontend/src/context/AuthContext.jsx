import { createContext, useContext, useReducer, useEffect } from "react";
import authService from "../services/authService";
import { getToken, setToken, removeToken } from "../utils/helpers";

const AuthContext = createContext(null);

const initialState = {
  user:    null,
  token:   getToken(),
  loading: true,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload, loading: false };
    case "LOGIN_SUCCESS":
      return { ...state, user: action.payload.user,
               token: action.payload.token, loading: false };
    case "LOGOUT":
      return { ...state, user: null, token: null, loading: false };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // On mount: if token exists, fetch current user
  useEffect(() => {
    const loadUser = async () => {
      if (!getToken()) {
        dispatch({ type: "SET_LOADING", payload: false });
        return;
      }
      try {
        const res = await authService.getMe();
        dispatch({ type: "SET_USER", payload: res.data.data.user });
      } catch {
        removeToken();
        dispatch({ type: "LOGOUT" });
      }
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    const { token, user } = res.data.data;
    setToken(token);
    dispatch({ type: "LOGIN_SUCCESS", payload: { token, user } });
    return user;
  };

  const signup = async (name, email, password) => {
    const res = await authService.signup({ name, email, password });
    const { token, user } = res.data.data;
    setToken(token);
    dispatch({ type: "LOGIN_SUCCESS", payload: { token, user } });
    return user;
  };

  const logout = () => {
    removeToken();
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};