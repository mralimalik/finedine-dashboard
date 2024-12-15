import React, { useState, useContext } from "react";
import Select from "react-select";
import { ModifierContext } from "../../context/ModifierContext.jsx";
import { MenuContext } from "../../context/MenuContext.jsx";
const ItemModifierOptions = () => {
  const { allModifierData } = useContext(ModifierContext);
  const { modifiers, setModifiers } = useContext(MenuContext);

  // Map allModifierData to create options for the dropdown
  const modifierOptions = allModifierData.map((modifier) => ({
    value: modifier._id,
    label: modifier.groupName,
  }));

  return (
    <div>
      <p className="mb-3 text-xs">
        Items can have modifiers according to their sizes, servings, etc.
      </p>

      {modifiers.map((addedModifier, index) => (
        <div key={index} className="mb-3 flex items-center gap-3">
          <Select
            options={modifierOptions}
            placeholder="Select modifier"
            className="label-select text-sm w-48"
            classNamePrefix="select"
            value={modifierOptions.find(
              (option) => option.value === addedModifier.modifierId
            )}
            onChange={(selectedOption) => {
              const updatedModifiers = [...modifiers];
              updatedModifiers[index].modifierId =
                selectedOption?.value || null;
              setModifiers(updatedModifiers);
            }}
          />
          <input
            type="number"
            placeholder="Min"
            value={addedModifier.min}
            className="text-sm border rounded px-2 py-1 w-14"
            onChange={(e) => {
              const updatedModifiers = [...modifiers];
              updatedModifiers[index].min = parseInt(e.target.value, 10) || 0;
              setModifiers(updatedModifiers);
            }}
          />
          <input
            type="number"
            placeholder="Max"
            value={addedModifier.max}
            className="text-sm border rounded px-2 py-1 w-14"
            onChange={(e) => {
              const updatedModifiers = [...modifiers];
              updatedModifiers[index].max = parseInt(e.target.value, 10) || 0;
              setModifiers(updatedModifiers);
            }}
          />
          <label className="flex items-center text-sm">
            <input
              type="checkbox"
              checked={addedModifier.required}
              className="mr-2"
              onChange={(e) => {
                const updatedModifiers = [...modifiers];
                updatedModifiers[index].required = e.target.checked;
                setModifiers(updatedModifiers);
              }}
            />
            Required
          </label>
          <button
            className="text-red-500 text-sm"
            onClick={() => {
              setModifiers((prev) =>
                prev.filter((_, modIndex) => modIndex !== index)
              );
            }}
          >
            X
          </button>
        </div>
      ))}

      <button
        className="my-3 text-violet-500 text-sm"
        onClick={() =>
          setModifiers((prev) => [
            ...prev,
            {
              min: 0,
              max: 0,
              required: false,
              modifierId: null,
            },
          ])
        }
      >
        + Add modifier option
      </button>
    </div>
  );
};

export default ItemModifierOptions;
