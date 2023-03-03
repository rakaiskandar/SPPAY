import { Dialog } from "@headlessui/react";

function Modal({ open, close, title, desc, event } : { open: boolean, close: any, title: string, desc: string, event: any}) {

    return (
        <Dialog as="div" className="modalContainer" open={open} onClose={() => close(false)}>
            <div className="modalSub">
                <div className="modal">
                    <Dialog.Panel className="modalPanel">
                        <Dialog.Title as="h2">{title}</Dialog.Title>

                        <p>
                            {desc}
                        </p>

                        <div>
                            <button onClick={event} className="btnHapus">Yakin</button>
                            <button onClick={() => close(false)} className="btnBatal">Batal</button>
                        </div>
                    </Dialog.Panel>
                </div>
            </div>
        </Dialog>
     );
}

export default Modal;