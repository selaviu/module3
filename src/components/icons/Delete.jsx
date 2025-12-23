import React from 'react';
import SvgIcon from '../SvgIcon';
import useTheme from 'misc/hooks/useTheme';

const DeleteIcon = ({
    color = 'default', 
    size = 32,
    }) => {
    const { theme } = useTheme();
    
    const actualColor = theme.icon.color[color] || color;

    return (
        <SvgIcon
        style={{
            height: `${size}px`,
            width: `${size}px`,
        }}
        viewBox="0 0 24 24"
        >
        <path
            fill={actualColor}
            d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
        />
        </SvgIcon>
    );
};

export default DeleteIcon;