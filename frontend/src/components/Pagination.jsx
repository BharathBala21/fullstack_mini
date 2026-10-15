import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ page, pages, total, onPageChange }) => {
  if (pages <= 1) return null;

  const pageNumbers = [];
  for (let i = 1; i <= pages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-6 border-t border-stone-200">
      <div className="text-xs text-stone-500 font-medium">
        Showing page <span className="font-bold text-stone-800">{page}</span> of{' '}
        <span className="font-bold text-stone-800">{pages}</span> ({total} recipes total)
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="flex items-center gap-1 px-3 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <div className="flex items-center gap-1">
          {pageNumbers.map((num) => {
            const isActive = num === page;
            return (
              <button
                key={num}
                onClick={() => onPageChange(num)}
                className={`w-9 h-9 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-sm'
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
          className="flex items-center gap-1 px-3 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
