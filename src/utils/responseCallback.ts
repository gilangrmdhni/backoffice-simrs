import { toastMessage } from './toastUtils';

export const responseCallback = async (response: any, successCallback: any, errorCallback: any) => {
    if (response?.error) {
        if (Array.isArray(response.error?.data?.message)) {
            toastMessage(response.error?.data?.message?.join('\n'), 'error');
        } else {
            toastMessage(response.error?.data?.message, 'error');
        }

        if (errorCallback) {
            errorCallback();
        }

    } else {
        toastMessage(response?.data?.message, 'success');
        if (successCallback) {
            successCallback(response?.data);
        }
    }
};
