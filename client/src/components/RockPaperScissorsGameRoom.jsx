import React from 'react';
import { message } from 'antd';
import RockPaperScissorsPanel from './RockPaperScissorsPanel';
import { Copy, RefreshCw, LogOut } from 'lucide-react';

const RockPaperScissorsGameRoom = ({ lobby, username, onMove, onPlayAgain, onLeave }) => {
    const isMyTurn = lobby.turn === lobby.players.find(p => p.username === username)?.id;
    const me = lobby.players.find(p => p.username === username);
    const opponent = lobby.players.find(p => p.username !== username);

    const copyRoomId = () => {
        navigator.clipboard.writeText(lobby.id);
        message.info('Room ID copied to clipboard!');
    };

    if (!me) return <div>Loading...</div>;

    return (
        <div className="card game-card">

            {!lobby.playWithBot && (
                <div className="room-header">
                    <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Room: <span className="room-id">{lobby.id}</span></h2>
                    <button
                        onClick={copyRoomId}
                        className="copy-btn"
                        title="Copy Room ID"
                    >
                        <Copy size={16} />
                    </button>
                </div>
            )}

            <div className="players-container">
                <PlayerBadge player={me} isTurn={lobby.turn === me.id} label='YOU' />
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: '#64748b' }}>VS</div>
                <PlayerBadge player={opponent} isTurn={opponent && lobby.turn === opponent.id} label='OPPONENT' />
            </div>

            <div style={{ margin: '0 auto' }}>
                <RockPaperScissorsPanel
                    board={lobby.board}
                    onMove={(index) => onMove(lobby.id, index)}
                />
            </div>

            <div className="status-container">
                {lobby.winner ? (
                    <div className="fade-in">
                        <h3 style={{
                            fontSize: '1.5rem',
                            color: lobby.winner === 'draw' ? 'var(--color-text)' : (lobby.winner === me.symbol ? 'var(--color-success)' : 'var(--color-error)')
                        }}>
                            {lobby.winner === 'draw' ? "It's a Draw!" : (lobby.winner === me.symbol ? "You Won!" : "You Lost")}
                        </h3>
                        {lobby.rematch && !lobby.playWithBot && lobby.rematch.includes(me.id) ? (
                            <p style={{ marginTop: '1rem', color: 'var(--color-primary)', fontWeight: 'bold' }}>
                                Waiting for opponent's decision...
                            </p>
                        ) : (!lobby.playWithBot &&
                            <button
                                onClick={() => onPlayAgain(lobby.id)}
                                style={{ marginTop: '1rem', background: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'white' }}
                            >
                                <RefreshCw size={18} /> Play Again
                            </button>
                        )}
                        {lobby.playWithBot && (
                            <button
                                onClick={() => onPlayWithBot(lobby.id)}
                                style={{ marginTop: '1rem', background: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'white' }}
                            >
                                <Bot size={18} /> Play with Bot
                            </button>
                        )}
                    </div>
                ) : (
                    <div>
                        <p style={{ fontSize: '1.2rem', color: isMyTurn ? 'var(--color-primary)' : 'var(--color-text-dim)' }}>
                            {isMyTurn ? "Your Turn" : (opponent ? `Waiting for ${opponent.username}...` : "Waiting for opponent to join...")}
                        </p>
                        {!opponent && (
                            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-dim)', marginTop: '0.5rem' }}>
                                Share Room ID: <b>{lobby.id}</b>
                            </p>
                        )}
                    </div>
                )}
            </div>

            <button onClick={() => onLeave(lobby.id)} style={{ background: 'transparent', color: '#ef4444', marginTop: '1rem', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <LogOut size={16} /> Leave Game
            </button>

        </div>
    );
};

const PlayerBadge = ({ player, isTurn, label }) => {
    if (!player) return (
        <div className="player-badge" style={{ opacity: 0.5 }}>
            <div className="player-symbol empty"></div>
            Waiting...
        </div>
    );

    return (
        <div className="player-badge" style={{
            opacity: isTurn ? 1 : 0.6,
            transform: isTurn ? 'scale(1.1)' : 'scale(1)'
        }}>
            <div className={`player-symbol ${player.symbol === 'X' ? 'x' : 'o'}`} style={{
                boxShadow: isTurn ? `0 0 15px ${player.symbol === 'X' ? 'var(--color-secondary)' : 'var(--color-primary)'}` : 'none'
            }}>
                {player.symbol}
            </div>
            <div style={{ fontWeight: 'bold' }}>{player.username}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)' }}>{label}</div>
        </div>
    );
};

export default RockPaperScissorsGameRoom;
