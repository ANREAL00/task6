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

const BOT_ID = 'BOT_PLAYER';

function minimax(board, depth, isMaximizing, botSymbol, playerSymbol) {
    const winner = checkWinner(board);
    if (winner === botSymbol) return 10 - depth;
    if (winner === playerSymbol) return depth - 10;
    if (winner === 'draw') return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        let prevBestScore = bestScore;
        for (let i = 0; i < 9; i++) {
            if (board[i] === null) {
                board[i] = botSymbol;
                let score = minimax(board, depth + 1, false, botSymbol, playerSymbol);
                board[i] = null;
                bestScore = Math.max(score, bestScore);
                if (prevBestScore === bestScore) {
                    prevBestScore = score;
                }
            }
        }
        return Math.random() < 0.9 ? bestScore : prevBestScore;
    } else {
        let bestScore = Infinity;
        let prevBestScore = bestScore;
        for (let i = 0; i < 9; i++) {
            if (board[i] === null) {
                board[i] = playerSymbol;
                let score = minimax(board, depth + 1, true, botSymbol, playerSymbol);
                board[i] = null;
                bestScore = Math.min(score, bestScore);
                if (prevBestScore === bestScore) {
                    prevBestScore = score;
                }
            }
        }
        return Math.random() < 0.9 ? bestScore : prevBestScore;
    }
}

