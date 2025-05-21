
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

// URL del backend
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      // Intentar obtener usuario actual desde localStorage
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      
      // En una implementación real, verificaríamos el token con el backend
      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // Token inválido, limpiar localStorage
        localStorage.removeItem("authToken");
        setUser(null);
      }
    } catch (error) {
      console.error("Error verificando autenticación:", error);
      localStorage.removeItem("authToken");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // En una implementación real, enviaríamos esto al backend
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error en inicio de sesión");
      }

      const data = await response.json();
      
      // Guardar token en localStorage
      localStorage.setItem("authToken", data.token);
      
      // Definir el usuario autenticado
      setUser(data.user);
      
      toast({
        title: "Inicio de sesión exitoso",
        description: `Bienvenido ${data.user.name}`,
      });
      
      navigate("/");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      toast({
        variant: "destructive",
        title: "Error de autenticación",
        description: error instanceof Error ? error.message : "Error al iniciar sesión",
      });
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error en registro");
      }

      const data = await response.json();
      
      // Guardar token en localStorage
      localStorage.setItem("authToken", data.token);
      
      // Definir el usuario autenticado
      setUser(data.user);
      
      toast({
        title: "Registro exitoso",
        description: "Tu cuenta ha sido creada correctamente",
      });
      
      navigate("/");
    } catch (error) {
      console.error("Error al registrar:", error);
      toast({
        variant: "destructive",
        title: "Error de registro",
        description: error instanceof Error ? error.message : "Error al crear cuenta",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      // En una implementación real, invalidaríamos el token en el backend
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`
        }
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      // Limpiar token y usuario
      localStorage.removeItem("authToken");
      setUser(null);
      
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente",
      });
      
      navigate("/login");
    }
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
