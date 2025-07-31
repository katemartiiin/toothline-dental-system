import type { ReactNode } from 'react';

type ModalProps = {
  isOpen: boolean;
  title: string;
  children?: ReactNode;
  onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  children,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={onClose}></div>

      {/* Modal content */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
          <h2 className="text-lg font-semibold mb-4">{title}</h2>
          <div className="text-gray-700 mb-6">{children}</div>
        </div>
      </div>
    </>
  );
};

export default Modal;
