import React from "react";

const Modal = ({ isVisible, onClose, children }) => {
  if (!isVisible) {
    return null;
  }
  const handleClose = (e) => {
    if (e.target.id === "wrapper") onClose();
  };
  return (
    <div
      className="fixed overflow-auto mx-auto inset-0 z-50 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center"
      onClick={handleClose}
    >
      <div
        id="wrapper"
        // onClick={handleClose}

        className="w-full  flex flex-col justify-center items-center "
      >
        <div className="bg-white rounded-lg md:w-3/4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
