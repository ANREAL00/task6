import React, { useState } from 'react';
import { User } from 'lucide-react';

const LoginScreen = ({ onLogin }) => {
    const [username, setUsername] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.trim()) {
            onLogin(username);
        }
    };

    return (
        <div className="card">
            <h1 className="title">Tic Tac Toe</h1>
            <p style={{ color: 'var(--color-text-dim)' }}>Enter your name to start playing online</p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ position: 'relative' }}>
                    <User size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-dim)' }} />
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ paddingLeft: '44px' }}
                        maxLength={12}
                        autoFocus
                    />
                </div>
                <button type="submit" style={{ backgroundColor: 'var(--color-primary)', width: '100%' }}>
                    Enter Lobby
                </button>
            </form>
        </div>
    );
};

export default LoginScreen;
