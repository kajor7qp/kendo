import React from "react";
import { Card, CardHeader, CardBody } from "@progress/kendo-react-layout";

const HintCard = () => (
    <Card style={{ marginTop: "20px", maxWidth: "420px" }}>
        <CardHeader>
            <h5 className="k-card-title">💡 Spielfunktionen</h5>
        </CardHeader>
        <CardBody>
            <p className="text-sm text-gray-700 leading-relaxed">
                - <strong>Linksklick auf Zahl</strong>: Deckt alle Nachbarn auf, wenn die richtige Anzahl
                Flaggen gesetzt ist. <br />
                - <strong>Links+Rechtsklick (Chord)</strong>: Profi-Shortcut, der das gleiche macht –
                schneller und ohne Extra-Klick.
            </p>
        </CardBody>
    </Card>
);

export default HintCard;
