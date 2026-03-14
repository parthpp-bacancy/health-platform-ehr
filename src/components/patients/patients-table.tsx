"use client";
"use no memo";

import Link from "next/link";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatScheduleLabel } from "@/lib/utils";

type PatientRow = {
  id: string;
  mrn: string;
  name: string;
  intakeStatus: string;
  provider: string;
  latestAppointment?: string;
};

export function PatientsTable({ rows }: { rows: PatientRow[] }) {
  const columns = useMemo<ColumnDef<PatientRow>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Patient",
        cell: ({ row }) => <Link className="font-medium text-[var(--foreground)] hover:opacity-70" href={`/patients/${row.original.id}`}>{row.original.name}</Link>,
      },
      { accessorKey: "mrn", header: "MRN" },
      {
        accessorKey: "intakeStatus",
        header: "Intake",
        cell: ({ getValue }) => <Badge variant={getValue<string>() === "completed" ? "success" : "warning"}>{getValue<string>()}</Badge>,
      },
      { accessorKey: "provider", header: "Primary provider" },
      {
        accessorKey: "latestAppointment",
        header: "Latest appointment",
        cell: ({ getValue }) => {
          const value = getValue<string | undefined>();
          return value ? formatScheduleLabel(value) : "No visit";
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







