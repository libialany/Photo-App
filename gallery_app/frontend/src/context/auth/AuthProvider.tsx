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

interface ContextProps {
    ingresar: () => Promise<void>
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
    //const login = async ({ username, password }: LoginType) => {
    const login = async () => {
        console.log('>>>');
        
        try {
            const response = await axios.post('http://localhost:5000/auth/signin', {
                username:'3',
                password:'3',
            },{
                withCredentials:true
            })
                .then(function (response) {
                    saveCookie('access_token_frontend', response.data?.accessToken)
                    // Cookies.set('access_token', response.data?.datos, { expires: 7 });
                    // #TODO
                    // router.replace({
                    //     pathname: '/admin',
                    // })
                    // setRolUser('')
                })
                .catch(function (error) {
                    console.log(error);
                });
        } catch (e) {
            console.log(`Error al iniciar sesión: `, e)
        }
    }
    const setRolUser = async (username:string ) => {
        try {
            const respuestaPermisos = await sesionRequest({
                url: "http://localhost:5000/users/rol",
            })    
            setRol(respuestaPermisos.rol)
            const newUser: UserType = {
                username,
                access_token:readCookie('access_token_frontend'),
                roles: respuestaPermisos.rol
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
            ingresar: login,
            userLogged: user
        }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
