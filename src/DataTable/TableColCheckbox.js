import React from 'react';
import styled from 'styled-components';
import { useTableContext } from './DataTableContext';
import { CellBase } from './Cell';
import Checkbox from './Checkbox';

const TableColStyle = styled(CellBase)`
  flex: 0 0 48px;
  user-select: none;
  white-space: nowrap;
  font-size: ${props => props.theme.header.fontSize};
  color: ${props => props.theme.header.fontColor};
`;

const TableCol = () => {
  const { dispatch, data, selectedRows, allSelected, selectableRowsComponent, selectableRowsComponentProps, selectableRowDisabled } = useTableContext();
  const indeterminate = selectedRows.length > 0 && !allSelected;
  const rows = selectableRowDisabled ? data.filter(row => !selectableRowDisabled(row)) : data;
  const isDisabled = rows.length === 0;
  const handleSelectAll = () => dispatch({ type: 'SELECT_ALL_ROWS', rows });

  return (
    <TableColStyle className="rdt_TableCol">
      <Checkbox
        name="select-all-rows"
        component={selectableRowsComponent}
        componentOptions={selectableRowsComponentProps}
        onClick={handleSelectAll}
        checked={allSelected}
        indeterminate={indeterminate}
        disabled={isDisabled}
      />
    </TableColStyle>
  );
};

export default TableCol;
