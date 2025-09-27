import { useState, useEffect } from 'react';

const useStatistics = (currentUser) => {
    const [gameStats, setGameStats] = useState(() => {
        const savedStats = localStorage.getItem('minesweeperStats');
        return savedStats ? JSON.parse(savedStats) : [];
    });

    useEffect(() => {
        localStorage.setItem('minesweeperStats', JSON.stringify(gameStats));
    }, [gameStats]);

    const addGameStat = (stat) => {
        setGameStats(prev => [...prev, stat]);
    };

    const resetStatistics = () => {
        setGameStats([]);
        localStorage.removeItem('minesweeperStats');
    };

    const formatTime = (milliseconds) => {
        const ms = milliseconds % 1000;
        const seconds = Math.floor(milliseconds / 1000);
        return `${seconds}.${ms.toString().padStart(3, '0')}`;
    };

    return { gameStats, addGameStat, resetStatistics, formatTime };
};

export default useStatistics;