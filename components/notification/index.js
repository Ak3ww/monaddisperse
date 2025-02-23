// components/notification/index.js
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Notification({ children }) {
  return (
    <>
      {children}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default Notification;
