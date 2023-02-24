import { Icon } from "@iconify/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFilters, usePagination, useSortBy, useTable } from "react-table";

export default function Table({
  columns,
  data,
  filterInput,
  filterColumn,
}: {
  columns: any;
  data: any;
  filterInput: string;
  filterColumn: string;
}) {
  const nav = useNavigate();

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    setFilter,
    nextPage,
    previousPage,
    canPreviousPage,
    canNextPage,
    pageOptions,
    state: { pageIndex, pageSize },
  } = useTable({ columns, data }, useFilters, useSortBy, usePagination);

  useEffect(() => {
    const value = filterInput || "";
    setFilter(filterColumn, value) 
  }, [filterInput])

  const rowClickHandler = (id : number) => {
    nav(id.toString());
  };

  return (
    <div className="fillTable">
      <table
        {...getTableProps()}
      >
        <thead>
          {headerGroups.map((headerGroup: any) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column: any) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  {column.render("Header")}{" "}
                  {column.isSorted
                    ? column.isSortedDesc
                      ? <Icon icon="ant-design:caret-down-filled"/>
                      : 
                        <Icon icon="ant-design:caret-up-filled" />
                    : ""}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row: any, i: number) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                onClick={() => rowClickHandler(row.original.id)}
                className="tableRow"
              >
                {row.cells.map((cell: any) => {
                  return (
                    <td {...cell.getCellProps()} className="p-3">
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="paginasiNav">
        <button
          disabled={!canPreviousPage}
          onClick={() => previousPage()}
          className={`${!canPreviousPage && "disableArrow"}`}
        >
          {<Icon icon="material-symbols:arrow-back-ios-new-rounded"/>}
        </button>
        <p>
          <span className="text-blue-700">{pageIndex + 1}</span> dari{" "}
          {pageOptions.length}
        </p>
        <button
          disabled={!canNextPage}
          onClick={() => nextPage()}
          className={`${!canNextPage && "disableArrow"}`}
        >
          {<Icon icon="material-symbols:arrow-forward-ios-rounded"/>}
        </button>
      </div>
    </div>
  );
}
