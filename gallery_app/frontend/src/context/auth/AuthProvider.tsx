import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import router, { useRouter } from "next/router";
import { LoginType } from "../../modules/login/types/loginTypes";

import { UserType } from "@/modules/user/types/UserType";
import { useSession } from "@/common/hooks/useSession";
import { saveCookie, readCookie } from "@/utils/session";
import { Servicios } from "@/common/services/Servicios";

interface ContextProps {
  login: ({ username, password }: LoginType) => Promise<void>;
  userLogged: UserType | null;
  reload: ()=> Promise<void>
}

const AuthContext = createContext<ContextProps>({} as ContextProps);

interface AuthContextType {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthContextType) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [rol, setRol] = useState<string | null>(null);
  const { sesionRequest, removeCookiesSesion } = useSession();
  const login = async ({ username, password }: LoginType) => {
    try {
      const response = await Servicios.post({
        url: "http://localhost:5000/auth/signin",
        body: { username, password },
        headers: {},
      });
      saveCookie("access_token_frontend", response?.accessToken);
      setUser(response);
      console.log("Good", response);
    } catch (e) {
      console.log(`Error al iniciar sesión: `, e);
      borrarSesionUsuario()
    }
  };
  // borrar sesion
  const borrarSesionUsuario = () => {
    setUser(null);
    removeCookiesSesion();
  };
  // setear sesion
  const setRolUser = async () => {
    // const responseUser = await sesionRequest({
    //   url: "http://localhost:5000/users/profile",
    // });
    const token = readCookie('access_token_frontend')
    const responseUser = await Servicios.get({
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/users/profile`,
    })
    console.log(`🥺 😭 funciona?  ${responseUser}`);
    if (!responseUser?.rol) {
      throw new Error("Error no roles");
    }
    setUser(responseUser);
    console.log(`rol defined  👨‍💻: ${responseUser?.rol}`);
    setRol(responseUser?.rol);
    saveCookie("rol", responseUser?.rol);
  };
  const initUser = async () => {
    const token = readCookie("access_token_frontend");
    if (!token) {
      return;
    }
    try {
      await setRolUser();
    } catch (error: Error | any) {
      console.log(`Error durante inicializarUsuario 🚨`, typeof error, error);
      await router.replace({
        pathname: "/",
      });
      setRol(null);
      setUser(null);
      throw error;
    }
  };
  useEffect(() => {
    if (!router.isReady) return;
    initUser();
  }, []);
  return (
    <AuthContext.Provider
      value={{
        login: login,
        userLogged: user,
        reload: setRolUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
