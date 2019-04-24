import React from 'react'

const Modal = ({ children, closeModal, modalState }) => {
  if (!modalState) {
    return null
  }

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={closeModal} />
      {children}
    </div>
  )
}

export default Modal
