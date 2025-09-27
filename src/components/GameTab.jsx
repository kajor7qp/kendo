import React from 'react';
import { Button } from '@progress/kendo-react-buttons';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Card, CardHeader, CardBody } from '@progress/kendo-react-layout';
import { Loader } from '@progress/kendo-react-indicators';
import Header from './Header.jsx';
import { numberColors } from '../utils/styles.js';

const GameTab = ({
                     level,
                     board,
                     gameOver,
                     win,
                     elapsed,
                     loading,
                     minesLeft,
                     face,
                     resetGame,
                     handleCellClick,
                     handleCellRightClick,
                     formatTime,
                     levels
                 }) => {
    const { rows, cols } = levels[level];

    const gameAreaStyle = {
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 35px)`,
        gap: '2px',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.2)',
        padding: '20px',
        borderRadius: '15px',
        marginBottom: '20px'
    };

    const cellStyle = (cell) => ({
        width: '35px',
        height: '35px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        fontWeight: 'bold',
        cursor: 'pointer',
        borderRadius: '4px',
        transition: 'all 0.2s ease',
        backgroundColor: cell.revealed
            ? (cell.isMine ? '#dc2626' : '#f3f4f6')
            : (cell.flagged ? '#facc15' : '#6b7280'),
        color: cell.revealed
            ? (cell.isMine
                ? '#ffffff'
                : (cell.neighbors > 0 ? numberColors[cell.neighbors] : '#1f2937'))
            : '#f9fafb',
        border: `2px solid ${cell.revealed ? '#d1d5db' : '#4b5563'}`,
        boxShadow: cell.revealed
            ? 'inset 0 2px 4px rgba(0,0,0,0.1)'
            : '0 2px 4px rgba(0,0,0,0.2)'
    });

    return (
        <div style={{ padding: '30px' }}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                alignItems: 'center',
                gap: '30px',
                marginBottom: '30px',
                padding: '20px',
                background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
                borderRadius: '15px'
            }}>
                <div>
                    <label style={{
                        display: 'block',
                        marginBottom: '10px',
                        fontWeight: '600',
                        color: '#374151'
                    }}>
                        Difficulty Level:
                    </label>
                    <DropDownList
                        data={['easy', 'medium', 'hard']}
                        value={level}
                        onChange={(e) => resetGame(e.value)}
                        style={{ width: '150px' }}
                    />
                </div>

                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        fontSize: '3rem',
                        marginBottom: '10px',
                        cursor: 'pointer',
                        padding: '15px',
                        background: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: '50%',
                        display: 'inline-block',
                        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)'
                    }} onClick={() => resetGame()}>
                        {loading ? <Loader size="small" /> : face}
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '600', color: '#374151' }}>
                        {gameOver ? 'Game Over!' : win ? 'You Win!' : 'Playing...'}
                    </div>
                </div>

                <Header
                    rows={rows}
                    cols={cols}
                    mines={levels[level].mines}
                    time={formatTime(elapsed)}
                    onReset={resetGame}
                />

                <div style={{ textAlign: 'right' }}>
                    <div style={{ marginBottom: '10px' }}>
                        <span style={{ fontWeight: '600', color: '#374151' }}>🚩 Mines Left: </span>
                        <span style={{ fontSize: '1.2rem', color: '#ef4444' }}>{minesLeft}</span>
                    </div>
                    <div>
                        <span style={{ fontWeight: '600', color: '#374151' }}>⏱ Time: </span>
                        <span style={{ fontSize: '1.2rem', color: '#059669' }}>{formatTime(elapsed)}</span>
                    </div>
                </div>
            </div>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #1e293b, #334155)',
                padding: '30px',
                borderRadius: '20px',
                marginBottom: '20px'
            }}>
                <div style={gameAreaStyle} onContextMenu={(e) => e.preventDefault()}>
                    {board.flat().map(cell => {
                        let content = '';
                        if (cell.revealed) {
                            if (cell.isMine && gameOver && !cell.flagged) {
                                content = '💣';
                            } else if (cell.neighbors > 0) {
                                content = cell.neighbors;
                            }
                        } else if (cell.flagged) {
                            content = gameOver && !cell.isMine ? '❌' : '🚩';
                        } else if (win && cell.isMine) {
                            content = '🚩';
                        } else if (gameOver && cell.isMine && !cell.flagged) {
                            content = '💣';
                        }

                        return (
                            <div
                                key={cell.id}
                                style={cellStyle(cell)}
                                onClick={() => handleCellClick(cell.row, cell.col)}
                                onContextMenu={(e) => handleCellRightClick(cell.row, cell.col, e)}
                                onMouseEnter={(e) => {
                                    if (!cell.revealed && !gameOver && !win) {
                                        e.target.style.transform = 'scale(1.1)';
                                        e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'scale(1)';
                                    e.target.style.boxShadow = cell.revealed ? 'inset 0 2px 4px rgba(0,0,0,0.1)' : '0 2px 4px rgba(0,0,0,0.2)';
                                }}
                            >
                                {content}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                <Button onClick={() => resetGame('easy')}>
                    🟢 Easy Game
                </Button>
                <Button onClick={() => resetGame('medium')}>
                    🟡 Medium Game
                </Button>
                <Button onClick={() => resetGame('hard')}>
                    🔴 Hard Game
                </Button>
            </div>

            <Card style={{ marginTop: "20px", maxWidth: "420px" }}>
                <CardHeader>
                    <h5 className="k-card-title">💡 Spielfunktionen</h5>
                </CardHeader>
                <CardBody>
                    <p className="text-sm text-gray-700 leading-relaxed">
                        - <strong>Linksklick auf Zahl</strong>: Deckt alle Nachbarn auf, wenn
                        die richtige Anzahl Flaggen gesetzt ist. <br />
                        - <strong>Links+Rechtsklick (Chord)</strong>: Profi-Shortcut, der das
                        gleiche macht – schneller und ohne Extra-Klick.
                    </p>
                </CardBody>
            </Card>
        </div>
    );
};

export default GameTab;