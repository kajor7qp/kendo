import React from "react";

const StatusBar = ({minesLeft, elapsed, onReset, gameOver, win}) => {
    let face = Math.random() < 0.5 ? "😊" : "😀";
    if (gameOver) face = "😵";
    else if (win) face = "😎";


    return (
        <div>
            <h1 className="title">💣 Minesweeper</h1>
            <div className="level-buttons">
                <button onClick={() => onReset("easy")}>Easy</button>
                <button onClick={() => onReset("medium")}>Medium</button>
                <button onClick={() => onReset("hard")}>Hard</button>
            </div>
            <div className="statusbar">
                <div className="status-item">
                    <span className="status-label">🚩</span>
                    <span className="status-value">{minesLeft}</span>
                </div>
                <div className="status-face" onClick={() => onReset(null)}>
                    {face}
                </div>
                <div className="status-item">
                    <span className="status-label">⏱</span>
                    <span className="status-value">{elapsed}s</span>
                </div>
            </div>
            {gameOver && <div className="message message--danger">💥 Game Over!</div>}
            {win && <div className="message message--win">🎉 You Win!</div>}
        </div>
    );
};

export default StatusBar;
