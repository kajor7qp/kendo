import React, {useState} from 'react';
import {Button} from '@progress/kendo-react-buttons';
import {Grid, GridColumn} from '@progress/kendo-react-grid';
import {Card, CardBody, CardTitle} from '@progress/kendo-react-layout';
import {Chart, ChartSeries, ChartSeriesItem, ChartTitle, ChartLegend} from '@progress/kendo-react-charts';
import {DropDownList} from '@progress/kendo-react-dropdowns';

const StatisticsTab = ({gameStats, resetStatistics, formatTime, showNotification}) => {
    const [selectedUser, setSelectedUser] = useState('All Users');
    const users = ['All Users', ...new Set(gameStats.map(game => game.username))];

    const winLossData = [
        {
            category: 'Wins',
            value: gameStats.filter(g => g.result === 'Win' && (selectedUser === 'All Users' || g.username === selectedUser)).length,
            color: '#10b981'
        },
        {
            category: 'Losses',
            value: gameStats.filter(g => g.result === 'Lose' && (selectedUser === 'All Users' || g.username === selectedUser)).length,
            color: '#ef4444'
        }
    ];
    1
    const levelData = Object.keys({
        easy: {rows: 9, cols: 9, mines: 10},
        medium: {rows: 16, cols: 16, mines: 40},
        hard: {rows: 16, cols: 30, mines: 99}
    }).map(lvl => ({
        level: lvl.charAt(0).toUpperCase() + lvl.slice(1),
        games: gameStats.filter(g => g.level.toLowerCase() === lvl && (selectedUser === 'All Users' || g.username === selectedUser)).length,
        color: lvl === 'easy' ? '#10b981' : lvl === 'medium' ? '#f59e0b' : '#ef4444'
    }));

    return (
        <div style={{padding: '30px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <div>
                    <label style={{display: 'block', marginBottom: '10px', fontWeight: '600', color: '#374151'}}>
                        Select User:
                    </label>
                    <DropDownList
                        data={users}
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.value)}
                        className="custom-dropdown"
                    />
                </div>
                <Button
                    onClick={() => {
                        resetStatistics();
                        showNotification({
                            type: {style: 'info', icon: true},
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

            <Card style={{borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)'}}>
                <CardBody>
                    <CardTitle style={{marginBottom: '20px', color: '#374151'}}>
                        📈 Game History
                    </CardTitle>
                    <Grid
                        data={gameStats.filter(game => selectedUser === 'All Users' ? true : game.username === selectedUser)}
                        sortable={true}
                        style={{height: '350px'}}
                    >
                        <GridColumn field="username" title="Player" width="120px"/>
                        <GridColumn field="level" title="Level" width="100px"/>
                        <GridColumn
                            field="time"
                            title="Time (ms)"
                            width="120px"
                            cell={({dataItem}) => (
                                <td>{formatTime(dataItem.time)}</td>
                            )}
                        />
                        <GridColumn
                            field="result"
                            title="Result"
                            width="100px"
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
                        <GridColumn field="date" title="Date" width="120px"/>
                    </Grid>
                </CardBody>
            </Card>
        </div>
    );
};

export default StatisticsTab;