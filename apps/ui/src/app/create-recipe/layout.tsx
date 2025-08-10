import { CameraProvider } from '@src/providers/CameraProvider'
import { RecipeStoreProvider } from '@src/providers/recipe-store-provider'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <RecipeStoreProvider>
      <CameraProvider>{children}</CameraProvider>
    </RecipeStoreProvider>
  )
}
export default Layout
