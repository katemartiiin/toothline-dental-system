import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

type PageOptions = {
  totalElements: number;
  first: boolean;
  last: boolean;
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
  return (
    <div className="w-full flex justify-end toothline-bg-light border border-gray-200 p-3 my-1 text-sm space-x-7">
      <span className="my-auto">{pageOptions.totalElements} total entries</span>

      <div>
        <span className="my-auto mx-2">Show</span>
        <select
          id="size"
          name="size"
          value={filters.size}
          onChange={onFilterChange}
          className="rounded-md text-sm"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
      </div>

      <button
        type="button"
        onClick={() => onPageChange('prev')}
        disabled={pageOptions.first}
        className={`flex p-1 ${
          pageOptions.first ? 'text-gray-400' : 'hover:toothline-text-primary'
        }`}
      >
        <ArrowLeft size={25} className="my-auto" />
        <span className="mx-1 my-auto">Previous</span>
      </button>

      <button
        type="button"
        onClick={() => onPageChange('next')}
        disabled={pageOptions.last}
        className={`flex p-1 ${
          pageOptions.last ? 'text-gray-400' : 'hover:toothline-text-primary'
        }`}
      >
        <span className="mx-1 my-auto">Next</span>
        <ArrowRight size={25} className="my-auto" />
      </button>
    </div>
  );
};

export default Pagination;
