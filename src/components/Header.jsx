import React from 'react';
import { Button } from '@progress/kendo-react-buttons';

const Header = ({ rows, cols, mines, time, onReset, level }) => {
    const handleReset = () => {
        try {
            onReset(level); // Pass current level explicitly
        } catch (error) {
            console.error('Error in resetGame:', error);
        }
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '10px', fontWeight: '600', color: '#374151' }}>
                Board: {rows}x{cols}, Mines: {mines}
            </div>
            <div style={{ marginBottom: '10px' }}>
                <span style={{ fontWeight: '600', color: '#374151' }}>Time: </span>
                <span style={{ fontSize: '1.2rem', color: '#059669' }}>{time}</span>
            </div>
            <Button onClick={handleReset}>Reset Game</Button>
        </div>
    );
};

export default Header;