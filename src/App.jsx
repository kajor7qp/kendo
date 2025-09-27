import React, { useState } from 'react';
import { TabStrip, TabStripTab } from '@progress/kendo-react-layout';
import { Notification, NotificationGroup } from '@progress/kendo-react-notification';
import GameTab from './components/GameTab.jsx';
import StatisticsTab from './components/StatisticsTab.jsx';
import ProfileTab from './components/ProfileTab.jsx';
import useGameLogic from './hooks/useGameLogic.js';
import useUserManagement from './hooks/useUserManagement.js';
import useStatistics from './hooks/useStatistics.js';
import useNotification from './hooks/useNotification.js';

const LEVELS = {
    easy: { rows: 9, cols: 9, mines: 10 },
    medium: { rows: 16, cols: 16, mines: 40 },
    hard: { rows: 16, cols: 30, mines: 99 },
};

function App() {
    const [selectedTab, setSelectedTab] = useState(0);
    const { notification, showNotification, hideNotification } = useNotification();
    const { users, currentUser, addUser, setCurrentUser } = useUserManagement();
    const { gameStats, addGameStat, resetStatistics, formatTime } = useStatistics(currentUser);
    const {
        level,
        board,
        gameOver,
        win,
        elapsed,
        firstClick,
        loading,
        minesLeft,
        face,
        resetGame,
        handleCellClick,
        handleCellRightClick
    } = useGameLogic(LEVELS, showNotification, addGameStat, currentUser);

    const containerStyle = {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
        padding: '20px',
        fontFamily: "'Inter', sans-serif",
        color: 'white'
    };

    return (
        <div style={containerStyle}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '20px',
                    padding: '30px',
                    marginBottom: '30px',
                    textAlign: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                    <h1 style={{ fontSize: '3rem', margin: '0 0 20px 0', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                        💣 KendoReact Minesweeper
                    </h1>
                    <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
                        Enhanced Minesweeper with KendoReact Components
                    </p>
                </div>

                <TabStrip selected={selectedTab} onSelect={(e) => setSelectedTab(e.selected)} className="k-tabstrip">
                    <TabStripTab title="🎮 Play Game">
                        <GameTab
                            level={level}
                            board={board}
                            gameOver={gameOver}
                            win={win}
                            elapsed={elapsed}
                            loading={loading}
                            minesLeft={minesLeft}
                            face={face}
                            resetGame={resetGame}
                            handleCellClick={handleCellClick}
                            handleCellRightClick={handleCellRightClick}
                            formatTime={formatTime}
                            levels={LEVELS}
                        />
                    </TabStripTab>
                    <TabStripTab title="📊 Statistics">
                        <StatisticsTab
                            gameStats={gameStats}
                            resetStatistics={resetStatistics}
                            currentUser={currentUser}
                            formatTime={formatTime}
                            showNotification={showNotification}
                        />
                    </TabStripTab>
                    <TabStripTab title="👤 Benutzer">
                        <ProfileTab
                            users={users}
                            currentUser={currentUser}
                            addUser={addUser}
                            setCurrentUser={setCurrentUser}
                            gameStats={gameStats}
                            formatTime={formatTime}
                        />
                    </TabStripTab>
                </TabStrip>

                <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '15px',
                    padding: '20px',
                    marginTop: '30px',
                    textAlign: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                    <p style={{ margin: '0 0 10px 0', fontSize: '1.1rem' }}>
                        🚀 Built for KendoReact Challenge with ❤️
                    </p>
                    <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                        <strong>11+ KendoReact Components:</strong> Button, DropDownList, Grid, Chart, Card,
                        TabStrip, Notification, Input, Calendar, Loader, NotificationGroup
                    </div>
                </div>

                <NotificationGroup
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 1000,
                        display: 'flex',
                        justifyContent: 'center'
                    }}
                >
                    {notification && (
                        <Notification
                            type={notification.type}
                            closable={true}
                            onClose={hideNotification}
                            className="custom-notification"
                        >
                            <span>{notification.content}</span>
                        </Notification>
                    )}
                </NotificationGroup>
            </div>
        </div>
    );
}

export default App;