function getBestMove(board, botSymbol, playerSymbol) {
    let bestScore = -Infinity;
    let move = -1;
    for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
            board[i] = botSymbol;
            let score = minimax(board, 0, false, botSymbol, playerSymbol);
            board[i] = null;
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function handleBotMove(io, roomId) {
    const lobby = lobbies.get(roomId);
    if (!lobby || lobby.winner || lobby.turn !== BOT_ID) return;

    setTimeout(() => {
        const botPlayer = lobby.players.find(p => p.id === BOT_ID);
        const humanPlayer = lobby.players.find(p => p.id !== BOT_ID);
        if (!botPlayer || !humanPlayer) return;

        const bestMove = getBestMove(lobby.board, botPlayer.symbol, humanPlayer.symbol);
        if (bestMove === -1) return;

        lobby.board[bestMove] = botPlayer.symbol;
        const result = checkWinner(lobby.board);

        if (result) {
            lobby.winner = result;
            io.to(roomId).emit('game_over', { winner: result, board: lobby.board });
        } else {
            lobby.turn = humanPlayer.id;
            io.to(roomId).emit('update_board', { board: lobby.board, turn: lobby.turn });
        }
    }, 600);
}

function socketManager(io) {
    io.on('connection', (socket) => {

        socket.on('login', (username) => {
            socket.username = username;
            socket.emit('login_success', { id: socket.id, username });
        });

        socket.on('create_tic_tac_toe_lobby', () => {
            const roomId = uuidv4().slice(0, 6).toUpperCase();
            const lobby = {
                id: roomId,
                players: [{ id: socket.id, username: socket.username, symbol: 'X' }],
                board: Array(9).fill(null),
                turn: socket.id,
                firstTurn: socket.id,
                winner: null,
                rematch: [],
                playWithBot: false
            };

            lobbies.set(roomId, lobby);
            socket.join(roomId);

            socket.emit('lobby_tic_tac_toe_created', lobby);
        });

        socket.on('create_rock_paper_scissors_lobby', () => {
            const roomId = uuidv4().slice(0, 6).toUpperCase();
            const lobby = {
                id: roomId,
                players: [{ id: socket.id, username: socket.username }],
                board: Array(3).fill(null),
                ready: false,
                winner: null,
                rematch: []
            };

            lobbies.set(roomId, lobby);
            socket.join(roomId);

            socket.emit('lobby_rock_paper_scissors_created', lobby);
        });

        socket.on('create_lobby_with_bot', () => {
            const roomId = uuidv4().slice(0, 6).toUpperCase();
            const lobby = {
                id: roomId,
                players: [
                    { id: socket.id, username: socket.username, symbol: 'X' },
                    { id: BOT_ID, username: 'Bot', symbol: 'O' }
                ],
                board: Array(9).fill(null),
                turn: socket.id,
                firstTurn: socket.id,
                winner: null,
                rematch: [],
                playWithBot: true
            };

            lobbies.set(roomId, lobby);
            socket.join(roomId);

            socket.emit('lobby_tic_tac_toe_created', lobby);
        });

        socket.on('join_tic_tac_toe_lobby', (roomId) => {
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

            io.to(roomId).emit('player_joined_tic_tac_toe', lobby);
            io.to(roomId).emit('game_start_tic_tac_toe', lobby);
        });

        socket.on('make_move', ({ roomId, index, username }) => {
            const lobby = lobbies.get(roomId);
            if (!lobby) return;
            if (lobby.players.length < 2) return;

            const currentUsername = socket.username || username;
            let player = lobby.players.find(p => p.username === currentUsername);

            if (player && player.id !== socket.id) {
                const oldId = player.id;
                player.id = socket.id;
                socket.join(roomId);
                socket.username = currentUsername;

                if (lobby.turn === oldId) {
                    lobby.turn = socket.id;
                }

                const otherPlayer = lobby.players.find(p => p.username !== currentUsername);
                if (otherPlayer && lobby.turn !== socket.id && lobby.turn !== otherPlayer.id && lobby.turn !== BOT_ID) {
                    const moveCount = lobby.board.filter(cell => cell !== null).length;
                    const firstPlayerSymbol = lobby.players[0].symbol;
                    const currentMoveSymbol = moveCount % 2 === 0 ? firstPlayerSymbol : (firstPlayerSymbol === 'X' ? 'O' : 'X');
                    const playerWithTurn = lobby.players.find(p => p.symbol === currentMoveSymbol);
                    if (playerWithTurn) {
                        lobby.turn = playerWithTurn.id;
                    }
                }

                io.to(roomId).emit('player_reconnected', lobby);
            }

            if (lobby.winner) return;

            const isOurTurn = (lobby.turn === socket.id);

            if (!isOurTurn) return;

            if (lobby.board[index] !== null) return;

            if (!player) player = lobby.players.find(p => p.id === socket.id);
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

                if (lobby.playWithBot && lobby.turn === BOT_ID) {
                    handleBotMove(io, roomId);
                }
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
                lobby.firstTurn = lobby.firstTurn === lobby.players[0].id ? lobby.players[1].id : lobby.players[0].id;
                lobby.turn = lobby.firstTurn;
                lobby.playWithBot = false;

                io.to(roomId).emit('game_reset', lobby);
            } else {
                io.to(roomId).emit('rematch_update', { rematch: lobby.rematch });
            }
        });

        socket.on('play_with_bot', (roomId) => {
            const lobby = lobbies.get(roomId);
            if (!lobby) return;

            lobby.players = [
                { id: socket.id, username: socket.username, symbol: 'X' },
                { id: BOT_ID, username: 'Bot', symbol: 'O' }
            ];
            lobby.board = Array(9).fill(null);
            lobby.winner = null;
            lobby.rematch = [];
            lobby.turn = socket.id;
            lobby.firstTurn = socket.id;
            lobby.playWithBot = true;

            io.to(roomId).emit('game_reset', lobby);
        });

        socket.on('leave_lobby', (roomId) => {
            const lobby = lobbies.get(roomId);
            if (!lobby) return;

            const playerIndex = lobby.players.findIndex(p => p.id === socket.id);
            if (playerIndex !== -1) {
                lobby.players.splice(playerIndex, 1);
                socket.leave(roomId);

                if (lobby.players.length === 0) {
                    lobbies.delete(roomId);
                } else {
                    io.to(roomId).emit('player_left', lobby);
                }
            }
        });

        socket.on('disconnect', (reason) => {
            for (const [roomId, lobby] of lobbies.entries()) {
                const playerIndex = lobby.players.findIndex(p => p.id === socket.id);
                if (playerIndex !== -1) {
                    if (lobby.playWithBot) {
                        continue;
                    }

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
