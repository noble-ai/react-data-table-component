import React, { memo, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import TableCell from './TableCell';
import TableCellCheckbox from './TableCellCheckbox';
import TableCellExpander from './TableCellExpander';
import ExpanderRow from './ExpanderRow';
import { getConditionalStyle } from './util';

const STOP_PROP_TAG = '___react-data-table-allow-propagation___';

const defaultRowsCSS = css`
  &:not(:first-child) {
    border-top-style: ${props => props.theme.rows.borderStyle};
    border-top-width: ${props => props.theme.rows.borderWidth};
    border-top-color: ${props => props.theme.rows.borderColor};
  }
`;

const spacedRowsCSS = css`
  margin-top: ${props => props.theme.rows.spacingMargin || 0};
  margin-bottom: ${props => props.theme.rows.spacingMargin || 0};
  border-radius: ${props => props.theme.rows.spacingBorderRadius || 0};
  border-style: ${props => props.theme.rows.borderStyle};
  border-width: ${props => props.theme.rows.borderWidth};
  border-color: ${props => props.theme.rows.borderColor};
  ${props => props.theme.rows.spacingShadow && `box-shadow: ${props.theme.rows.spacingShadow}`};
`;

const stripedCSS = css`
  &:nth-child(odd) {
    background-color: ${props => props.theme.rows.stripedColor};
  }
`;

const highlightCSS = css`
  &:hover {
    color: ${props => props.theme.rows.hoverFontColor};
    background-color: ${props => props.theme.rows.hoverBackgroundColor};
    transition-duration: 0.15s;
    transition-property: background-color;
  }
`;

const pointerCSS = css`
  &:hover {
    cursor: pointer;
  }
`;

const TableRowStyle = styled.div`
  display: flex;
  align-items: stretch;
  align-content: stretch;
  width: 100%;
  box-sizing: border-box;
  min-height: ${props => (props.dense ? props.theme.rows.denseHeight : props.theme.rows.height)};
  ${props => (props.theme.rows.spacing === 'spaced' ? spacedRowsCSS : defaultRowsCSS)};
  background-color: ${props => props.theme.rows.backgroundColor};
  color: ${props => props.theme.rows.fontColor};
  ${props => props.striped && stripedCSS};
  ${props => props.highlightOnHover && highlightCSS};
  ${props => props.pointerOnHover && pointerCSS};
  ${props => props.extendedRowStyle};
`;

const TableRow = memo(({
  id,
  keyField,
  columns,
  row,
  onRowClicked,
  onRowDoubleClicked,
  selectableRows,
  expandableRows,
  striped,
  highlightOnHover,
  pointerOnHover,
  dense,
  expandableRowsComponent,
  defaultExpanderDisabled,
  defaultExpanded,
  expandOnRowClicked,
  expandOnRowDoubleClicked,
  conditionalRowStyles,
  onRowExpandToggled,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const handleExpanded = useCallback(() => {
    setExpanded(!expanded);
    onRowExpandToggled(!expanded, row);
  }, [expanded, onRowExpandToggled, row]);

  const showPointer = pointerOnHover || (expandableRows && (expandOnRowClicked || expandOnRowDoubleClicked));

  const handleRowClick = useCallback(e => {
    // use event delegation allow events to propagate only when the element with data-tag ___react-data-table-allow-propagation___ is present
    if (e.target && e.target.getAttribute('data-tag') === STOP_PROP_TAG) {
      onRowClicked(row, e);

      if (!defaultExpanderDisabled && expandableRows && expandOnRowClicked) {
        handleExpanded();
      }
    }
  }, [defaultExpanderDisabled, expandOnRowClicked, expandableRows, handleExpanded, onRowClicked, row]);

  const handleRowDoubleClick = useCallback(e => {
    if (e.target && e.target.getAttribute('data-tag') === STOP_PROP_TAG) {
      onRowDoubleClicked(row, e);
      if (!defaultExpanderDisabled && expandableRows && expandOnRowDoubleClicked) {
        handleExpanded();
      }
    }
  }, [defaultExpanderDisabled, expandOnRowDoubleClicked, expandableRows, handleExpanded, onRowDoubleClicked, row]);

  const extendedRowStyle = getConditionalStyle(row, conditionalRowStyles);

  return (
    <>
      <TableRowStyle
        id={`row-${id}`}
        striped={striped}
        highlightOnHover={highlightOnHover}
        pointerOnHover={!defaultExpanderDisabled && showPointer}
        dense={dense}
        onClick={handleRowClick}
        onDoubleClick={handleRowDoubleClick}
        className="rdt_TableRow"
        extendedRowStyle={extendedRowStyle}
      >
        {selectableRows && (
          <TableCellCheckbox
            name={`select-row-${row[keyField]}`}
            row={row}
          />
        )}

        {expandableRows && (
          <TableCellExpander
            expanded={expanded}
            row={row}
            onRowExpandToggled={handleExpanded}
            disabled={defaultExpanderDisabled}
          />
        )}

        {columns.map(column => (
          <TableCell
            id={`cell-${column.id}-${row[keyField]}`}
            key={`cell-${column.id}-${row[keyField]}`}
            column={column}
            row={row}
          />
        ))}
      </TableRowStyle>

      {expandableRows && expanded && (
        <ExpanderRow
          key={`expander--${row[keyField]}`}
          data={row}
        >
          {expandableRowsComponent}
        </ExpanderRow>
      )}
    </>
  );
});

TableRow.propTypes = {
  id: PropTypes.any.isRequired,
  keyField: PropTypes.string.isRequired,
  columns: PropTypes.array.isRequired,
  row: PropTypes.object.isRequired,
  onRowClicked: PropTypes.func.isRequired,
  onRowDoubleClicked: PropTypes.func.isRequired,
  onRowExpandToggled: PropTypes.func.isRequired,
  defaultExpanded: PropTypes.bool,
  defaultExpanderDisabled: PropTypes.bool,
  selectableRows: PropTypes.bool.isRequired,
  expandableRows: PropTypes.bool.isRequired,
  striped: PropTypes.bool.isRequired,
  highlightOnHover: PropTypes.bool.isRequired,
  pointerOnHover: PropTypes.bool.isRequired,
  dense: PropTypes.bool.isRequired,
  expandableRowsComponent: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.func,
  ]).isRequired,
  expandOnRowClicked: PropTypes.bool.isRequired,
  expandOnRowDoubleClicked: PropTypes.bool.isRequired,
  conditionalRowStyles: PropTypes.array.isRequired,
};

TableRow.defaultProps = {
  defaultExpanded: false,
  defaultExpanderDisabled: false,
};

export default TableRow;
