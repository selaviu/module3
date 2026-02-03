import React, { useState } from "react";
import {
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useSelector } from "react-redux";

const GenreSelect = ({ selectedGenres, onChange, formatMessage }) => {
  const categories = useSelector((state) => state.categories.list);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    onChange(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <FormControl sx={{ m: 1, width: 300 }}>
      <InputLabel id="genre-multiple-checkbox-label">
        {formatMessage({ id: "songDetails.label.genres" })}
      </InputLabel>
      <Select
        labelId="genre-multiple-checkbox-label"
        multiple
        value={selectedGenres}
        onChange={handleChange}
        input={<OutlinedInput label="Жанри" />}
        renderValue={(selected) => {
          const selectedNames = categories
            .filter((cat) => selected.includes(cat.id))
            .map((cat) => cat.name);
          return selectedNames.join(", ");
        }}
      >
        {categories.map((category) => (
          <MenuItem key={category.id} value={category.id}>
            <Checkbox checked={selectedGenres.indexOf(category.id) > -1} />
            <ListItemText primary={category.name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default GenreSelect;
