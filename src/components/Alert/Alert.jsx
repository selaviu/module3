import React from 'react';
import { createUseStyles } from 'react-jss';
import useTheme from 'misc/hooks/useTheme';
import Typography from 'components/Typography';

const getClasses = createUseStyles(theme => ({
    alert: {
        display: 'flex',
        alignItems: 'center',
        padding: `${theme.spacing(1.5)}px ${theme.spacing(2)}px`,
        borderRadius: '8px',
        width: '100%',
        marginBottom: `${theme.spacing(2)}px`,
        backgroundColor: props => props.severity === 'error' 
        ? '#fdeded' 
        : '#edf7ed',
        border: props => props.severity === 'error' 
        ? '1px solid #f5c2c7' 
        : '1px solid #badbcc',
    },
}));

function Alert({ children, severity = 'success' }) {
    const { theme } = useTheme();
    const classes = getClasses({ theme, severity });

    return (
        <div className={classes.alert}>
        <Typography color={severity === 'error' ? 'error' : 'default'}>
            {children}
        </Typography>
        </div>
    );
}

export default Alert;