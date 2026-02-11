import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mountain, Newspaper, Scissors, Loader } from 'lucide-react';

const RockPaperScissorsPanel = ({ board, onMove }) => {
    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem' }}>
                <Square value={<Loader />} disabled={true} />
            </div>
            <div className="board-container">
                {board.map((cell, index) => (
                    <Square
                        key={index}
                        value={index === 0 ? <Mountain /> : index === 1 ? <Scissors /> : <Newspaper />}
                        onClick={() => onMove(index)}
                        disabled={false}
                    />
                ))}
            </div>
        </>
    );
};

const Square = ({ value, onClick, disabled }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`square ${!disabled ? "" : "loader"}`}
            style={{
                color: 'var(--color-secondary)',
                textShadow: '0 0 10px var(--color-secondary-glow)'
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

export default RockPaperScissorsPanel;
