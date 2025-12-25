const CenterDiv = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col items-center justify-center w-full h-screen">
    {children}
  </div>
)

const Loading = () => {
  return (
    <CenterDiv>
      <h2 className="font-bold">Loading...</h2>
      <h2 className="font-bold">
        The server may be getting ready, it can take up to 5 minutes. Thank you
        for your patience!
      </h2>
    </CenterDiv>
  )
}

export default Loading
