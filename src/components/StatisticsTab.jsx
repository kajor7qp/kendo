import React from 'react';
import { Button } from '@progress/kendo-react-buttons';
import { Grid, GridColumn } from '@progress/kendo-react-grid'; // Corrected import
import { Card, CardBody, CardTitle } from '@progress/kendo-react-layout';
import { Chart, ChartSeries, ChartSeriesItem, ChartTitle, ChartLegend } from '@progress/kendo-react-charts';

const StatisticsTab = ({ gameStats, resetStatistics, currentUser, formatTime, showNotification }) => {
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

    const levelData = Object.keys({
        easy: { rows: 9, cols: 9, mines: 10 },
        medium: { rows: 16, cols: 16, mines: 40 },
        hard: { rows: 16, cols: 30, mines: 99 }
    }).map(lvl => ({
        level: lvl.charAt(0).toUpperCase() + lvl.slice(1),
        games: gameStats.filter(g => g.level.toLowerCase() === lvl).length,
        color: lvl === 'easy' ? '#10b981' : lvl === 'medium' ? '#f59e0b' : '#ef4444'
    }));

    return (
        <div style={{ padding: '30px' }}>
            <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                <Button
                    onClick={() => {
                        resetStatistics();
                        showNotification({
                            type: { style: 'info', icon: true },
                            content: 'Statistics have been reset!'
                        });
                    }}
                    style={{
                        backgroundColor: '#ef4444',
                        color: 'white'
                    }}
                >
                    🗑️ Reset Statistics
                </Button>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '30px',
                marginBottom: '30px'
            }}>
                <Card style={{ borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
                    <CardBody>
                        <CardTitle style={{ marginBottom: '20px', color: '#374151' }}>
                            🏆 Win/Loss Ratio
                        </CardTitle>
                        <Chart style={{ height: '300px' }}>
                            <ChartTitle text="" />
                            <ChartLegend position="bottom" />
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

                <Card style={{ borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
                    <CardBody>
                        <CardTitle style={{ marginBottom: '20px', color: '#374151' }}>
                            🎯 Games by Difficulty
                        </CardTitle>
                        <Chart style={{ height: '300px' }}>
                            <ChartTitle text="" />
                            <ChartLegend position="bottom" />
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

            <Card style={{ borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
                <CardBody>
                    <CardTitle style={{ marginBottom: '20px', color: '#374151' }}>
                        📈 Game History
                    </CardTitle>
                    <Grid
                        data={gameStats.filter(game => currentUser ? game.username === currentUser : true)}
                        sortable={true}
                        style={{ height: '350px' }}
                    >
                        <GridColumn field="username" title="Spieler" width="120px" />
                        <GridColumn field="level" title="Level" width="100px" />
                        <GridColumn
                            field="time"
                            title="Zeit (s)"
                            width="120px"
                            cell={({ dataItem }) => (
                                <td>{formatTime(dataItem.time)}</td>
                            )}
                        />
                        <GridColumn
                            field="result"
                            title="Ergebnis"
                            width="100px"
                            cell={({ dataItem }) => (
                                <td style={{ padding: '8px' }}>
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
                        <GridColumn field="date" title="Datum" width="120px" />
                    </Grid>
                </CardBody>
            </Card>
        </div>
    );
};

export default StatisticsTab;