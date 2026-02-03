import React from 'react';
import SvgIcon from '../SvgIcon';
import useTheme from 'misc/hooks/useTheme';

const EditIcon = ({
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
            d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
        />
        </SvgIcon>
    );
};

export default EditIcon;