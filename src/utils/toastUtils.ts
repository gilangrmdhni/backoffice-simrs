import { toast } from 'react-toastify';

export const toastMessage = (mssg: string, type: string | 'error' | 'success') => {
    return toast(mssg, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        type: type === 'success' ? 'success' : 'error',
        theme: 'light',
    });
};
