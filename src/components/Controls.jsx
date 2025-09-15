import React from "react";
import { DropDownList } from "@progress/kendo-react-dropdowns";

const difficulties = [
    { text: "Leicht (9x9, 10 Minen)", value: { rows: 9, cols: 9, mines: 10 } },
    { text: "Mittel (16x16, 40 Minen)", value: { rows: 16, cols: 16, mines: 40 } },
    { text: "Schwer (30x16, 99 Minen)", value: { rows: 16, cols: 30, mines: 99 } },
];

const Controls = ({ onChange }) => {
    return (
        <div className="my-2">
            <DropDownList
                data={difficulties}
                textField="text"
                onChange={(e) => onChange(e.value)}
                defaultValue={difficulties[0]}
            />
        </div>
    );
};

export default Controls;
