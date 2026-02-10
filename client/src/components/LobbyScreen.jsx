import React, { useState } from 'react';
import { Swords, Users, Bot } from 'lucide-react';

const LobbyScreen = ({ username, onCreateGame, onCreateGameWithBot, onJoinGame }) => {
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

            <div className="form-group" style={{ marginTop: '1rem' }}>

                <div className="lobby-option">
                    <button onClick={onCreateGame} className="btn-gradient">
                        <Swords size={20} /> Create New Game
                    </button>
                    <button onClick={onCreateGameWithBot} className="btn-gradient">
                        <Bot size={20} /> Play with Bot
                    </button>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-dim)', marginTop: '0.5rem', textAlign: 'center' }}>
                        Start a new game and invite a friend.
                    </p>
                </div>

                <div className="divider">
                    <div className="divider-line"></div>
                    <span>OR</span>
                    <div className="divider-line"></div>
                </div>

                <form onSubmit={handleJoin} className="form-group">
                    <div className="input-container">
                        <Users size={20} className="input-icon" />
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
