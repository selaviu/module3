import React from 'react';
import PaginationMUI from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import useTheme from 'misc/hooks/useTheme';

const Pagination = ({ 
    count, 
    page, 
    onChange, 
    disabled = false 
    }) => {
    const { theme } = useTheme();

    return (
        <Stack spacing={2} sx={{ alignItems: 'center', my: 3 }}>
        <PaginationMUI
            count={count}
            page={page}
            onChange={onChange}
            disabled={disabled}
            variant="outlined"
            shape="rounded"
            sx={{
            '& .MuiPaginationItem-root': {
                color: theme.typography.color.primary,
                borderColor: theme.input?.color?.primary?.border || '#ccc',
                '&:hover': {
                backgroundColor: theme.menuItem?.color?.primary?.backgroundHovered || 'rgba(0,0,0,0.04)',
                },
                '&.Mui-selected': {
                backgroundColor: theme.menuItem?.color?.primary?.backgroundSelected || 'rgba(0,0,0,0.08)',
                fontWeight: 'bold',
                },
            },
            }}
        />
        </Stack>
    );
};

export default Pagination;