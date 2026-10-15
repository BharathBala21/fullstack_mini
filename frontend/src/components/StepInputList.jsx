import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const StepInputList = ({ steps, onChange }) => {
  const handleInstructionChange = (index, value) => {
    const updated = steps.map((s, i) => {
      if (i === index) {
        return { ...s, instruction: value };
      }
      return s;
    });
    onChange(updated);
  };

  const handleAdd = () => {
    const nextNumber = steps.length + 1;
    onChange([...steps, { stepNumber: nextNumber, instruction: '' }]);
  };

  const handleRemove = (index) => {
    if (steps.length <= 1) {
      onChange([{ stepNumber: 1, instruction: '' }]);
      return;
    }
    const filtered = steps.filter((_, i) => i !== index);
    const renumbered = filtered.map((s, i) => ({ ...s, stepNumber: i + 1 }));
    onChange(renumbered);
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-stone-700">
          Preparation Steps
        </label>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1 text-stone-700 hover:text-stone-900 text-xs font-medium px-2 py-1 rounded hover:bg-stone-100 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add step</span>
        </button>
      </div>

      <div className="space-y-2">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start gap-2.5">
            <span className="w-6 h-6 rounded bg-stone-100 text-stone-600 flex items-center justify-center font-semibold text-xs shrink-0 mt-1">
              {step.stepNumber || index + 1}
            </span>

            <textarea
              rows={2}
              placeholder={`Step ${index + 1} instructions...`}
              value={step.instruction}
              onChange={(e) => handleInstructionChange(index, e.target.value)}
              className="flex-1 bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white resize-none leading-relaxed"
              required
            />

            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="p-1.5 text-stone-400 hover:text-stone-600 rounded transition mt-1"
              title="Remove step"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepInputList;
