import { forwardRef } from "react";
import Modal from "../../components/Modal";

export type HibitIdModalProps = {
  open: boolean
}

const HIBIT_ID_ORIGIN = import.meta.env.VITE_HIBIT_ID_ORIGIN

const HibitIdModal = forwardRef<HTMLIFrameElement, HibitIdModalProps>(({ open }, ref) => {
  return (
    <Modal visible={open} backdropClose={false}>
      <iframe ref={ref} src={`${HIBIT_ID_ORIGIN}?is_icrc=1`} className="size-full border-none"></iframe>
    </Modal>
  )
})

export default HibitIdModal
