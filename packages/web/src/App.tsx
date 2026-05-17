import { noop } from '@/shared/utils'

function App() {
  noop()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <h1 className="text-4xl font-bold tracking-tight">CryptoWatch</h1>
      <p className="mt-2 text-muted-foreground">Track your crypto portfolio</p>
    </div>
  )
}

export default App
