/*
* This file is part of the grid project
* (c) Basis Europe <eu@Basis.AgGridComponents.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

export function gw_setQuickFilter(id, filter) {
  const options = gw_getGrid(id).options;
  options.api.setQuickFilter(filter);
}

export function gw_expandAll(id) {
  const options = gw_getGrid(id).options;
  options.api.expandAll();
}

export function gw_collapseAll(id) {
  const options = gw_getGrid(id).options;
  options.api.collapseAll();
}

export function gw_setVisibleRow(id, index, position) {
  const options = gw_getGrid(id).options;
  options.api.ensureIndexVisible(index, position);
}

export function gw_navigateToNextRow(id, params) {

  const options = gw_getGrid(id).options;
  let previousCell = params.previousCellDef;
  let suggestedNextCell = params.nextCellDef;

  const KEY_UP = 38;
  const KEY_DOWN = 40;
  const KEY_LEFT = 37;
  const KEY_RIGHT = 39;

  switch (params.key) {
    case KEY_DOWN:
      previousCell = params.previousCellDef;
      // set selected cell on current cell + 1
      options.api.forEachNode((node) => {
        if (previousCell.rowIndex + 1 === node.rowIndex) {
          node.setSelected(true);
        }
      });
      return suggestedNextCell;
    case KEY_UP:
      previousCell = params.previousCellDef;
      // set selected cell on current cell - 1
      options.api.forEachNode((node) => {
        if (previousCell.rowIndex - 1 === node.rowIndex) {
          node.setSelected(true);
        }
      });
      return suggestedNextCell;
    case KEY_LEFT:
    case KEY_RIGHT:
      return suggestedNextCell;
    default:
      throw new Error("You have super strange keyboard");
  }
}

export function gw_getRowNodeId(id, data) {
  return data[gw_getGrid(id).options.context.getRowNodeId];
}

export function gw_getNodeChildDetails(rowItem) {

  const key = rowItem[gw_options.__getParentNodeId];
  if (rowItem.__node__children) {
    return {
      group: true,
      expanded: false,
      // provide ag-Grid with the children of this group
      children: rowItem.__node__children,
      // the key is used by the default group cellRenderer
      key: key ? key : -1
    };
  } else {
    return false;
  }
}

export function gw_setRowsData(id, json) {
  const options = gw_getGrid(id).options;

  options.api.setRowData(json);
  options.rowData = json;
  options.api.refreshClientSideRowModel('group');
}

export function gw_setRowData(id, row) {
  const options = gw_getGrid(id).options;

  options.api.updateRowData({ update: [row] });
  options.api.refreshClientSideRowModel('group');
}

export function gw_removeRows(id, indexes) {
  const options = gw_getGrid(id).options;
  let items = [];

  indexes.forEach(index => {
    items.push(options.api.getRowNode(index).data);
  });

  options.api.updateRowData({ remove: items });
  options.api.refreshClientSideRowModel('group');
}

export function gw_addRows(id, index, rows) {
  const options = gw_getGrid(id).options;

  options.api.updateRowData({ add: rows, addIndex: index });
  options.api.refreshClientSideRowModel('group');
}
