import React, { useState } from 'react';
import { Swords, Users } from 'lucide-react';

const LobbyScreen = ({ username, onCreateGame, onJoinGame }) => {
    const [roomId, setRoomId] = useState('');

    const handleJoin = (e) => {
        e.preventDefault();
        if (roomId.trim()) {
            onJoinGame(roomId.trim().toUpperCase());
        }
    };

    return (
        <div className="card">
            <h2 style={{ fontSize: '2rem', margin: 0 }}>Welcome, {username}!</h2>
            <p style={{ color: 'var(--color-text-dim)' }}>Choose how you want to play</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>

                <div style={{ background: 'var(--color-surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <button
                        onClick={onCreateGame}
                        style={{
                            width: '100%',
                            background: 'linear-gradient(45deg, var(--color-primary), #60a5fa)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            color: 'var(--color-surface)'
                        }}
                    >
                        <Swords size={20} /> Create New Game
                    </button>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-dim)', marginTop: '0.5rem', textAlign: 'center' }}>
                        Start a new game and invite a friend.
                    </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--color-text-dim)' }}>
                    <div style={{ height: '1px', background: '#334155', flex: 1 }}></div>
                    <span>OR</span>
                    <div style={{ height: '1px', background: '#334155', flex: 1 }}></div>
                </div>

                <form onSubmit={handleJoin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Users size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-dim)' }} />
                        <input
                            type="text"
                            placeholder="Enter Room Code"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            style={{ paddingLeft: '44px', textTransform: 'uppercase', letterSpacing: '1px' }}
                        />
                    </div>
                    <button type="submit" disabled={!roomId.trim()} style={{ width: '100%' }}>
                        Join Game
                    </button>
                </form>

            </div>
        </div>
    );
};

export default LobbyScreen;
