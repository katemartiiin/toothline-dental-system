import type { ReactNode } from 'react';

type ModalProps = {
  isOpen: boolean;
  title: string;
  children?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onClose: () => void;
  onConfirm?: () => void;
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  children,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={onClose}></div>

      {/* Modal content */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
          <h2 className="text-lg font-semibold mb-4">{title}</h2>
          <div className="text-gray-700 mb-6">{children}</div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm?.();
                onClose();
              }}
              className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
