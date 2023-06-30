import './App.css'
import { MobileHeader } from './components/MobileHeader.tsx'
import { DesktopMenu } from './components/menu/DesktopMenu.tsx'
import {
    MobileMenuProvider,
    useMobileMenu,
} from './components/menu/MobileMenuContext.tsx'
import { useSelectedExample } from './useSelectedExample.ts'

function AppWithProviders() {
    return (
        <MobileMenuProvider>
            <App />
        </MobileMenuProvider>
    )
}

function App() {
    // Selected example
    const { selectedExample, SelectedExampleComponent, setSelectedExample } =
        useSelectedExample()

    // Menu
    const { setMenuVisible } = useMobileMenu()

    return (
        <div className="grid h-full grid-cols-1 grid-rows-[auto_1fr] text-left sm:grid-cols-[auto_1fr] sm:grid-rows-1">
            <MobileHeader
                selectedExampleId={selectedExample?.id}
                onMenuItemClick={(example) => {
                    setSelectedExample(example)
                    setMenuVisible(false)
                }}
            />
            <DesktopMenu
                selectedExampleId={selectedExample?.id}
                onMenuItemClick={setSelectedExample}
            />
            <div className="flex-1 overflow-auto">
                <SelectedExampleComponent />
            </div>
        </div>
    )
}

export default AppWithProviders
