import { NavigationLayout } from '@src/components/navigation'
import { CameraProvider } from '@src/providers/CameraProvider'
import { RecipeStoreProvider } from '@src/providers/recipe-store-provider'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <RecipeStoreProvider>
      <CameraProvider>
        <NavigationLayout>{children}</NavigationLayout>
      </CameraProvider>
    </RecipeStoreProvider>
  )
}
export default Layout
