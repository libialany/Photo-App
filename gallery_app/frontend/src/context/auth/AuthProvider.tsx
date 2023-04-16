import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react'
import router, { useRouter } from 'next/router'
import {
    LoginType
} from '../../modules/login/types/loginTypes'
import axios from 'axios'
import Cookies from 'js-cookie';

import { UserType } from '@/modules/user/types/UserType';
import { useSession } from '@/common/hooks/useSession';
import { saveCookie, readCookie } from '@/utils/session';
import { Servicios } from '@/common/services/Servicios';

interface ContextProps {
    login: ({ username, password }: LoginType) => Promise<void>
    userLogged: UserType | null
}

const AuthContext = createContext<ContextProps>({} as ContextProps)

interface AuthContextType {
    children: ReactNode
}

export const AuthProvider = ({ children }: AuthContextType) => {
    const [user, setUser] = useState<UserType | null>(null)
    const [rol, setRol] = useState<string | null>()
    const { sesionRequest, removeCookiesSesion } = useSession()
    const login = async ({ username, password }: LoginType) => {
        try {
            const response = await Servicios.post({
                url: 'http://localhost:5000/auth/signin',
                body: { username, password },
                headers: {},
            })
            saveCookie('access_token_frontend', response?.accessToken)
            setUser(response)
        } catch (e) {
            console.log(`Error al iniciar sesión: `, e)
        }
    }
    const setRolUser = async (username: string) => {
        try {
            const respuestaPermisos = await sesionRequest({
                url: "http://localhost:5000/users/rol",
            })
            setRol(respuestaPermisos.rol)
            const newUser: UserType = {
                username,
                accessToken: readCookie('access_token_frontend'),
                rol: respuestaPermisos.rol
            }
            setUser(newUser)
        } catch (error) {
            console.log(error);
        }
    }
    const initUser = async () => {
        const token = readCookie('access_token');
        if (!token) {
            return
        }
        try {

            const respuestaPermisos = await sesionRequest({
                url: 'http://localhost:5000/auth/profile',
            })
            // #TODO 
            setRolUser(respuestaPermisos.username)
        } catch (error: Error | any) {
            console.log(`Error durante inicializarUsuario 🚨`, typeof error, error)
            // await router.replace({
            //     pathname: '/login',
            // })
            throw error
        }
    }
    useEffect(() => {
        if (!router.isReady) return
        initUser()
    }, [])
    return (
        <AuthContext.Provider value={{
            login: login,
            userLogged: user
        }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
