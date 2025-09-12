import React from "react";

const StatusBar = ({ minesLeft, elapsed, onReset, gameOver, win }) => {
    let face = "😀";
    if (gameOver) face = "😵";
    else if (win) face = "😎";

    return (
        <div className="statusbar">
            <div className="status-item">
                <span className="status-label">🚩</span>
                <span className="status-value">{minesLeft}</span>
            </div>

            <div className="status-face" onClick={onReset}>
                {face}
            </div>

            <div className="status-item">
                <span className="status-label">⏱</span>
                <span className="status-value">{elapsed}s</span>
            </div>
        </div>
    );
};

export default StatusBar;
