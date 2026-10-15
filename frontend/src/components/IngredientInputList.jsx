import React from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';

const COMMON_UNITS = [
  '',
  'tbsp',
  'tsp',
  'cup',
  'cups',
  'grams',
  'kg',
  'oz',
  'lbs',
  'ml',
  'liters',
  'cloves',
  'pinch',
  'slices',
  'pieces',
  'whole',
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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-bold text-stone-800">
            Ingredients <span className="text-rose-500">*</span>
          </label>
          <p className="text-xs text-stone-500">
            Specify the ingredient name, quantity, and unit of measurement.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 px-3 py-1.5 rounded-lg text-xs font-semibold border border-brand-200 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Ingredient</span>
        </button>
      </div>

      <div className="space-y-2.5">
        {ingredients.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-200 group hover:border-brand-300 transition"
          >
            <div className="text-stone-300 group-hover:text-stone-500 cursor-grab shrink-0">
              <GripVertical className="w-4 h-4" />
            </div>

            {/* Ingredient Name (e.g. Minced Garlic) */}
            <input
              type="text"
              placeholder="e.g. Garlic cloves"
              value={item.name}
              onChange={(e) => handleItemChange(index, 'name', e.target.value)}
              className="flex-1 bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            />

            {/* Amount (e.g. 2 or 1/2) */}
            <input
              type="text"
              placeholder="Amount (e.g. 4)"
              value={item.amount}
              onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
              className="w-24 bg-white border border-stone-200 rounded-lg px-2.5 py-2 text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />

            {/* Unit (e.g. tbsp, cups, minced) */}
            <div className="w-28 relative">
              <input
                type="text"
                list={`units-list-${index}`}
                placeholder="Unit"
                value={item.unit}
                onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-2 text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <datalist id={`units-list-${index}`}>
                {COMMON_UNITS.map((u) => (
                  <option key={u} value={u} />
                ))}
              </datalist>
            </div>

            {/* Remove item button */}
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="p-2 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
              title="Remove ingredient"
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
