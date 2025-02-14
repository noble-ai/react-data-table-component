import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CellBase } from './Cell';
import ExpanderButton from './ExpanderButton';

const TableCellExpanderStyle = styled(CellBase)`
  flex: 0 0 56px;
  white-space: nowrap;
  font-weight: 400;
  font-size: ${props => props.theme.rows.fontSize};
  color: ${props => props.theme.rows.fontColor};

  &:not(:first-of-type) {
    padding-left: 0;
  }
`;

const TableCellExpander = ({
  column,
  row,
  expanded,
  onRowExpandToggled,
  disabled,
}) => (
  <TableCellExpanderStyle
    column={column}
    onClick={e => e.stopPropagation()}
  >
    <ExpanderButton
      onToggled={onRowExpandToggled}
      row={row}
      expanded={expanded}
      disabled={disabled}
    />
  </TableCellExpanderStyle>
);

TableCellExpander.propTypes = {
  column: PropTypes.object,
  row: PropTypes.object,
  expanded: PropTypes.bool,
  onRowExpandToggled: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

TableCellExpander.defaultProps = {
  column: {},
  row: {},
  expanded: false,
  disabled: false,
};

export default TableCellExpander;
