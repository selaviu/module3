import React from 'react';
import SelectMui from '@mui/material/Select';

const variants = {
  standard: 'standard',
  outlined: 'outlined',
};

const sizes = {
  medium: 'medium',
  small: 'small',
};

const Select = ({
  disabled = false,
  disableUnderline = false,
  displayEmpty = true,
  children,
  fullHeight = true,
  fullWidth = false,
  multiple = false,
  onChange,
  renderValue,
  size = sizes.medium,
  value,
  variant = variants.standard,
}) => {
  return (
    <SelectMui
      disabled={disabled}
      disableUnderline={disableUnderline}
      displayEmpty = {displayEmpty}
      fullWidth={fullWidth}
      MenuProps={{
        PaperProps: {
          sx: { maxHeight: fullHeight ? '100%' : '300px' },
        },
      }}
      multiple={multiple}
      onChange={onChange}
      renderValue={renderValue}
      sx={{
        '.MuiSelect-select': {
          alignItems: 'center',
          display: 'flex',
          width: '100px'
        },
      }}
      size={size}
      value={value}
      variant={variant}
    >
      {children}
    </SelectMui>
  );
};

export default Select;
