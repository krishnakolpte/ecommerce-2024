/** @format */

import { toast } from "react-hot-toast";

export const responseToast = (res, navigate, url) => {
    if ("data" in res) {
        toast.success(res.data.message);
        if (navigate) {
            navigate(url || null);
        }
    } else {
        const error = res.error;
        const message = error.data.message;

        toast.error(message);
    }
};
