import axios, {
  AxiosError,
  RawAxiosRequestHeaders,
  AxiosResponse,
  Method,
  ResponseType,
} from 'axios'


export type peticionFormatoMetodo = {
  tipo?: Method
} & peticionFormato

export type peticionFormato = {
  url: string
  headers?: RawAxiosRequestHeaders
  body?: object
  params?: any
  responseType?: ResponseType
  withCredentials?: boolean
}

export const estadosCorrectos: number[] = [200, 201, 202, 204]
export const estadosSinPermiso: number[] = [401]

class ServiciosClass {
  async peticionHTTP({
    url,
    tipo = 'get',
    headers,
    body,
    params,
    responseType,
    withCredentials = true,
  }: peticionFormatoMetodo): Promise<AxiosResponse> {
    return axios({
      method: tipo,
      url: url,
      headers: headers,
      timeout: 30000,
      data: body,
      params: params,
      responseType: responseType,
      withCredentials: withCredentials,
      validateStatus(status) {
        return estadosCorrectos.some((estado: number) => status === estado)
      },
    })
  }

  isNetworkError(err: AxiosError | any) {
    return !!err.isAxiosError && !err.response
  }

  async peticion({
    url,
    tipo = 'get',
    headers,
    body,
    params,
    responseType,
    withCredentials = true,
  }: peticionFormatoMetodo) {
    try {
      console.log(`enviando 🌍`, body, tipo, url, headers)
      const response = await this.peticionHTTP({
        url,
        tipo,
        headers,
        body,
        params,
        responseType,
        withCredentials,
      })
      console.log('respuesta 📡', body, tipo, url, response)
      return response.data
    } catch (e: AxiosError | any) {
      if (e.code === 'ECONNABORTED') {
        throw new Error('La petición está tardando demasiado')
      }

      if (this.isNetworkError(e)) {
        throw new Error('Error en la conexión 🌎')
      }

      throw e.response?.data || 'Ocurrio un error desconocido'
    }
  }

  async get({
    url,
    body = {},
    headers = {},
    params,
    responseType,
    withCredentials,
  }: peticionFormato): Promise<any> {
    return await this.peticion({
      url,
      tipo: 'get',
      headers,
      body,
      params,
      responseType,
      withCredentials,
    })
  }

  async post({
    url,
    body,
    headers,
    params,
    responseType,
    withCredentials,
  }: peticionFormato): Promise<any> {
    return await this.peticion({
      url,
      tipo: 'post',
      headers,
      body,
      params,
      responseType,
      withCredentials,
    })
  }

  async put({
    url,
    body,
    headers,
    params,
    responseType,
    withCredentials,
  }: peticionFormato): Promise<any> {
    return await this.peticion({
      url,
      tipo: 'put',
      headers,
      body,
      params,
      responseType,
      withCredentials,
    })
  }

  async patch({
    url,
    body,
    headers,
    params,
    responseType,
    withCredentials,
  }: peticionFormato): Promise<any> {
    return await this.peticion({
      url,
      tipo: 'patch',
      headers,
      body,
      params,
      responseType,
      withCredentials,
    })
  }

  async delete({
    url,
    body,
    headers,
    params,
    responseType,
    withCredentials,
  }: peticionFormato): Promise<any> {
    return await this.peticion({
      url,
      tipo: 'delete',
      headers,
      body,
      params,
      responseType,
      withCredentials,
    })
  }
}

export const Servicios = new ServiciosClass()
