import React, { useState } from 'react';
import { Grid, GridColumn } from '@progress/kendo-react-grid'; // Corrected import
import { Card, CardBody, CardTitle } from '@progress/kendo-react-layout';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import {Input} from "@progress/kendo-react-inputs";
import {Button} from "@progress/kendo-react-buttons";

const ProfileTab = ({ users, currentUser, addUser, setCurrentUser, gameStats, formatTime }) => {
    const [playerName, setPlayerName] = useState('');

    return (
        <div style={{ padding: '30px' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <Card>
                    <CardBody>
                        <CardTitle>Benutzer verwalten</CardTitle>
                        <div style={{ marginBottom: '25px' }}>
                            <Input
                                value={playerName}
                                onChange={(e) => setPlayerName(e.value)}
                                placeholder="Neuer Benutzername..."
                            />
                            <Button
                                onClick={() => {
                                    addUser(playerName);
                                    setPlayerName('');
                                }}
                                style={{ marginLeft: '10px' }}
                            >
                                Benutzer erstellen
                            </Button>
                        </div>
                        <div style={{ marginBottom: '25px' }}>
                            <label>Aktiver Benutzer:</label>
                            <DropDownList
                                data={users}
                                value={currentUser}
                                onChange={(e) => setCurrentUser(e.value)}
                                style={{ width: '200px' }}
                            />
                        </div>
                        {currentUser && (
                            <div>
                                <h3>Statistiken für {currentUser}</h3>
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
                            </div>
                        )}
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default ProfileTab;