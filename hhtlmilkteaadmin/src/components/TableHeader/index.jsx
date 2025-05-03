import {
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@material-ui/core";

const TableHeader = ({
  valueToOrderBy,
  valueToSortDir,
  handleRequestSort,
  fields,
}) => {
  const createSortHandler = (property) => (event) => {
    handleRequestSort(property);
  };

  return (
    <TableHead>
      <TableRow>
        {fields.map((field) => (
          <TableCell
            key={field.id}
            align="left"
            padding="default"
            sortDirection={valueToOrderBy === field.id ? valueToSortDir : false}
          >
            {!field.disableSorting ? (
              <TableSortLabel
                active={valueToOrderBy === field.id}
                direction={valueToOrderBy === field.id ? valueToSortDir : 'asc'}
                onClick={createSortHandler(field.id)}
              >
                {field.label}
              </TableSortLabel>
            ) : (
              field.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default TableHeader;
