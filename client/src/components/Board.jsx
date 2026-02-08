import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Board = ({ board, onMove, myTurn, winner }) => {
    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '10px',
                background: '#334155',
                padding: '10px',
                borderRadius: 'var(--radius-md)',
                width: 'fit-content',
                margin: '0 auto',
                boxShadow: '0 0 30px rgba(0,0,0,0.5)'
            }}
        >
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
            style={{
                width: '80px',
                height: '80px',
                fontSize: '2.5rem',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--color-surface)',
                border: 'none',
                borderRadius: '8px',
                cursor: disabled ? 'default' : 'pointer',
                color: value === 'X' ? 'var(--color-secondary)' : 'var(--color-primary)',
                textShadow: value === 'X'
                    ? '0 0 10px var(--color-secondary-glow)'
                    : '0 0 10px var(--color-primary-glow)',
                transition: 'background 0.2s',
            }}
            className={!disabled ? "hover:bg-slate-700" : ""}
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
