import { useState } from 'react';

const useNotification = () => {
    const [notification, setNotification] = useState(null);

    const showNotification = ({ type, content }) => {
        setNotification({
            id: Date.now(),
            type,
            content
        });
    };

    const hideNotification = () => {
        setNotification(null);
    };

    return { notification, showNotification, hideNotification };
};

export default useNotification;