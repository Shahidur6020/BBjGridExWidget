import { gw_collapseAll } from "./api/rows";

/*
* This file is part of the grid project
* (c) Basis Europe <eu@Basis.AgGridComponents.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

export function gw_getSupportedColumnTypes() {

  return {
    "basic-string": {
      cellEditor: 'agPopupTextCellEditor'
    },

    "basic-boolean": {
      cellRenderer: 'BasicBooleansRenderer',
      cellRendererParams: {
        'RENDERER_TRUE': 'switch',
        'RENDERER_FALSE': 'switch'
      },
      cellEditor: 'BasicBooleansEditor',
      filter: 'BasicBooleansFilter'
    },

    "basic-number": {
      cellRenderer: 'BasicNumbersRenderer',
      cellEditor: 'BasicNumbersEditor',
      filter: 'agNumberColumnFilter',
      filterParams: {
        inRangeInclusive: true,
      },
      floatingFilter: 'agNumberColumnFilter',
      floatingFilterParams: {
        inRangeInclusive: true,
      },
    },

    "basic-date": {

      cellRenderer: 'BasicDateTimesRenderer',
      cellRendererParams: {
        'RENDERER_MASK': '%Y/%Mz/%Dz'
      },

      cellEditor: 'BasicDateTimesEditor',
      cellEditorParams: {
        'EDITOR_MASK': '%Y/%Mz/%Dz',
        'EDITOR_ALLOW_INPUT': true,
      },

      filter: 'BasicDateTimesFilter',
      filterParams: {
        'FILTER_MASK': '%Y/%Mz/%Dz',
        'FILTER_ALLOW_INPUT': true,
      },
    },

    "basic-timestamp": {

      cellRenderer: 'BasicDateTimesRenderer',
      cellRendererParams: {
        'RENDERER_MASK': '%Y/%Mz/%Dz %Hz:%mz:%sz'
      },

      cellEditor: 'BasicDateTimesEditor',
      cellEditorParams: {
        'EDITOR_MASK': '%Y/%Mz/%Dz %Hz:%mz:%sz',
        'EDITOR_ENABLE_TIME': true,
        'EDITOR_ALLOW_INPUT': true,
      },

      filter: 'BasicDateTimesFilter',
      filterParams: {
        'FILTER_MASK': '%Y/%Mz/%Dz %Hz:%mz:%sz',
        'FILTER_ENABLE_TIME': true,
        'FILTER_ALLOW_INPUT': true,
      }
    },

    "basic-image": {
      cellRenderer: 'BasicImagesRenderer',
      suppressMenu: true,
      suppressFilter: true,
      cellRendererParams: {
        'IMAGE_WIDTH': '25px',
        'IMAGE_HEIGHT': '25px',
      },
    },

    "basic-image-filterable": {
      cellRenderer: 'BasicImagesRenderer',
      cellRendererParams: {
        'IMAGE_WIDTH': '25px',
        'IMAGE_HEIGHT': '25px',
      },
    }
  };
}

export function gw_getDefaultComponents() {

  return {
    // Booleans
    'BasicBooleansRenderer': Basis.AgGridComponents.BasicBooleansRenderer,
    'BasicBooleansEditor': Basis.AgGridComponents.BasicBooleansEditor,
    'BasicBooleansFilter': Basis.AgGridComponents.BasicBooleansFilter,

    // Numbers
    'BasicNumbersRenderer': Basis.AgGridComponents.BasicNumbersRenderer,
    'BasicNumbersEditor': Basis.AgGridComponents.BasicNumbersEditor,

    // Dates
    'BasicDateTimesEditor': Basis.AgGridComponents.BasicDateTimesEditor,
    'BasicDateTimesRenderer': Basis.AgGridComponents.BasicDateTimesRenderer,
    'BasicDateTimesFilter': Basis.AgGridComponents.BasicDateTimesFilter,

    // Images
    'BasicImagesRenderer': Basis.AgGridComponents.BasicImagesRenderer,
  }
}

export function gw_init(container, license, data, defaultOptions = {}) {

  if (agGrid.LicenseManager && license) agGrid.LicenseManager.setLicenseKey(license);

  let options = Object.assign(defaultOptions, {

    rowData: data,
    getDocument: () => $doc,
    columnTypes: gw_getSupportedColumnTypes(),
    components: gw_getDefaultComponents(),

    onRowDoubleClicked: gw_onRowDoubleClicked,
    onRowSelected: gw_onRowSelected,
    onSelectionChanged: gw_onSelectionChanged,

    onCellEditingStarted: gw_onCellEditingsEvent,
    onCellEditingStopped: gw_onCellEditingsEvent,
    onCellValueChanged: gw_onCellEditingsEvent,

    onRowEditingStarted: gw_onRowEditingsEvent,
    onRowEditingStopped: gw_onRowEditingsEvent,
    onRowValueChanged: gw_onRowEditingsEvent,

    getNodeChildDetails: (rowItem) => {

      const key = rowItem[gw_options["__getParentNodeId"]];
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
        return null;
      }
    }
  });

  if (gw_options.hasOwnProperty('__getRowNodeId')) {

    options.getRowNodeId = function (data) {
      let id = data[gw_options['__getRowNodeId']];
      id = id ? id : Math.random();
      return id;
    };
  }

  if (
    gw_options.hasOwnProperty("__navigateToNextCell") &&
    gw_options.__navigateToNextCell
  ) {
    options.navigateToNextCell = gw_navigateToNextRow
  }

  for (let i in options.columnDefs) {
    options.columnDefs[i].cellStyle = gw_cellStyler;
  }

  return new agGrid.Grid(container, options);
}

export function gw_setData(json, options, license) {

  const container = $doc.getElementById('grid');
  container.innerHTML = '';

  window.gw_meta = json[0].meta;
  window.AGridComponentsMetaConfig = gw_meta;

  window.gw_options = options
  window.gw_instance = gw_init(container, license, json, options);

  if (gw_options.hasOwnProperty('__enterKeyBehavior')) {

    const behavior = gw_options.__enterKeyBehavior;

    switch (behavior) {
      case 'next':
        container.addEventListener('keydown', gw_onMoveToNextCell);
        break;
      default:
        break;
    }
  }
}