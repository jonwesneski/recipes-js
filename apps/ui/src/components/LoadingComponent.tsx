const CenterDiv = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col items-center justify-center w-full h-screen">
    {children}
  </div>
)

const Loading = () => {
  return (
    <CenterDiv>
      <h2 className="font-bold">Loading...</h2>
    </CenterDiv>
  )
}

export default Loading

// export async function Loading2() {
//   let serverHealthy = true
//   try {
//     // do a short server fetch/health-check with timeout (use fetch with signal)
//     const controller = new AbortController()
//     const timeout = setTimeout(() => controller.abort(), 3000)
//     await healthCheckControllerStatus({}, controller.signal)
//     clearTimeout(timeout)
//   } catch {
//     serverHealthy = false
//   }

//   return (
//     <div className="flex flex-col items-center justify-center w-full h-screen">
//       <h2 className="font-bold">
//         {serverHealthy ? 'Loading...' : 'Having trouble connecting to server.'}
//       </h2>
//       <ProvisioningTimer /> {/* client-only timer will show after 5min */}
//     </div>
//   )
// }
