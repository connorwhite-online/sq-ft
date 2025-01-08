import React from 'react';

export default function SplitText({ children, className }) {
    const text = String(children);
    console.log('Text being split:', text);
    console.log('Characters after split:', text.split(''));
    
    return (
        <span className="splitText">
            {text.split('').map((char, i) => (
                <span key={i} className={className || "char"}>
                    {char === ' ' ? '\u00A0' : char}
                </span>
            ))}
        </span>
    );
} 