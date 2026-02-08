const { v4: uuidv4 } = require('uuid');

const lobbies = new Map();

const WIN_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function checkWinner(board) {
    for (let combo of WIN_COMBINATIONS) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return board.includes(null) ? null : 'draw';
}

function socketManager(io) {
    io.on('connection', (socket) => {

        socket.on('login', (username) => {
            socket.username = username;
            socket.emit('login_success', { id: socket.id, username });
        });

        socket.on('create_lobby', () => {
            const roomId = uuidv4().slice(0, 6).toUpperCase();
            const lobby = {
                id: roomId,
                players: [{ id: socket.id, username: socket.username, symbol: 'X' }],
                board: Array(9).fill(null),
                turn: socket.id,
                winner: null,
                rematch: []
            };

            lobbies.set(roomId, lobby);
            socket.join(roomId);

            socket.emit('lobby_created', lobby);
        });

        socket.on('join_lobby', (roomId) => {
            const lobby = lobbies.get(roomId);

            if (!lobby) {
                socket.emit('error', 'Lobby not found');
                return;
            }

            if (lobby.players.length > 1) {
                socket.emit('error', 'Lobby is full');
                return;
            }

            const player = { id: socket.id, username: socket.username, symbol: 'O' };
            lobby.players.push(player);

            socket.join(roomId);

            io.to(roomId).emit('player_joined', lobby);
            io.to(roomId).emit('game_start', lobby);
        });

        socket.on('make_move', ({ roomId, index }) => {
            const lobby = lobbies.get(roomId);
            if (!lobby) return;

            if (lobby.winner) return;
            if (lobby.turn !== socket.id) return;
            if (lobby.board[index] !== null) return;

            const player = lobby.players.find(p => p.id === socket.id);
            if (!player) return;

            lobby.board[index] = player.symbol;

            const result = checkWinner(lobby.board);

            if (result) {
                lobby.winner = result;
                io.to(roomId).emit('game_over', { winner: result, board: lobby.board });
            } else {
                const nextPlayer = lobby.players.find(p => p.id !== socket.id);
                lobby.turn = nextPlayer ? nextPlayer.id : null;
                io.to(roomId).emit('update_board', { board: lobby.board, turn: lobby.turn });
            }
        });

        socket.on('play_again', (roomId) => {
            const lobby = lobbies.get(roomId);
            if (!lobby) return;
            if (lobby.rematch.includes(socket.id)) return;

            lobby.rematch.push(socket.id);

            if (lobby.rematch.length === 2) {
                lobby.board = Array(9).fill(null);
                lobby.winner = null;
                lobby.rematch = [];
                lobby.turn = lobby.players[0].id;

                io.to(roomId).emit('game_reset', lobby);
            }
        });

        socket.on('disconnect', () => {
            for (const [roomId, lobby] of lobbies.entries()) {
                const playerIndex = lobby.players.findIndex(p => p.id === socket.id);
                if (playerIndex !== -1) {
                    lobby.players.splice(playerIndex, 1);

                    if (lobby.players.length === 0) {
                        lobbies.delete(roomId);
                    } else {
                        io.to(roomId).emit('player_left');
                        lobbies.delete(roomId);
                    }
                }
            }
        });
    });
}

module.exports = socketManager;
