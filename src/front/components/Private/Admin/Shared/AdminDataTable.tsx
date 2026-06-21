"use client"

import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { useState } from "react"
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsUpDown, Search } from "lucide-react"
import { Button } from "@/front/components/ui/button"
import { Input } from "@/front/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/front/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/front/components/ui/table"

interface AdminDataTableProps<T> {
    data: T[]
    columns: ColumnDef<T>[]
    searchKey?: string
    searchPlaceholder?: string
    toolbar?: React.ReactNode
}

export function AdminDataTable<T>({
    data,
    columns,
    searchKey,
    searchPlaceholder = "Rechercher...",
    toolbar,
}: AdminDataTableProps<T>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: { sorting, columnFilters, columnVisibility, rowSelection },
        initialState: { pagination: { pageSize: 20 } },
    })

    return (
        <div className="flex flex-col gap-4 h-full">
            {/* Toolbar */}
            <div className="flex items-center gap-2 shrink-0">
                {searchKey && (
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
                        <Input
                            placeholder={searchPlaceholder}
                            value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
                            onChange={(e) => table.getColumn(searchKey)?.setFilterValue(e.target.value)}
                            className="pl-8 h-8 text-sm"
                        />
                    </div>
                )}
                <div className="flex items-center gap-2 ml-auto">
                    {toolbar}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                                Colonnes <ChevronDown className="size-3" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table.getAllColumns()
                                .filter((col) => col.getCanHide())
                                .map((col) => (
                                    <DropdownMenuCheckboxItem
                                        key={col.id}
                                        className="capitalize text-xs"
                                        checked={col.getIsVisible()}
                                        onCheckedChange={(v) => col.toggleVisibility(v)}
                                    >
                                        {col.id}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto rounded-md border border-border">
                <Table>
                    <TableHeader className="sticky top-0 bg-muted/50 backdrop-blur-sm z-10">
                        {table.getHeaderGroups().map((hg) => (
                            <TableRow key={hg.id} className="hover:bg-transparent border-border">
                                {hg.headers.map((header) => (
                                    <TableHead key={header.id} className="text-xs font-medium">
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="border-border hover:bg-muted/30 text-sm"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="py-2">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground text-sm">
                                    Aucun résultat
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between shrink-0 text-xs text-muted-foreground">
                <span>{table.getFilteredRowModel().rows.length} résultat(s)</span>
                <div className="flex items-center gap-1">
                    <Button
                        variant="outline" size="icon"
                        className="size-7"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft className="size-3.5" />
                    </Button>
                    <span className="px-2 text-xs">
                        Page {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
                    </span>
                    <Button
                        variant="outline" size="icon"
                        className="size-7"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRight className="size-3.5" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

// Sortable header helper
export function SortableHeader({ column, label }: { column: { toggleSorting: (desc?: boolean) => void; getIsSorted: () => string | false }, label: string }) {
    return (
        <button
            className="flex items-center gap-1 text-xs font-medium hover:text-foreground"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            {label}
            <ChevronsUpDown className="size-3 opacity-50" />
        </button>
    )
}
