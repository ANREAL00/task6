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
            <h1 className="title">Welcome</h1>
            <p style={{ color: 'var(--color-text-dim)' }}>Enter your name to start</p>

            <form onSubmit={handleSubmit} className="form-group">
                <div className="input-container">
                    <User size={20} className="input-icon" />
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
                <button type="submit" className="btn-primary">
                    Enter Lobby
                </button>
            </form>
        </div>
    );
};

export default LoginScreen;
