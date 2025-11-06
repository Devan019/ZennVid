import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'

const Modal = (
  {title, isOpen, onClose, children} : {
    title: string,
    isOpen: boolean,
    onClose: () => void,
    children: React.ReactNode
  }
) => {
  return (
    <div>
      <Dialog  open={isOpen} onOpenChange={onClose}>
        <DialogContent className='sm:w-[500px] w-[90%] bg-white dark:bg-black'>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Modal