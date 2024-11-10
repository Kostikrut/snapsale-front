import { Zoom, toast } from "react-toastify";

const renderToast = (type, message, settingsObj) => {
  let settings = {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Zoom,
  };

  if (settingsObj) {
    settings = { ...settings, ...settingsObj };
  }

  if (type === "success") toast.success(message, settings);
  if (type === "error") toast.error(message, settings);
  if (type === "info") toast.info(message, settings);

  return;
};

export default renderToast;
