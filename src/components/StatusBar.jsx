import React from "react";
import { Button } from "@progress/kendo-react-buttons";

const StatusBar = ({ minesLeft, elapsed, onReset, gameOver, win }) => {
    return (
        <div className="statusbar">
            <div className="status-item">
                <span className="status-label">🚩</span>
                <span className="status-value">{minesLeft}</span>
            </div>
            <div className="status-item">
                <span className="status-label">⏱</span>
                <span className="status-value">{elapsed}s</span>
            </div>
            <div style={{ marginLeft: "auto" }}>
                <Button onClick={onReset} togglable={false}>🔄 Reset</Button>
            </div>
        </div>
    );
};

export default StatusBar;
