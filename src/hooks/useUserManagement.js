import { useState, useEffect } from 'react';

const useUserManagement = () => {
    const [users, setUsers] = useState(() => {
        const savedUsers = localStorage.getItem('minesweeperUsers');
        return savedUsers ? JSON.parse(savedUsers) : [];
    });

    const [currentUser, setCurrentUser] = useState(() => {
        const savedCurrentUser = localStorage.getItem('minesweeperCurrentUser');
        return savedCurrentUser || '';
    });

    useEffect(() => {
        localStorage.setItem('minesweeperUsers', JSON.stringify(users));
    }, [users]);

    useEffect(() => {
        localStorage.setItem('minesweeperCurrentUser', currentUser);
    }, [currentUser]);

    const addUser = (name) => {
        if (name && !users.includes(name)) {
            setUsers(prev => [...prev, name]);
            setCurrentUser(name);
            return true;
        }
        return false;
    };

    return { users, currentUser, addUser, setCurrentUser };
};

export default useUserManagement;