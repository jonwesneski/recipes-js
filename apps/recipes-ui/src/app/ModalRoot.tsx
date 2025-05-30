import { useModalStore } from "../providers/modal-store-provider"

export default function ModalRoot() {
const modal = useModalStore(state => state.modal)

  return (
    <>
      <div id='modal-root' style={{position: 'fixed', zIndex: 1, top: 0, left: 0, pointerEvents: 'none'}}>
      </div>
      {modal && modal.portal}
    </>
  )
}
