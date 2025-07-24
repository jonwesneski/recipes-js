import { CameraProvider } from '@src/providers/CameraProvider'
import { RecipeStoreProvider } from '@src/providers/recipe-store-provider'

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <RecipeStoreProvider initialState={{ editEnabled: true }}>
      <CameraProvider>{children}</CameraProvider>
    </RecipeStoreProvider>
  )
}
export default RootLayout
