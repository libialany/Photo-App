import { useSession } from '@/common/hooks/useSession'
import { useAuth } from '@/context/auth/AuthProvider'
import React from 'react'
import axios from 'axios'
function Index() {
  const { login,userLogged } = useAuth()
  const { sesionRequest } = useSession()
  const guardarActualizarRolesPeticion = async () => {
    try {
      const respuesta = await sesionRequest(
        {
          url: 'http://localhost:5000/users/profile',
        }
      )
      console.log(respuesta);
    } catch (e) {
      console.log(`Error al crear o actualizar rol`, e)
    }
  }
  return (
    <div>
      {userLogged && <p>{userLogged.username}</p>}
      <button onClick={()=>{
        userLogged && console.log(userLogged.username)
      }}>User</button>
      <br></br>
      <button onClick={() => { login({username:'3',password:'3'}) }}>click me</button>
      <br></br>
      <button onClick={() => { guardarActualizarRolesPeticion() }}>click me for refresh</button>

    </div>
  )
}

export default Index
