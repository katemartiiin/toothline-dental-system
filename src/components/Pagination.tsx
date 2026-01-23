import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

type PageOptions = {
  totalElements: number;
  first: boolean;
  last: boolean;
  number?: number;
  totalPages?: number;
};

type PaginationFilters = {
  size: number;
};

type PaginationProps = {
  pageOptions: PageOptions;
  filters: PaginationFilters;
  onFilterChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onPageChange: (direction: 'prev' | 'next') => void;
};

const Pagination: React.FC<PaginationProps> = ({
  pageOptions,
  filters,
  onFilterChange,
  onPageChange,
}) => {
  const currentPage = pageOptions.number ?? 0;
  const totalPages = pageOptions.totalPages ?? 1;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full flex flex-wrap items-center justify-between bg-white 
                 border border-gray-100 rounded-xl p-4 mt-4 shadow-sm"
    >
      {/* Left side - showing info */}
      <div className="flex items-center space-x-4 text-sm text-gray-500">
        <span className="flex items-center gap-2">
          <span className="px-2 py-1 bg-teal-50 text-teal-700 rounded-lg font-medium">
            {pageOptions.totalElements}
          </span>
          <span>total entries</span>
        </span>

        {totalPages > 0 && (
          <span className="hidden md:inline text-gray-400">
            Page {currentPage + 1} of {totalPages}
          </span>
        )}
      </div>

      {/* Right side - controls */}
      <div className="flex items-center space-x-4">
        {/* Page size selector */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Show</span>
          <select
            id="size"
            name="size"
            value={filters.size}
            onChange={onFilterChange}
            className="px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl
                       focus:bg-white focus:border-teal-300 focus:ring-2 focus:ring-teal-100 
                       transition-all duration-200 outline-none cursor-pointer"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center space-x-1">
          {/* First page button */}
          <motion.button
            type="button"
            onClick={() => onPageChange('prev')}
            disabled={pageOptions.first}
            className={`
              p-2 rounded-lg transition-all duration-200
              ${pageOptions.first 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-gray-500 hover:text-teal-600 hover:bg-teal-50'
              }
            `}
            whileHover={!pageOptions.first ? { scale: 1.1 } : {}}
            whileTap={!pageOptions.first ? { scale: 0.95 } : {}}
            title="Previous page"
          >
            <ChevronLeft size={20} />
          </motion.button>

          {/* Page indicator pills */}
          <div className="hidden md:flex items-center space-x-1 px-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum = i;
              if (totalPages > 5) {
                const start = Math.max(0, Math.min(currentPage - 2, totalPages - 5));
                pageNum = start + i;
              }
              return (
                <motion.span
                  key={pageNum}
                  className={`
                    w-8 h-8 flex items-center justify-center text-sm rounded-lg
                    transition-all duration-200
                    ${pageNum === currentPage 
                      ? 'toothline-primary text-white font-semibold' 
                      : 'text-gray-500 hover:bg-gray-100'
                    }
                  `}
                  whileHover={{ scale: 1.1 }}
                >
                  {pageNum + 1}
                </motion.span>
              );
            })}
          </div>

          {/* Next page button */}
          <motion.button
            type="button"
            onClick={() => onPageChange('next')}
            disabled={pageOptions.last}
            className={`
              p-2 rounded-lg transition-all duration-200
              ${pageOptions.last 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-gray-500 hover:text-teal-600 hover:bg-teal-50'
              }
            `}
            whileHover={!pageOptions.last ? { scale: 1.1 } : {}}
            whileTap={!pageOptions.last ? { scale: 0.95 } : {}}
            title="Next page"
          >
            <ChevronRight size={20} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default Pagination;
