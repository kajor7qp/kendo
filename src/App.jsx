import "@progress/kendo-theme-default/dist/all.css";
import React, {useState, useEffect} from 'react';
import {Button} from '@progress/kendo-react-buttons';
import {DropDownList} from '@progress/kendo-react-dropdowns';
import {Grid, GridColumn} from '@progress/kendo-react-grid';
import {Chart, ChartSeries, ChartSeriesItem, ChartTitle, ChartLegend} from '@progress/kendo-react-charts';
import {Card, CardBody, CardTitle, CardHeader} from '@progress/kendo-react-layout';
import {TabStrip, TabStripTab} from '@progress/kendo-react-layout';
import {Notification, NotificationGroup} from '@progress/kendo-react-notification';
import {Input} from '@progress/kendo-react-inputs';
import {Loader} from '@progress/kendo-react-indicators';
import {checkWin, createBoard, revealEmpty} from "./utils/boardUtils.jsx";
import {numberColors} from "./utils/styles.jsx";
import Header from "./components/Header.jsx";



// Minesweeper Logic
const LEVELS = {
    easy: {rows: 9, cols: 9, mines: 10},
    medium: {rows: 16, cols: 16, mines: 40},
    hard: {rows: 16, cols: 30, mines: 99},
};

function App() {
    // Game state
    const [level, setLevel] = useState("easy");
    const [board, setBoard] = useState(() =>
        createBoard(LEVELS.easy.rows, LEVELS.easy.cols, LEVELS.easy.mines)
    );
    const [gameOver, setGameOver] = useState(false);
    const [win, setWin] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [elapsed, setElapsed] = useState(0);
    const [firstClick, setFirstClick] = useState(true);
    const [selectedTab, setSelectedTab] = useState(0);
    const [notification, setNotification] = useState(null);
    const [playerName, setPlayerName] = useState('');
    const [loading, setLoading] = useState(false);

    const [users, setUsers] = useState(() => {
        const savedUsers = localStorage.getItem('minesweeperUsers');
        return savedUsers ? JSON.parse(savedUsers) : [];
    });

    const [currentUser, setCurrentUser] = useState(() => {
        const savedCurrentUser = localStorage.getItem('minesweeperCurrentUser');
        return savedCurrentUser || '';
    });

    // Statistics
    const [gameStats, setGameStats] = useState(() => {
        const savedStats = localStorage.getItem('minesweeperStats');
        return savedStats ? JSON.parse(savedStats) : [];
    });

    const formatTime = (milliseconds) => {
        const ms = milliseconds % 1000;
        const seconds = Math.floor(milliseconds / 1000);
        return `${seconds}.${ms.toString().padStart(3, '0')}`;
    };



    const {rows, cols, mines} = LEVELS[level];

    useEffect(() => {
        localStorage.setItem('minesweeperUsers', JSON.stringify(users));
    }, [users]);

    useEffect(() => {
        localStorage.setItem('minesweeperCurrentUser', currentUser);
    }, [currentUser]);


    useEffect(() => {
        localStorage.setItem('minesweeperStats', JSON.stringify(gameStats));
    }, [gameStats]);


    // Timer effect
    useEffect(() => {
        if (!startTime || gameOver || win) return;
        const id = setInterval(() => {
            setElapsed((Date.now() - startTime));
        }, 10);
        return () => clearInterval(id);
    }, [startTime, gameOver, win]);

    // Notification when game ends
    useEffect(() => {
        if (gameOver || win) {
            if (!currentUser) {
                setNotification({
                    id: Date.now(),
                    type: {style: 'warning', icon: true},
                    content: 'Bitte wähle zuerst einen Benutzer!'
                });
                return;
            }

            setGameStats(prev => [...prev, {
                id: prev.length + 1,
                username: currentUser,
                level: level.charAt(0).toUpperCase() + level.slice(1),
                time: elapsed,
                result: gameOver ? 'Lose' : 'Win',
                date: new Date().toISOString().split('T')[0]
            }]);
        }

    }, [gameOver, win, elapsed, level, currentUser]);

    const [mouseButtons, setMouseButtons] = useState(0);

    useEffect(() => {
        const handleDown = (e) => setMouseButtons(e.buttons);
        const handleUp = () => setMouseButtons(0);

        window.addEventListener("mousedown", handleDown);
        window.addEventListener("mouseup", handleUp);

        return () => {
            window.removeEventListener("mousedown", handleDown);
            window.removeEventListener("mouseup", handleUp);
        };
    }, []);

    const addUser = (name) => {
        if (name && !users.includes(name)) {
            setUsers(prev => [...prev, name]);
            setCurrentUser(name);
            setNotification({
                id: Date.now(),
                type: {style: 'success', icon: true},
                content: `Benutzer ${name} wurde erstellt!`
            });
        }
    };


    const handleCellClick = (row, col) => {
        if (gameOver || win) return;

        setBoard(prev => {
            let newBoard = prev.map(r => r.map(c => ({...c})));
            let cell = newBoard[row][col];

            if (mouseButtons === 3 && cell.revealed && cell.neighbors > 0) {
                const dirs = [
                    [-1, -1], [-1, 0], [-1, 1],
                    [0, -1], [0, 1],
                    [1, -1], [1, 0], [1, 1],
                ];

                const neighbors = dirs
                    .map(([dr, dc]) => {
                        const nr = row + dr, nc = col + dc;
                        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                            return newBoard[nr][nc];
                        }
                        return null;
                    })
                    .filter(n => n);

                const flaggedCount = neighbors.filter(n => n.flagged).length;

                if (flaggedCount === cell.neighbors) {
                    neighbors.forEach(n => {
                        if (!n.revealed && !n.flagged) {
                            if (n.isMine) {
                                n.revealed = true;
                                setGameOver(true);
                            } else if (n.neighbors === 0) {
                                revealEmpty(newBoard, n.row, n.col);
                            } else {
                                n.revealed = true;
                            }
                        }
                    });
                }
            } else {

                // Erster Klick = Timer starten und Board ggf. neu generieren
                if (firstClick) {
                    setFirstClick(false);
                    setStartTime(Date.now());
                    if (cell.isMine) {
                        do {
                            newBoard = createBoard(rows, cols, mines);
                            cell = newBoard[row][col];
                        } while (cell.isMine);
                    }
                }

                // Wenn das Feld bereits aufgedeckt ist → prüfen, ob "Chord"-Funktion ausgelöst wird
                if (cell.revealed && cell.neighbors > 0) {
                    const dirs = [
                        [-1, -1], [-1, 0], [-1, 1],
                        [0, -1], [0, 1],
                        [1, -1], [1, 0], [1, 1],
                    ];

                    const neighbors = dirs
                        .map(([dr, dc]) => {
                            const nr = row + dr, nc = col + dc;
                            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                                return newBoard[nr][nc];
                            }
                            return null;
                        })
                        .filter(n => n);

                    const flaggedCount = neighbors.filter(n => n.flagged).length;

                    // Wenn so viele Flaggen gesetzt sind wie die Zahl angibt → decke alle unmarkierten Nachbarn auf
                    if (flaggedCount === cell.neighbors) {
                        neighbors.forEach(n => {
                            if (!n.revealed && !n.flagged) {
                                if (n.isMine) {
                                    n.revealed = true;
                                    setGameOver(true);
                                } else if (n.neighbors === 0) {
                                    revealEmpty(newBoard, n.row, n.col);
                                } else {
                                    n.revealed = true;
                                }
                            }
                        });
                    }
                }
                // Normale Klick-Logik
                else if (!cell.revealed && !cell.flagged) {
                    if (cell.isMine) {
                        cell.revealed = true;
                        setGameOver(true);
                    } else if (cell.neighbors === 0) {
                        revealEmpty(newBoard, row, col);
                    } else {
                        cell.revealed = true;
                    }
                }
            }
            if (checkWin(newBoard)) setWin(true);
            return newBoard;
        });
    };

    const handleCellRightClick = (row, col, e) => {
        e.preventDefault();
        if (gameOver || win) return;

        if (firstClick) {
            setFirstClick(false);
            setStartTime(Date.now());
        }

        setBoard(prev => {
            const newBoard = prev.map(r => r.map(c => ({...c})));
            const cell = newBoard[row][col];
            if (!cell.revealed) {
                cell.flagged = !cell.flagged;
            }
            return newBoard;
        });
    };

    const resetGame = (newLevel = level) => {
        setLoading(true);
        setTimeout(() => {
            setLevel(newLevel);
            const {rows, cols, mines} = LEVELS[newLevel];
            setBoard(createBoard(rows, cols, mines));
            setGameOver(false);
            setWin(false);
            setStartTime(null);
            setElapsed(0);
            setFirstClick(true);
            setLoading(false);

            setNotification({
                id: Date.now(),
                type: {style: 'info', icon: true},
                content: `New ${newLevel} game started!`
            });
        }, 500);
    };

    const flagsUsed = board.flat().filter(c => c.flagged).length;
    const minesLeft = mines - flagsUsed;

    // Chart data for statistics
    const winLossData = [
        {
            category: 'Wins',
            value: gameStats.filter(g => g.result === 'Win').length,
            color: '#10b981'
        },
        {
            category: 'Losses',
            value: gameStats.filter(g => g.result === 'Lose').length,
            color: '#ef4444'
        }
    ];


    const levelData = LEVELS ? Object.keys(LEVELS).map(lvl => ({
        level: lvl.charAt(0).toUpperCase() + lvl.slice(1),
        games: gameStats.filter(g => g.level.toLowerCase() === lvl).length,
        color: lvl === 'easy' ? '#10b981' : lvl === 'medium' ? '#f59e0b' : '#ef4444'
    })) : [];

    const resetStatistics = () => {
        setGameStats([]);
        localStorage.removeItem('minesweeperStats');
        setNotification({
            id: Date.now(),
            type: {style: 'info', icon: true},
            content: 'Statistics have been reset!'
        });
    };


    let face = "😊";
    if (gameOver) face = "😵";
    else if (win) face = "😎";

    const containerStyle = {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
        padding: '20px',
        fontFamily: "'Inter', sans-serif",
        color: 'white'
    };

    const headerStyle = {
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '30px',
        marginBottom: '30px',
        textAlign: 'center',
        border: '1px solid rgba(255, 255, 255, 0.2)'
    };

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
            ? (cell.isMine ? '#dc2626' : '#f3f4f6') // rot für Minen, hellgrau für Zahlen
            : (cell.flagged ? '#facc15' : '#6b7280'), // gelb für Flaggen, grau für verdeckt

        color: cell.revealed
            ? (cell.isMine
                ? '#ffffff' // weiße Bombe
                : (cell.neighbors > 0 ? numberColors[cell.neighbors] : '#1f2937')) // dunkle Zahlen
            : '#f9fafb', // verdeckte Felder: fast weiß

        border: `2px solid ${cell.revealed ? '#d1d5db' : '#4b5563'}`,
        boxShadow: cell.revealed
            ? 'inset 0 2px 4px rgba(0,0,0,0.1)'
            : '0 2px 4px rgba(0,0,0,0.2)'
    });

    return (
        <div style={containerStyle}>
            <div style={{maxWidth: '1400px', margin: '0 auto'}}>

                {/* Header */}
                <div style={headerStyle}>
                    <h1 style={{fontSize: '3rem', margin: '0 0 20px 0', textShadow: '2px 2px 4px rgba(0,0,0,0.3)'}}>
                        💣 KendoReact Minesweeper
                    </h1>
                    <p style={{fontSize: '1.2rem', opacity: 0.9}}>
                        Enhanced Minesweeper with KendoReact Components
                    </p>
                </div>

                {/* Main Content */}
                <Card style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '20px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
                }}>
                    <CardBody>
                        <TabStrip selected={selectedTab} onSelect={(e) => setSelectedTab(e.selected)}>

                            {/* Game Tab */}
                            <TabStripTab title="🎮 Play Game">
                                <div style={{padding: '30px'}}>

                                    {/* Game Controls */}
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

                                        {/* Level Selection */}
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
                                                style={{width: '150px'}}
                                            />
                                        </div>

                                        {/* Game Status */}
                                        <div style={{textAlign: 'center'}}>
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
                                                {loading ? <Loader size="small"/> : face}
                                            </div>
                                            <div style={{fontSize: '1.2rem', fontWeight: '600', color: '#374151'}}>
                                                {gameOver ? 'Game Over!' : win ? 'You Win!' : 'Playing...'}
                                            </div>
                                        </div>

                                        {/* Game Info */}
                                        <Header
                                            rows={LEVELS[level].rows}
                                            cols={LEVELS[level].cols}
                                            mines={LEVELS[level].mines}
                                            time={formatTime(elapsed)}
                                            onReset={resetGame}
                                        />

                                        <div style={{textAlign: 'right'}}>
                                            <div style={{marginBottom: '10px'}}>
                                                <span
                                                    style={{fontWeight: '600', color: '#374151'}}>🚩 Mines Left: </span>
                                                <span style={{fontSize: '1.2rem', color: '#ef4444'}}>{minesLeft}</span>
                                            </div>
                                            <div>
                                                <span style={{fontWeight: '600', color: '#374151'}}>⏱ Time: </span>
                                                <span style={{fontSize: '1.2rem', color: '#059669'}}>{elapsed}s</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Game Board */}
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


                                    {/* Quick Actions */}
                                    <div style={{display: 'flex', justifyContent: 'center', gap: '15px'}}>
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
                                    <Card style={{marginTop: "20px", maxWidth: "420px"}}>
                                        <CardHeader>
                                            <h5 className="k-card-title">💡 Spielfunktionen</h5>
                                        </CardHeader>
                                        <CardBody>
                                            <p className="text-sm text-gray-700 leading-relaxed">
                                                - <strong>Linksklick auf Zahl</strong>: Deckt alle Nachbarn auf, wenn
                                                die richtige Anzahl
                                                Flaggen gesetzt ist. <br/>
                                                - <strong>Links+Rechtsklick (Chord)</strong>: Profi-Shortcut, der das
                                                gleiche macht –
                                                schneller und ohne Extra-Klick.
                                            </p>
                                        </CardBody>
                                    </Card>
                                </div>
                            </TabStripTab>

                            {/* Statistics Tab */}
                            <TabStripTab title="📊 Statistics">
                                <div style={{textAlign: 'right', marginBottom: '20px'}}>
                                    <Button
                                        onClick={resetStatistics}
                                        style={{
                                            backgroundColor: '#ef4444',
                                            color: 'white'
                                        }}
                                    >
                                        🗑️ Reset Statistics
                                    </Button>
                                </div>

                                <div style={{padding: '30px'}}>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: '30px',
                                        marginBottom: '30px'
                                    }}>

                                        {/* Win/Loss Chart */}
                                        <Card style={{borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)'}}>
                                            <CardBody>
                                                <CardTitle style={{marginBottom: '20px', color: '#374151'}}>
                                                    🏆 Win/Loss Ratio
                                                </CardTitle>
                                                <Chart style={{height: '300px'}}>
                                                    <ChartTitle text=""/>
                                                    <ChartLegend position="bottom"/>
                                                    <ChartSeries>
                                                        <ChartSeriesItem
                                                            type="donut"
                                                            data={winLossData}
                                                            categoryField="category"
                                                            field="value"
                                                            colorField="color"
                                                            labels={{
                                                                visible: true,
                                                                content: (e) => `${e.category}: ${e.value}`
                                                            }}
                                                        />
                                                    </ChartSeries>
                                                </Chart>

                                            </CardBody>
                                        </Card>

                                        {/* Games by Level */}
                                        <Card style={{borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)'}}>
                                            <CardBody>
                                                <CardTitle style={{marginBottom: '20px', color: '#374151'}}>
                                                    🎯 Games by Difficulty
                                                </CardTitle>
                                                <Chart style={{height: '300px'}}>
                                                    <ChartTitle text=""/>
                                                    <ChartLegend position="bottom"/>
                                                    <ChartSeries>
                                                        <ChartSeriesItem
                                                            type="column"
                                                            data={levelData}
                                                            categoryField="level"
                                                            field="games"
                                                            colorField="color"
                                                            labels={{
                                                                visible: true,
                                                                content: (e) => e.dataItem.games
                                                            }}
                                                        />
                                                    </ChartSeries>
                                                </Chart>

                                            </CardBody>
                                        </Card>
                                    </div>

                                    {/* Game History Grid */}
                                    <Card style={{borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)'}}>
                                        <CardBody>
                                            <CardTitle style={{marginBottom: '20px', color: '#374151'}}>
                                                📈 Game History
                                            </CardTitle>
                                            <Grid
                                                data={gameStats.filter(game => currentUser ? game.username === currentUser : true)}
                                                sortable={true}
                                                style={{height: '350px'}}
                                            >
                                                <GridColumn field="username" title="Spieler" width="120px"/>
                                                <GridColumn field="level" title="Level" width="100px"/>
                                                <GridColumn
                                                    field="time"
                                                    title="Zeit (s)"
                                                    width="120px"
                                                    cell={({dataItem}) => (
                                                        <td>{formatTime(dataItem.time)}</td>
                                                    )}
                                                />
                                                <GridColumn field="result" title="Ergebnis" width="100px"
                                                            cell={({dataItem}) => (
                                                                <td style={{padding: '8px'}}>
                <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    backgroundColor: dataItem.result === 'Win' ? '#10b981' : '#ef4444',
                    color: 'white'
                }}>
                    {dataItem.result === 'Win' ? '🏆 Win' : '💣 Lose'}
                </span>
                                                                </td>
                                                            )}
                                                />
                                                <GridColumn field="date" title="Datum" width="120px"/>
                                            </Grid>

                                        </CardBody>
                                    </Card>
                                </div>
                            </TabStripTab>

                            {/* Profile Tab */}
                            <TabStripTab title="👤 Benutzer">
                                <div style={{padding: '30px'}}>
                                    <div style={{maxWidth: '800px', margin: '0 auto'}}>
                                        <Card>
                                            <CardBody>
                                                <CardTitle>Benutzer verwalten</CardTitle>

                                                {/* Neuen Benutzer erstellen */}
                                                <div style={{marginBottom: '25px'}}>
                                                    <Input
                                                        value={playerName}
                                                        onChange={(e) => setPlayerName(e.value)}
                                                        placeholder="Neuer Benutzername..."
                                                    />
                                                    <Button
                                                        onClick={() => addUser(playerName)}
                                                        style={{marginLeft: '10px'}}
                                                    >
                                                        Benutzer erstellen
                                                    </Button>
                                                </div>

                                                {/* Benutzer auswählen */}
                                                <div style={{marginBottom: '25px'}}>
                                                    <label>Aktiver Benutzer:</label>
                                                    <DropDownList
                                                        data={users}
                                                        value={currentUser}
                                                        onChange={(e) => setCurrentUser(e.value)}
                                                        style={{width: '200px'}}
                                                    />
                                                </div>

                                                {/* Benutzerstatistiken */}
                                                {currentUser && (
                                                    <div>
                                                        <h3>Statistiken für {currentUser}</h3>
                                                        <Grid
                                                            data={gameStats.filter(game => currentUser ? game.username === currentUser : true)}
                                                            sortable={true}
                                                            style={{height: '350px'}}
                                                        >
                                                            <GridColumn field="username" title="Spieler" width="120px"/>
                                                            <GridColumn field="level" title="Level" width="100px"/>
                                                            <GridColumn
                                                                field="time"
                                                                title="Zeit (s)"
                                                                width="120px"
                                                                cell={({dataItem}) => (
                                                                    <td>{formatTime(dataItem.time)}</td>
                                                                )}
                                                            />
                                                            <GridColumn field="result" title="Ergebnis" width="100px"
                                                                        cell={({dataItem}) => (
                                                                            <td style={{padding: '8px'}}>
                <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    backgroundColor: dataItem.result === 'Win' ? '#10b981' : '#ef4444',
                    color: 'white'
                }}>
                    {dataItem.result === 'Win' ? '🏆 Win' : '💣 Lose'}
                </span>
                                                                            </td>
                                                                        )}
                                                            />
                                                            <GridColumn field="date" title="Datum" width="120px"/>
                                                        </Grid>

                                                    </div>
                                                )}
                                            </CardBody>
                                        </Card>
                                    </div>
                                </div>
                            </TabStripTab>


                        </TabStrip>
                    </CardBody>
                </Card>

                {/* Footer */}
                <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '15px',
                    padding: '20px',
                    marginTop: '30px',
                    textAlign: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                    <p style={{margin: '0 0 10px 0', fontSize: '1.1rem'}}>
                        🚀 Built for KendoReact Challenge with ❤️
                    </p>
                    <div style={{fontSize: '0.9rem', opacity: 0.8}}>
                        <strong>11+ KendoReact Components:</strong> Button, DropDownList, Grid, Chart, Card,
                        TabStrip, Notification, Input, Calendar, Loader, NotificationGroup
                    </div>
                </div>

                {/* Notifications */}
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
                            onClose={() => setNotification(null)}
                            style={{
                                marginBottom: '10px',
                                borderRadius: '12px',
                                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                                minWidth: '300px'
                            }}
                        >
              <span style={{fontWeight: '500'}}>
                {notification.content}
              </span>
                        </Notification>
                    )}
                </NotificationGroup>
            </div>
        </div>
    );
}

export default App;