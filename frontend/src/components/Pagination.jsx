import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ page, pages, total, onPageChange }) => {
  if (pages <= 1) return null;

  const pageNumbers = [];
  for (let i = 1; i <= pages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-stone-200">
      <div className="text-xs text-stone-500">
        Page {page} of {pages} ({total} recipes)
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs font-medium text-stone-700 bg-white hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Prev</span>
        </button>

        <div className="flex items-center gap-1">
          {pageNumbers.map((num) => {
            const isActive = num === page;
            return (
              <button
                key={num}
                onClick={() => onPageChange(num)}
                className={`w-7 h-7 rounded-lg text-xs font-medium transition ${
                  isActive
                    ? 'bg-stone-900 text-white'
                    : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                {num}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs font-medium text-stone-700 bg-white hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
