import React from "react";
import { Autocomplete, TextField } from "@mui/material";

const FreeSoloInput = ({
  label,
  options = [],
  value,
  onChange,
  isFetching,
  formatMessage,
}) => {
  const selectedOption =
    options.find((opt) => opt.id === value) || value || null;

  return (
    <Autocomplete
      freeSolo
      loading={isFetching}
      options={options}
      getOptionLabel={(option) => {
        if (typeof option === "string") return option;
        return option.name || "";
      }}
      isOptionEqualToValue={(option, val) => {
        if (typeof val === "string") return option.name === val;
        return option.id === (val?.id || val);
      }}
      value={selectedOption}
      onChange={(event, newValue) => {
        if (typeof newValue === "string") {
          onChange(newValue);
        } else if (newValue && newValue.id) {
          onChange(newValue.id);
        } else {
          onChange("");
        }
      }}
      onInputChange={(event, newInputValue, reason) => {
        if (reason === "input") {
          onChange(newInputValue);
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={` ${formatMessage({ id: "songDetails.label.choose" })} ${label.toLowerCase()}`}
        />
      )}
    />
  );
};

export default FreeSoloInput;
