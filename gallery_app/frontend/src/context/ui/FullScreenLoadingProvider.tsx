import { createContext, ReactNode, useContext, useState } from 'react'
import { FullScreenLoading } from '../../common/components/ui/FullScreenLoading'
import { Box, Fade } from '@mui/material'

interface FullScreenLoadingType {
  estadoFullScreen: boolean
  ocultarFullScreen: () => void
  mostrarFullScreen: (mensaje?: string | undefined | null) => void
}

const FullScreenLoadingContext = createContext<FullScreenLoadingType>(
  {} as FullScreenLoadingType
)

interface FullScreenProviderContextType {
  children: ReactNode
}

export const FullScreenLoadingProvider = ({
  children,
}: FullScreenProviderContextType) => {
  const [mensaje, setMensaje] = useState<string | null>()
  const [mostrar, setMostrar] = useState<boolean>(false)

  const mostrarFullScreen = (mensaje?: string | null) => {
    setMensaje(mensaje)
    setMostrar(true)
  }

  const ocultarFullScreen = () => {
    setMensaje(undefined)
    setMostrar(false)
  }

  return (
    <FullScreenLoadingContext.Provider
      value={{
        estadoFullScreen: mostrar,
        ocultarFullScreen: ocultarFullScreen,
        mostrarFullScreen: mostrarFullScreen,
      }}
    >
      {mostrar && (
        <Box minHeight="100vh">
          <FullScreenLoading mensaje={mensaje} />
        </Box>
      )}
      <Fade in={!mostrar} timeout={1000}>
        <Box
          sx={{
            display: mostrar ? 'none' : 'block',
            displayPrint: mostrar ? 'none' : 'block',
          }}
          minHeight="100vh"
        >
          {children}
        </Box>
      </Fade>
    </FullScreenLoadingContext.Provider>
  )
}

export const useFullScreenLoading = () => useContext(FullScreenLoadingContext)
