import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    itemsPerPage = 10,
    onItemsPerPageChange
}) => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    // Calculate which page numbers to show
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    if (totalPages === 0) return null;

    return (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
            {/* Items per page selector */}
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show:</span>
                <select
                    value={itemsPerPage}
                    onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                    className="select select-bordered select-sm"
                >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>
                <span className="text-sm text-gray-600">per page</span>
            </div>

            {/* Pagination controls */}
            <div className="join">
                {/* Previous button */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="join-item btn btn-sm"
                >
                    <FaChevronLeft />
                </button>

                {/* First page */}
                {startPage > 1 && (
                    <>
                        <button
                            onClick={() => onPageChange(1)}
                            className="join-item btn btn-sm"
                        >
                            1
                        </button>
                        {startPage > 2 && (
                            <button className="join-item btn btn-sm btn-disabled">...</button>
                        )}
                    </>
                )}

                {/* Page numbers */}
                {pageNumbers.map((number) => (
                    <button
                        key={number}
                        onClick={() => onPageChange(number)}
                        className={`join-item btn btn-sm ${currentPage === number ? 'btn-primary' : ''
                            }`}
                    >
                        {number}
                    </button>
                ))}

                {/* Last page */}
                {endPage < totalPages && (
                    <>
                        {endPage < totalPages - 1 && (
                            <button className="join-item btn btn-sm btn-disabled">...</button>
                        )}
                        <button
                            onClick={() => onPageChange(totalPages)}
                            className="join-item btn btn-sm"
                        >
                            {totalPages}
                        </button>
                    </>
                )}

                {/* Next button */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="join-item btn btn-sm"
                >
                    <FaChevronRight />
                </button>
            </div>

            {/* Page info */}
            <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
            </div>
        </div>
    );
};

export default Pagination;
