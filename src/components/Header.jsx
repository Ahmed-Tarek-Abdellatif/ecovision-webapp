import React from "react";

const HeaderComponent = ({ position, text, color }) => {
    const fontSize = "24px";

    return (
        <h1 style={{ textAlign: position, color, fontSize }}>
            {text}
        </h1>
    );
};

export default HeaderComponent;