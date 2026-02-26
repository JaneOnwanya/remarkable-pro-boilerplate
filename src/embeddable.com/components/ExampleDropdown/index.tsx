// src/embeddable.com/components/ExampleDropdown/index.tsx
 
import React, { useState, useEffect, ChangeEvent } from "react";
import { Dimension, DataResponse } from "@embeddable.com/core";
 
type ChangeCallback = (chosen: string | null) => void;
 
type Props = {
  defaultValue: string;
  onChange: ChangeCallback;
  values: Dimension; // Expected: { name: string; title: string; }
  results: DataResponse; // Expected: { isLoading: boolean; error?: string; data?: Array<Record<string, string>> }
};
 
const NO_VALUE = 'NO_VALUE';
 
const DropdownSelect: React.FC<Props> = ({ defaultValue, onChange, results, values }) => {
  const { isLoading, data = [], error } = results;
  const [value, setValue] = useState<string>(defaultValue);
 
  // if a default value has been provided, use that.
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);
 
  // fire the onChange listener if user changes the selected value
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onChange(newValue === NO_VALUE ? null : newValue);
  };
 
  // show a loading indicator until we've retrieved the list of values to show from the database.
  if (isLoading) return <span> loading... </span>;
 
  // in case there's an error retrieving the list of values, show the error.
  if (error) return <span> Error! Message: {error} </span>;
 
  // use a standard HTML `select` input for the dropdown.
  return (
    <select value={value} onChange={handleChange}>
      <option value={NO_VALUE}>--no value--</option>
      {data.map((option, index) => (
        <option key={index} value={option[values.name]}>
          {option[values.name]}
        </option>
      ))}
    </select>
  );
};
 
export default DropdownSelect;