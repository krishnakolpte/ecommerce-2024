/** @format */
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    getPaginationRowModel,
    getSortedRowModel,
} from "@tanstack/react-table";
import { useState } from "react";
import {
    AiOutlineSortAscending,
    AiOutlineSortDescending,
} from "react-icons/ai";

const Table = ({
    data,
    columns,
    containerClassname,
    heading,
    pagination = false,
}) => {
    const [sorting, setSorting] = useState([]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting: sorting,
        },
        onSortingChange: setSorting,
    });

    return (
        <div className={containerClassname}>
            <h2 className="heading">{heading}</h2>
            <table className="table">
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    onClick={header.column.getToggleSortingHandler()}>
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                    {
                                        {
                                            asc: (
                                                <span>
                                                    {" "}
                                                    <AiOutlineSortAscending />
                                                </span>
                                            ),
                                            desc: (
                                                <span>
                                                    {" "}
                                                    <AiOutlineSortDescending />
                                                </span>
                                            ),
                                        }[header.column.getIsSorted() ?? null]
                                    }
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id}>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {pagination && (
                <div className="tablePagination">
                    <button
                        disabled={!table.getCanPreviousPage()}
                        onClick={() => table.setPageIndex(0)}>
                        First page
                    </button>
                    <button
                        disabled={!table.getCanPreviousPage()}
                        onClick={() => table.previousPage()}>
                        Prev
                    </button>
                    <span>{`${
                        table.getState().pagination.pageIndex + 1
                    } of ${table.getPageCount()}`}</span>
                    <button
                        disabled={!table.getCanNextPage()}
                        onClick={() => table.nextPage()}>
                        Next
                    </button>
                    <button
                        disabled={!table.getCanNextPage()}
                        onClick={() =>
                            table.setPageIndex(table.getPageCount() - 1)
                        }>
                        Last page
                    </button>
                </div>
            )}
        </div>
    );
};

export default Table;
