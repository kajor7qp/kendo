import React from 'react';
import {Button} from '@progress/kendo-react-buttons';

const Header = ({rows, cols, mines, minesLeft, time, onReset, level}) => {
    const handleReset = () => {
        try {
            onReset(level);
        } catch (error) {
            console.error('Error in resetGame:', error);
        }
    };

    return (
        <div style={{textAlign: 'left'}}>
            <Button onClick={handleReset}
                    style={{border: 0, fontSize: '1.5em', background: "none", float: 'right'}}>🔄</Button>
            <div style={{marginBottom: '10px', fontWeight: '600', color: '#374151'}}>
                Board: {rows}x{cols}, Mines: {mines}
            </div>
            <div>
                <div>
                    <span style={{fontWeight: '600', color: '#374151'}}>🚩 Mines Left: </span>
                    <span style={{fontSize: '1.2rem', color: '#ef4444'}}>{minesLeft}</span>
                </div>
                <div>
                    <span style={{fontWeight: '600', color: '#374151'}}>⏱ Time: </span>
                    <span style={{fontSize: '1.2rem', color: '#059669'}}>{time}</span>
                </div>
            </div>
        </div>


    );
};

export default Header;