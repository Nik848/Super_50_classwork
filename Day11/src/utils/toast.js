import { toast } from "react-toastify";

const defaultOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const successToast = (message, options = {}) => {
  toast.success(message, { ...defaultOptions, ...options });
};

export const errorToast = (message, options = {}) => {
  toast.error(message, { ...defaultOptions, ...options });
};

export const infoToast = (message, options = {}) => {
  toast.info(message, { ...defaultOptions, ...options });
};

export const warningToast = (message, options = {}) => {
  toast.warn(message, { ...defaultOptions, ...options });
};
