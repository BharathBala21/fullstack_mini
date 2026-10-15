import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const COMMON_UNITS = [
  '',
  'tbsp',
  'tsp',
  'cup',
  'cups',
  'g',
  'kg',
  'oz',
  'lbs',
  'ml',
  'cloves',
  'pinch',
  'slices',
  'pieces',
];

const IngredientInputList = ({ ingredients, onChange }) => {
  const handleItemChange = (index, field, value) => {
    const updated = ingredients.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    onChange(updated);
  };

  const handleAdd = () => {
    onChange([...ingredients, { name: '', amount: '', unit: '' }]);
  };

  const handleRemove = (index) => {
    if (ingredients.length <= 1) {
      onChange([{ name: '', amount: '', unit: '' }]);
      return;
    }
    onChange(ingredients.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-stone-700">
          Ingredients
        </label>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1 text-stone-700 hover:text-stone-900 text-xs font-medium px-2 py-1 rounded hover:bg-stone-100 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add ingredient</span>
        </button>
      </div>

      <div className="space-y-2">
        {ingredients.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Ingredient name (e.g. Flour)"
              value={item.name}
              onChange={(e) => handleItemChange(index, 'name', e.target.value)}
              className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white"
              required
            />

            <input
              type="text"
              placeholder="Amount"
              value={item.amount}
              onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
              className="w-20 bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white"
            />

            <div className="w-24">
              <input
                type="text"
                list={`units-${index}`}
                placeholder="Unit"
                value={item.unit}
                onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white"
              />
              <datalist id={`units-${index}`}>
                {COMMON_UNITS.map((u) => (
                  <option key={u} value={u} />
                ))}
              </datalist>
            </div>

            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="p-1.5 text-stone-400 hover:text-stone-600 rounded transition"
              title="Remove"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IngredientInputList;
