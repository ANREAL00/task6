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

                <div className="lobby-options-container">
                    <div className="lobby-option">
                        <h1 className="lobby-option-title">Tic Tac Toe</h1>
                        <button onClick={onCreateGame} className="btn-gradient">
                            <Swords size={20} /> Create New Game
                        </button>
                        <p className="lobby-option-text" style={{ marginBottom: '1rem' }}>
                            Start a new game and invite a friend.
                        </p>
                        <button onClick={onCreateGameWithBot} className="btn-gradient">
                            <Bot size={20} /> Play with Bot
                        </button>
                        <p className="lobby-option-text">
                            Play against the Bot.
                        </p>
                    </div>
                    <div className="lobby-option">
                        <h1 className="lobby-option-title">Rock Paper Scissors</h1>
                        <button onClick={onCreateGame} className="btn-gradient">
                            <Swords size={20} /> Create New Game
                        </button>
                        <p className="lobby-option-text">
                            Start a new game and invite a friend.
                        </p>
                    </div>
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
