import React from "react";
import { Pagination } from "react-bootstrap";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "bootstrap/dist/css/bootstrap.css";

function BootyPagination({
  totalItems, // Total number of items
  itemsPerPage, // Items per page
  currentPage, // Current page
  onPageChange, // Function to handle page changes
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const createPaginationItem = (i) => {
    return (
      <Pagination.Item
        key={i}
        active={i === currentPage}
        onClick={() => onPageChange(i)}
      >
        {i}
      </Pagination.Item>
    );
  };

  const paginationItems = [];

  // "Go to First" Button
  paginationItems.push(
    <Pagination.First
      key="first"
      onClick={() => onPageChange(1)}
      disabled={currentPage === 1}
    />
  );

  paginationItems.push(
    <Pagination.Prev
      key="prev"
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
    />
  );

  paginationItems.push(<Pagination.Ellipsis key="ellipsis1" />);

  const maxMiddleBoxes = 5; // Maximum number of middle boxes
  const middleBoxCount = Math.min(maxMiddleBoxes, totalPages - 2); // Exclude the first and last pages

  const halfMiddleBoxCount = Math.floor(middleBoxCount / 2);
  let startMiddle = currentPage - halfMiddleBoxCount;
  let endMiddle = currentPage + halfMiddleBoxCount;

  if (startMiddle < 2) {
    startMiddle = 2;
    endMiddle = startMiddle + middleBoxCount - 1;
  }

  if (endMiddle > totalPages - 1) {
    endMiddle = totalPages - 1;
    startMiddle = endMiddle - middleBoxCount + 1;
  }

  for (let i = startMiddle; i <= endMiddle; i++) {
    paginationItems.push(createPaginationItem(i));
  }

  paginationItems.push(<Pagination.Ellipsis key="ellipsis2" />);

  paginationItems.push(
    <Pagination.Next
      key="next"
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
    />
  );

  // "Go to Last" Button
  paginationItems.push(
    <Pagination.Last
      key="last"
      onClick={() => onPageChange(totalPages)}
      disabled={currentPage === totalPages}
    />
  );

  return (
    <div className="flex justify-center items-center p-4 w-full">
      <Pagination className="paginationInfo">{paginationItems}</Pagination>
    </div>
  );
}

export default BootyPagination;
