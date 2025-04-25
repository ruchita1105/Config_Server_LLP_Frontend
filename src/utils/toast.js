// src/utils/toast.js
import { toast } from "react-toastify";

export const showToast = (type, message) => {
  toast.dismiss(); // Dismiss existing toast

  switch (type) {
    case "success":
      toast.success(message);
      break;
    case "error":
      toast.error(message);
      break;
    case "info":
      toast.info(message);
      break;
    case "warn":
    case "warning":
      toast.warn(message);
      break;
    default:
      toast(message); // Default toast
  }
};
