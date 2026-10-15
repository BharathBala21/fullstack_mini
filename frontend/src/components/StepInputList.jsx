import React from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

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
    // Renumber sequentially
    const renumbered = filtered.map((s, i) => ({ ...s, stepNumber: i + 1 }));
    onChange(renumbered);
  };

  const handleMove = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= steps.length) return;
    const reordered = [...steps];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    // Renumber sequentially
    const renumbered = reordered.map((s, i) => ({ ...s, stepNumber: i + 1 }));
    onChange(renumbered);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-bold text-stone-800">
            Preparation Steps <span className="text-rose-500">*</span>
          </label>
          <p className="text-xs text-stone-500">
            Provide ordered step-by-step instructions for cooking this dish.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 px-3 py-1.5 rounded-lg text-xs font-semibold border border-brand-200 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Step</span>
        </button>
      </div>

      <div className="space-y-3">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex items-start gap-3 bg-stone-50 p-3.5 rounded-xl border border-stone-200 group hover:border-brand-300 transition"
          >
            {/* Step badge */}
            <div className="w-7 h-7 rounded-lg bg-stone-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              {step.stepNumber || index + 1}
            </div>

            {/* Instruction Textarea */}
            <textarea
              rows={2}
              placeholder={`Step ${index + 1}: Describe the action (e.g. Sauté garlic until fragrant)...`}
              value={step.instruction}
              onChange={(e) => handleInstructionChange(index, e.target.value)}
              className="flex-1 bg-white border border-stone-200 rounded-lg p-2.5 text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none leading-relaxed"
              required
            />

            {/* Action buttons (Reorder and Remove) */}
            <div className="flex flex-col gap-1 shrink-0">
              <button
                type="button"
                onClick={() => handleMove(index, -1)}
                disabled={index === 0}
                className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-20 transition"
                title="Move up"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleMove(index, 1)}
                disabled={index === steps.length - 1}
                className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-20 transition"
                title="Move down"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="p-1 text-stone-400 hover:text-rose-600 rounded hover:bg-rose-50 transition"
                title="Remove step"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepInputList;
