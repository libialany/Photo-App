import { readCookie, removeCookie, removeCookies, saveCookie } from '../../utils/session'
import {
  peticionFormatoMetodo,
  Servicios,
} from '../services/Servicios'
import axios from 'axios'
import { verifyToken } from '../../utils/token'
import { useRouter } from 'next/router'
export const useSession = () => {
  const router = useRouter()
  const sesionRequest = async ({
    url,
    tipo = 'get',
    body,
    headers,
    params,
    responseType,
    withCredentials,
  }: peticionFormatoMetodo) => {
    try {
      if (!verifyToken(readCookie('access_token_frontend') ?? '')) {
        console.log(`Token expired ⏳`)
        await actualizarSesion()
      }
      const _headers = {
        accept: 'application/json',
        Authorization: `Bearer ${readCookie('access_token_frontend') ?? ''}`,
        withCredentials: true
      }
      console.log(`enviando 🔐🌍`, body, tipo, url, _headers)
      const response = await Servicios.peticionHTTP({
        url,
        tipo,
        headers: _headers,
        body,
        params,
        responseType,
        withCredentials,
      })
      return response.data
    } catch (e: import('axios').AxiosError | any) {
      if (e.code === 'ECONNABORTED') {
        throw new Error('La petición está tardando demasiado')
      }

      if (Servicios.isNetworkError(e)) {
        throw new Error('Error en la conexión 🌎')
      }

      throw e.response?.data || 'Ocurrio un error desconocido'
    }
  }

  const removeCookiesSesion = () => {
    removeCookie('access_token')
  }

  const cerrarSesion = async () => {
    try {
      const token = readCookie('access_token')
      console.log('XD');

      //removeCookiesSesion()

      // const respuesta = await Servicios.get({
      //   headers: {
      //     accept: 'application/json',
      //     Authorization: `Bearer ${token}`,
      //   },
      //   url: `${Constantes.baseUrl}/logout`,
      // })
      // console.log(`finalizando con respuesta`, respuesta)

      // if (respuesta?.url) {
      //   window.location.href = respuesta?.url
      // } else {
      //   router.reload()
      // }
    } catch (e) {
      console.log(`Error al cerrar sesión: `, e)
    }
  }

  const actualizarSesion = async () => {
    console.log(`Update token 🚨`)
    try {
      console.log('>>>>>>>>>>>>>>>>>estamos entrando');
      const respuesta = await axios('http://localhost:5000/auth/refresh', {
        method: "post",
        withCredentials: true
      })
      console.log('lllllllllllllllllllllll',respuesta.data);
      console.log('>>>>>>>>>>>>>>>>>estams refrescando', respuesta.data?.accessToken);
      saveCookie('access_token_frontend', respuesta.data?.accessToken)
    } catch (e) {
      await cerrarSesion()
    }
  }

  return { sesionRequest, cerrarSesion, removeCookiesSesion }
}
