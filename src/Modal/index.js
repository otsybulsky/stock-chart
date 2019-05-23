import React from 'react'

const Modal = ({ children, noBackground, closeModal, modalState }) => {
  if (!modalState) return null

  return (
    <div className="modal is-active">
      {!noBackground && (
        <div className="modal-background" onClick={closeModal} />
      )}
      {children}
    </div>
  )
}

export default Modal
