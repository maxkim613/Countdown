// CmDropdown.jsx
import React from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const CmDropdown = ({ label, value, setValue, options, width = '200px', height = '40px' }) => {
  return (
    <FormControl sx={{ width, height }} size="small">
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        label={label}
        onChange={(e) => setValue(e.target.value)}
      >
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CmDropdown;
