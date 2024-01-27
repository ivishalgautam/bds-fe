import DataTable from "react-data-table-component";

export default function Table({ columns, data, isLoading }) {
  return (
    <DataTable
      columns={columns}
      data={data}
      pagination
      progressPending={isLoading}
    />
  );
}
