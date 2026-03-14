"use client";
"use no memo";

import Link from "next/link";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatScheduleLabel } from "@/lib/utils";

type AppointmentRow = {
  id: string;
  patientName: string;
  appointmentType: string;
  scheduledStart: string;
  status: string;
};

export function AppointmentsTable({ rows }: { rows: AppointmentRow[] }) {
  const columns = useMemo<ColumnDef<AppointmentRow>[]>(
    () => [
      {
        accessorKey: "patientName",
        header: "Patient",
        cell: ({ row }) => <Link className="font-medium text-[var(--foreground)] hover:opacity-70" href={`/appointments/${row.original.id}`}>{row.original.patientName}</Link>,
      },
      { accessorKey: "appointmentType", header: "Visit type" },
      {
        accessorKey: "scheduledStart",
        header: "Scheduled",
        cell: ({ getValue }) => formatScheduleLabel(getValue<string>()),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => {
          const value = getValue<string>();
          const variant = value === "completed" ? "success" : value === "scheduled" ? "info" : value === "confirmed" ? "neutral" : "warning";
          return <Badge variant={variant}>{value}</Badge>;
        },
      },
    ],
    []
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}







