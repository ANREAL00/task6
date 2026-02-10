import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { message } from 'antd';
import LoginScreen from './components/LoginScreen';
import LobbyScreen from './components/LobbyScreen';
import GameRoom from './components/GameRoom';

const socket = io(import.meta.env.VITE_API_BASE, {
  transports: ['websocket']
});

function App() {
  const [screen, setScreen] = useState('login');
  const [username, setUsername] = useState('');
  const [lobby, setLobby] = useState(null);

  useEffect(() => {
    socket.on('connect', () => {
      if (username) {
        socket.emit('login', username);
      }
    });

    socket.on('login_success', ({ username }) => {
      setUsername(username);
      setScreen('lobby');
    });

    socket.on('lobby_created', (newLobby) => {
      setLobby(newLobby);
      setScreen('game');
    });

    socket.on('player_joined', (updatedLobby) => {
      setLobby(updatedLobby);
      if (screen !== 'game') setScreen('game');
    });

    socket.on('update_board', ({ board, turn }) => {
      setLobby(prev => ({ ...prev, board, turn }));
    });

    socket.on('game_over', ({ winner, board }) => {
      setLobby(prev => ({ ...prev, board, winner }));
    });

    socket.on('rematch_update', ({ rematch }) => {
      setLobby(prev => ({ ...prev, rematch }));
    });

    socket.on('game_reset', (resetLobby) => {
      setLobby(resetLobby);
    });

    socket.on('player_reconnected', (updatedLobby) => {
      console.log('Player reconnected, syncing lobby state');
      setLobby(updatedLobby);
    });

    socket.on('player_left', () => {
      message.info('Opponent disconnected.');
      setScreen('lobby');
      setLobby(null);
    });

    socket.on('error', (msg) => {
      message.error(msg);
    });

    return () => {
      socket.off('connect');
      socket.off('login_success');
      socket.off('lobby_created');
      socket.off('player_joined');
      socket.off('update_board');
      socket.off('game_over');
      socket.off('game_reset');
      socket.off('play_with_bot');
      socket.off('player_left');
      socket.off('error');
    };
  }, []);

  const handleLogin = (name) => {
    socket.emit('login', name);
  };

  const handleCreateGame = () => {
    socket.emit('create_lobby');
  };

  const handleCreateGameWithBot = () => {
    socket.emit('create_lobby_with_bot');
  };

  const handleJoinGame = (roomId) => {
    socket.emit('join_lobby', roomId);
  };

  const handlePlayWithBot = (roomId) => {
    socket.emit('play_with_bot', roomId);
  };

  const handleMove = (roomId, index) => {
    socket.emit('make_move', { roomId, index, username });
  };

  const handlePlayAgain = (roomId) => {
    socket.emit('play_again', roomId);
  };

  const handleLeave = (roomId) => {
    setScreen('lobby');
    setLobby(null);
    socket.emit('leave_lobby', roomId);
  };

  return (
    <div className="app-container">
      {screen === 'login' && <LoginScreen onLogin={handleLogin} />}

      {screen === 'lobby' && (
        <LobbyScreen
          username={username}
          onCreateGame={handleCreateGame}
          onJoinGame={handleJoinGame}
          onCreateGameWithBot={handleCreateGameWithBot}
        />
      )}

      {screen === 'game' && lobby && (
        <GameRoom
          lobby={lobby}
          username={username}
          onMove={handleMove}
          onPlayAgain={handlePlayAgain}
          onPlayWithBot={handlePlayWithBot}
          onLeave={handleLeave}
        />
      )}
    </div>
  );
}

export default App;
