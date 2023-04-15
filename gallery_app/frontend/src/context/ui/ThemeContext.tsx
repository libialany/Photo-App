import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { ThemeProvider as MuiThemeProvider, useMediaQuery } from '@mui/material'

import { darkTheme, lightTheme } from '../../themes'
import { guardarCookie, leerCookie } from '../../common/utils'
import { imprimir } from '../../common/utils/imprimir'
import { useDebouncedCallback } from 'use-debounce'

const DARK_SCHEME_QUERY = '(prefers-color-scheme: dark)'

type ThemeMode = 'light' | 'dark'

interface ThemeContextType {
  themeMode: ThemeMode
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType)
const useThemeContext = () => useContext(ThemeContext)

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const isDarkOS = useMediaQuery(DARK_SCHEME_QUERY)

  const isMountRef = useRef(false)

  const [themeMode, setThemeMode] = useState<ThemeMode>(
    isDarkOS ? 'dark' : 'light'
  )

  const debounced = useDebouncedCallback(() => {
    isMountRef.current = true
  }, 500)

  const guardarModoOscuro = () => {
    setThemeMode('dark')
    guardarCookie('themeMode', 'dark')
    imprimir('🌙')
  }

  const guardarModoClaro = () => {
    setThemeMode('light')
    guardarCookie('themeMode', 'light')
    imprimir('☀️')
  }

  const guardarModoAutomatico = () => {
    setThemeMode(isDarkOS ? 'dark' : 'light')
    guardarCookie('themeMode', isDarkOS ? 'dark' : 'light')
    imprimir('isDarkOS: ', isDarkOS ? '🌙' : '☀️')
  }

  const toggleTheme = () => {
    switch (themeMode) {
      case 'light':
        guardarModoOscuro()
        break
      case 'dark':
        guardarModoClaro()
        break
      default:
    }
  }

  useEffect(() => {
    const themeModeSaved = leerCookie('themeMode')
    imprimir('themeMode', themeModeSaved)

    if (!themeModeSaved) {
      guardarModoAutomatico()
      isMountRef.current = false
      return
    }

    switch (themeModeSaved) {
      case 'dark':
        guardarModoOscuro()
        break
      case 'light':
        guardarModoClaro()
        break
      default:
        guardarModoClaro()
        break
    }
    isMountRef.current = false
    return

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isMountRef.current) {
      guardarModoAutomatico()
    }
    debounced()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDarkOS])

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      <MuiThemeProvider theme={themeMode === 'light' ? lightTheme : darkTheme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  )
}

export { useThemeContext, ThemeProvider }
