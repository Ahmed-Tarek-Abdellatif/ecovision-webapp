import React from "react";

const TextComponent = ({ text, color, position, fontSize }) => {
    return (
        <p style={{ fontSize, color, textAlign: position }}>
            {text}
        </p>
    );
};

export default TextComponent;