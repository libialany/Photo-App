import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useState,
} from 'react'

interface UIContextType {
  sideMenuOpen: boolean
  closeSideMenu: () => void
  openSideMenu: () => void
}

const UIContext = createContext<UIContextType>({} as UIContextType)
const useSidebar = () => useContext(UIContext)

const SideBarProvider: FC<PropsWithChildren<any>> = ({ children }) => {
  const [sideMenuOpen, setSideMenuOpen] = useState<boolean>(true)

  const openSideMenu = () => {
    setSideMenuOpen(true)
  }

  const closeSideMenu = () => {
    setSideMenuOpen(false)
  }

  return (
    <UIContext.Provider
      value={{
        sideMenuOpen,

        // Methods
        closeSideMenu,
        openSideMenu,
      }}
    >
      {children}
    </UIContext.Provider>
  )
}

export { useSidebar, SideBarProvider }
