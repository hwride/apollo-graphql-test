import { createContext, ReactNode, useContext, useState } from 'react'

type MobileMenuContextType = {
  menuVisible: boolean
  setMenuVisible: (visible: boolean) => void
}

const MobileMenuContext = createContext<MobileMenuContextType | undefined>(
  undefined
)

export const useMobileMenu = () => {
  const context = useContext(MobileMenuContext)
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider')
  }
  return context
}

export const MobileMenuProvider = ({ children }: { children: ReactNode }) => {
  const [menuVisible, setMenuVisible] = useState<boolean>(false)

  return (
    <MobileMenuContext.Provider value={{ menuVisible, setMenuVisible }}>
      {children}
    </MobileMenuContext.Provider>
  )
}
