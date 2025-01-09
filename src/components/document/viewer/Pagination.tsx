import React from 'react';
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, onPageChange }: PaginationProps) => {
  return (
    <div className="flex items-center gap-4 mt-4">
      <Button
        variant="outline"
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      <span>Page {currentPage}</span>
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;