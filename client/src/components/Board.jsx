import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Board = ({ board, onMove, myTurn, winner }) => {
    return (
        <div className="board-container">
            {board.map((cell, index) => (
                <Square
                    key={index}
                    value={cell}
                    onClick={() => !winner && myTurn && onMove(index)}
                    disabled={!!cell || !myTurn || !!winner}
                />
            ))}
        </div>
    );
};

const Square = ({ value, onClick, disabled }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`square ${!disabled ? "active" : ""}`}
            style={{
                color: value === 'X' ? 'var(--color-secondary)' : 'var(--color-primary)',
                textShadow: value === 'X'
                    ? '0 0 10px var(--color-secondary-glow)'
                    : '0 0 10px var(--color-primary-glow)'
            }}
        >
            <AnimatePresence>
                {value && (
                    <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        {value}
                    </motion.span>
                )}
            </AnimatePresence>
        </button>
    );
};

export default Board;
