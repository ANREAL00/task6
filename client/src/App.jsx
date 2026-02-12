import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { message } from 'antd';
import LoginScreen from './components/LoginScreen';
import LobbyScreen from './components/LobbyScreen';
import TicTacToeGameRoom from './components/TicTacToeGameRoom';
import RockPaperScissorsGameRoom from './components/RockPaperScissorsGameRoom';

const socket = io(import.meta.env.VITE_API_BASE || 'http://localhost:3001', {
  transports: ['websocket'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5
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

    socket.on('lobby_tic_tac_toe_created', (newLobby) => {
      setLobby(newLobby);
      setScreen('game_tic_tac_toe');
    });

    socket.on('lobby_rock_paper_scissors_created', (newLobby) => {
      setLobby(newLobby);
      setScreen('game_rock_paper_scissors');
    });

    socket.on('player_joined_tic_tac_toe', (updatedLobby) => {
      setLobby(updatedLobby);
      if (screen !== 'game_tic_tac_toe') setScreen('game_tic_tac_toe');
    });

    socket.on('player_joined_rock_paper_scissors', (updatedLobby) => {
      setLobby(updatedLobby);
      if (screen !== 'game_rock_paper_scissors') setScreen('game_rock_paper_scissors');
    });

    socket.on('update_board', ({ board, turn, players }) => {
      setLobby(prev => ({ ...prev, board, turn, players }));
    });

    socket.on('game_over', ({ winner, board, players }) => {
      setLobby(prev => ({ ...prev, board, winner, players }));
    });

    socket.on('rematch_update', ({ rematch }) => {
      setLobby(prev => ({ ...prev, rematch }));
    });

    socket.on('game_reset', (resetLobby) => {
      setLobby(resetLobby);
    });

    socket.on('player_reconnected', (updatedLobby) => {
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
      socket.off('disconnect');
      socket.off('login_success');
      socket.off('lobby_created');
      socket.off('player_joined');
      socket.off('update_board');
      socket.off('game_over');
      socket.off('game_reset');
      socket.off('play_with_bot');
      socket.off('player_reconnected');
      socket.off('player_left');
      socket.off('error');
    };
  }, []);

  const handleLogin = (name) => {
    socket.emit('login', name);
  };

  const handleCreateGameTicTacToe = () => {
    socket.emit('create_tic_tac_toe_lobby');
  };

  const handleCreateGameRPS = () => {
    socket.emit('create_rock_paper_scissors_lobby');
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

  const handleTicTacToeMove = (roomId, index) => {
    socket.emit('make_move_tictactoe', { roomId, index, username });
  };

  const handleRockPaperScissorsMove = (roomId, index) => {
    socket.emit('make_rock_paper_scissors_move', { roomId, index, username });
  };

  const handlePlayAgain = (roomId, type) => {
    socket.emit('play_again', roomId, type);
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
          onCreateGame={handleCreateGameTicTacToe}
          onCreateGameRPS={handleCreateGameRPS}
          onJoinGame={handleJoinGame}
          onCreateGameWithBot={handleCreateGameWithBot}
        />
      )}

      {screen === 'game_tic_tac_toe' && lobby && (
        <TicTacToeGameRoom
          lobby={lobby}
          username={username}
          onMove={handleTicTacToeMove}
          onPlayAgain={handlePlayAgain}
          onPlayWithBot={handlePlayWithBot}
          onLeave={handleLeave}
        />
      )}

      {screen === 'game_rock_paper_scissors' && lobby && (
        <RockPaperScissorsGameRoom
          lobby={lobby}
          username={username}
          onMove={handleRockPaperScissorsMove}
          onPlayAgain={handlePlayAgain}
          onLeave={handleLeave}
        />
      )}
    </div>
  );
}

export default App;
