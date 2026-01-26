import { useEffect } from 'react';

const useTitle = (title) => {
    useEffect(() => {
        document.title = `${title} | ZapShift - Fast & Reliable Parcel Delivery`;
    }, [title]);
};

export default useTitle;
