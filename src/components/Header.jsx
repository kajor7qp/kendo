import React from "react";
import { Button } from "@progress/kendo-react-buttons";

const Header = ({ rows, cols, mines, time, onReset }) => {
    return (
        <div className="flex items-center justify-between w-full max-w-lg mb-4 p-2 bg-white shadow rounded-lg">
            <div>
                <p className="text-sm">Größe: {rows} × {cols}</p>
                <p className="text-sm">Minen: {mines}</p>
            </div>
            <div className="text-lg font-mono font-bold">⏱ {time}</div>
            <Button themeColor="primary" onClick={onReset}>🔄 Reset</Button>
        </div>
    );
};

export default Header;
