import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mountain, Newspaper, Scissors } from 'lucide-react';

const RockPaperScissorsPanel = ({ board, onMove, players }) => {
    const [activeIndex, setActiveIndex] = useState(null);

    const handleActiveIndex = (index) => {
        if (players.length < 2) return;
        setActiveIndex(index);
    };

    useEffect(() => {
        if (players.every(player => player.ready === false))
            setActiveIndex(null);
    }, [players]);

    return (
        <>
            <div className="board-container">
                {board.map((cell, index) => (
                    <Square
                        key={index}
                        value={index === 0 ? <Mountain /> : index === 1 ? <Scissors /> : <Newspaper />}
                        onClick={() => { handleActiveIndex(index); onMove(index) }}
                        disabled={activeIndex !== null}
                        isActive={activeIndex === index}
                    />
                ))}
            </div>
        </>
    );
};

const Square = ({ value, onClick, isActive, disabled }) => {
    return (
        <button
            onClick={onClick}
            className={`square ${isActive ? "active_RPS" : ""}`}
            disabled={disabled}
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
