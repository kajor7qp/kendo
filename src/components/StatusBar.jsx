// src/components/StatusBar.jsx
import React from "react";
import { Button } from "@progress/kendo-react-buttons";
import { ProgressBar } from "@progress/kendo-react-progressbars";
import { Tooltip } from "@progress/kendo-react-tooltip";

const StatusBar = ({ minesLeft, time, onReset }) => {
    return (
        <div className="flex items-center justify-between p-4 bg-gray-800 text-white rounded-2xl shadow-lg">
            <div className="flex items-center gap-2">
                ⏱️ <span>{time}s</span>
            </div>
            <div className="flex items-center gap-2">
                💣 <span>{minesLeft}</span>
            </div>
            <Tooltip anchorElement="target" position="top">
                <Button themeColor="primary" fillMode="solid" onClick={onReset}>
                    🔄 Reset
                </Button>
            </Tooltip>
            <ProgressBar
                value={(time % 60) * (100 / 60)}
                style={{ width: 100 }}
                animation={false}
            />
        </div>
    );
};

export default StatusBar;
