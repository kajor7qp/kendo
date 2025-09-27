import {useState, useEffect} from 'react';

const useNotification = () => {
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        let timeoutId;
        if (notification) {
            timeoutId = setTimeout(() => {
                setNotification(null);
            }, 2000);
        }
        return () => clearTimeout(timeoutId);
    }, [notification]);

    const showNotification = (type, content) => {
        let notificationData;
        if (typeof type === 'object' && type !== null && 'type' in type && 'content' in type) {
            notificationData = {
                type: type.type || {style: 'info', icon: true},
                content: type.content || 'No content provided'
            };
            console.warn('showNotification called with single object; use separate type and content arguments for clarity', type);
        } else {
            notificationData = {
                type: type || {style: 'info', icon: true},
                content: content || 'No content provided'
            };
        }
        if (!notificationData.content) {
            console.error('Notification content is empty or undefined:', notificationData);
        }
        setNotification(notificationData);
    };

    const hideNotification = () => {
        setNotification(null);
    };

    return {notification, showNotification, hideNotification};
};

export default useNotification;