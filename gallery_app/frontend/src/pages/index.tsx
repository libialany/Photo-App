import { useAuth } from '@/context/auth/AuthProvider'
import React from 'react'

function Index() {
  const { ingresar } = useAuth()
  return (
    <div>
      <button onClick={() => { ingresar }}>click me</button>
    </div>
  )
}

export default Index
