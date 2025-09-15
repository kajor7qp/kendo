import React from "react";
import {
    Notification,
    NotificationGroup,
} from "@progress/kendo-react-notification";

const Notifications = ({ win, gameOver }) => (
    <NotificationGroup
        style={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
        }}
    >
        {win && (
            <Notification type={{ style: "success", icon: true }}>
                🎉 Gewonnen!
            </Notification>
        )}
        {gameOver && (
            <Notification type={{ style: "error", icon: true }}>
                💥 Game Over
            </Notification>
        )}
    </NotificationGroup>
);

export default Notifications;
