import HeaderLayout from './header-layout'

const MainShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderLayout />
      <main className="flex-1 container mx-auto px-4 py-2 overflow-y-auto max-w-6xl">
        {children}
      </main>
    </div>
  )
}

export default MainShell
