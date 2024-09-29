import { forwardRef } from "react";
import Modal from "../../components/Modal";

export type HibitIdModalProps = {
  open: boolean
}

const HIBIT_ID_ORIGIN = import.meta.env.VITE_HIBIT_ID_ORIGIN
const ICRC_HOST = import.meta.env.VITE_ICRC_HOST
const ICRC_DEV = import.meta.env.VITE_ICRC_DEV

const HibitIdModal = forwardRef<HTMLIFrameElement, HibitIdModalProps>(({ open }, ref) => {
  const iframeSrc = `${HIBIT_ID_ORIGIN}?is_icrc=1${ICRC_HOST ? `&icrc_host=${encodeURIComponent(ICRC_HOST)}` : ''}${ICRC_DEV === 'true' ? '&icrc_dev=1' : ''}`

  return (
    <Modal visible={open} backdropClose={false}>
      <iframe ref={ref} src={iframeSrc} className="size-full border-none"></iframe>
    </Modal>
  )
})

export default HibitIdModal
