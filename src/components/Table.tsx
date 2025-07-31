import { useCallback, useMemo, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import {
  ModuleRegistry,
  AllCommunityModule,
  ColDef,
  ColGroupDef,
} from 'ag-grid-community';
import { Item, ShipDetails } from '../types';
import Checkbox from '@mui/joy/Checkbox';

ModuleRegistry.registerModules([AllCommunityModule]);

interface DataTableProps {
  items: Item[];
  shipDetails: ShipDetails | null;
  selectedItemIds: string[];
  onItemChange: (updatedItem: Item) => void;
  onSelectionChange: (id: string) => void;
  onSelectAll: () => void;
}

export default function DataTable({
  items,
  shipDetails,
  selectedItemIds,
  onItemChange,
  onSelectionChange,
  onSelectAll,
}: DataTableProps) {
  const gridRef = useRef<AgGridReact<Item>>(null);

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 30,
      editable: true,
      resizable: true,
      cellStyle: {
        textAlign: 'center',
        borderRight: '1px solid #e0e0e0',
        fontSize: '0.65rem',
      },
      headerClass: 'ag-header-cell-right-border',
    };
  }, []);

  const columnDefs: (ColDef | ColGroupDef)[] = useMemo(() => {
    return [
      {
        headerName: '',
        field: 'checkbox',
        width: 30,
        showDisabledCheckboxes: true,
        editable: false,
        sortable: false,
        filter: false,
        resizable: false,
        cellRenderer: (params: any) => {
          if (params.node.isRowPinned()) {
            return '';
          }
          return (
            <Checkbox
              checked={selectedItemIds.includes(params.data.id)}
              onChange={() => onSelectionChange(params.data.id)}
            />
          );
        },
        headerComponent: (params: any) => {
          const isAllSelected =
            items.length > 0 && selectedItemIds.length === items.length;
          console.log(
            'Table Header Checkbox Render - isAllSelected:',
            isAllSelected
          );
          return (
            <Checkbox
              checked={selectedItemIds.some((id) => id !== '')}
              onChange={() => {
                onSelectAll();
              }}
            />
          );
        },
      },
      {
        headerName: 'CARRIER LINE',
        marryChildren: true,
        headerClass: 'ag-header-cell-right-border',
        children: [
          {
            headerName: shipDetails?.CARRIER_LINE,
            marryChildren: true,
            headerClass: 'ag-header-cell-right-border',
            editable: true,
            children: [
              {
                headerName: 'NO.',
                field: 'no',
                minWidth: 30,
                valueGetter: (params: any) => {
                  if (params.node.isRowPinned()) {
                    return params.data.no;
                  }
                  return params.node.rowIndex + 1;
                },
                headerClass: 'ag-header-third-row',
                editable: false,
                colSpan: (params) => {
                  if (params.node?.isRowPinned()) {
                    if (params.node.rowIndex === 0) return 2; // 1st pinned row: checkbox + No. + FORWARDER
                    if (params.node.rowIndex === 1) return 7; // 2nd pinned row: checkbox + No. + FORWARDER + BL NO + PIC + DEST + HANDLING + O/F
                  }
                  return 1;
                },
                cellStyle: (params) => {
                  const style = {
                    textAlign: 'center',
                    borderRight: '1px solid #e0e0e0',
                    fontSize: '0.65rem',
                  };
                  if (params.node.isRowPinned()) {
                    return { ...style, fontWeight: 'bold' };
                  }
                  return style;
                },
              },
              {
                headerName: 'FORWARDER',
                field: 'FORWARDER',
                minWidth: 100,
                headerClass: 'ag-header-third-row',
              },
            ],
          },
        ],
      },
      {
        headerName: shipDetails?.VOY,
        marryChildren: true,
        headerClass: 'ag-header-cell-right-border',
        children: [
          {
            headerName: 'NEW CAMELLIA 3211N',
            marryChildren: true,
            headerClass: 'ag-header-cell-right-border',
            children: [
              {
                headerName: 'B/L NO.',
                field: 'BLNO',
                minWidth: 125,
                headerClass: 'ag-header-third-row',
                colSpan: (params) => {
                  if (
                    params.node?.isRowPinned() &&
                    params.node.rowIndex === 0
                  ) {
                    return 5; // BL NO + PIC + DEST + HANDLING + O/F
                  }
                  return 1;
                },
              },
            ],
          },
        ],
      },
      {
        headerName: shipDetails?.ETD,
        marryChildren: true,
        headerClass: 'ag-header-cell-right-border',
        children: [
          {
            headerName: '7/30',
            marryChildren: true,
            headerClass: 'ag-header-cell-right-border',
            children: [
              {
                headerName: 'PIC',
                field: 'PIC',
                minWidth: 60,
                headerClass: 'ag-header-third-row',
              },
            ],
          },
        ],
      },
      {
        headerName: shipDetails?.ETA,
        marryChildren: true,
        headerClass: 'ag-header-cell-right-border',
        children: [
          {
            headerName: '7/30',
            marryChildren: true,
            headerClass: 'ag-header-cell-right-border',
            children: [
              {
                headerName: 'DEST',
                field: 'DEST',
                minWidth: 85,
                headerClass: 'ag-header-third-row',
              },
            ],
          },
        ],
      },
      {
        headerName: 'POL',
        marryChildren: true,
        headerClass: 'ag-header-cell-right-border',
        children: [
          {
            headerName: 'HAKATA',
            marryChildren: true,
            headerClass: 'ag-header-cell-right-border',
            children: [
              {
                headerName: 'HANDLING',
                field: 'HANDLING',
                minWidth: 85,
                headerClass: 'ag-header-third-row',
              },
            ],
          },
        ],
      },
      {
        headerName: 'POD',
        marryChildren: true,
        headerClass: 'ag-header-cell-right-border',
        children: [
          {
            headerName: 'BUSAN',
            marryChildren: true,
            headerClass: 'ag-header-cell-right-border',
            children: [
              {
                headerName: 'O/F',
                field: 'OANDF',
                minWidth: 50,
                headerClass: 'ag-header-third-row',
                valueFormatter: (params) => {
                  if (typeof params.value === 'number') {
                    return params.value.toLocaleString();
                  }
                  return params.value;
                },
              },
              {
                headerName: 'KGS',
                field: 'KGS',
                minWidth: 80,
                headerClass: 'ag-header-third-row',
              },
            ],
          },
        ],
      },
      {
        headerName: 'C/TIME',
        marryChildren: true,
        headerClass: 'ag-header-cell-right-border',
        children: [
          {
            headerName: '',
            minWidth: 100,
            headerClass: 'ag-header-cell-right-border',
            children: [
              {
                headerName: 'CBM',
                field: 'CBM',
                minWidth: 80,
                headerClass: 'ag-header-third-row',
              },
            ],
          },
        ],
      },
      {
        headerName: '',
        field: 'B_1_1',
        minWidth: 100,
        headerClass: 'ag-header-cell-right-border',
        children: [
          {
            headerName: '',
            field: 'B_2_1',
            minWidth: 100,
            headerClass: 'ag-header-cell-right-border',
            children: [
              {
                headerName: 'PKG',
                field: 'PKG',
                minWidth: 50,
                headerClass: 'ag-header-third-row',
                colSpan: (params) => {
                  if (params.node?.isRowPinned()) {
                    return 2; // PKG + UNIT
                  }
                  return 1;
                },
              },
            ],
          },
        ],
      },
      {
        headerName: '',
        field: 'B_1_2',
        minWidth: 100,
        headerClass: 'ag-header-cell-right-border',
        children: [
          {
            headerName: '',
            field: 'B_2_2',
            minWidth: 100,
            headerClass: 'ag-header-cell-right-border',
            children: [
              {
                headerName: 'UNIT',
                field: 'UNIT',
                minWidth: 60,
                headerClass: 'ag-header-third-row',
              },
            ],
          },
        ],
      },
      {
        headerName: 'PLACE OF DELIVERY',
        minWidth: 150,
        headerClass: 'ag-header-cell-right-border',
        children: [
          {
            headerName: 'CY     .   CFS   .    DOOR',
            minWidth: 125,
            headerClass: 'ag-header-cell-right-border',
            children: [
              {
                headerName: 'SHIPPER / 通関',
                field: 'SHIPPER',
                minWidth: 125,
                headerClass: 'ag-header-third-row',
              },
            ],
          },
        ],
      },
      {
        headerName: 'SOGO',
        minWidth: 150,
        children: [
          {
            headerName: '',
            headerClass: 'ag-header-cell-right-border',
            children: [
              {
                headerName: 'REMARK',
                field: 'REMARK',
                minWidth: 125,
                headerClass: 'ag-header-third-row',
              },
            ],
          },
        ],
      },
    ];
  }, [selectedItemIds, items, onSelectionChange, onSelectAll]);

  const onCellValueChanged = useCallback(
    (event: any) => {
      const updatedItem: Item = { ...event.data };
      onItemChange(updatedItem);
    },
    [onItemChange]
  );

  const totals = useMemo(() => {
    const kgsTotal = items.reduce(
      (sum, item) => sum + (Number(item.KGS) || 0),
      0
    );
    const cbmTotal = items.reduce(
      (sum, item) => sum + (Number(item.CBM) || 0),
      0
    );
    const pkgTotal = items.reduce(
      (sum, item) => sum + (Number(item.PKG) || 0),
      0
    );

    const row1 = {
      no: 'REMARK',
      BLNO: ' ',
      KGS: 'KGS',
      CBM: 'CBM',
      PKG: 'TOTAL PKG',
      SHIPPER: '',
      REMARK: '',
    };

    const row2 = {
      no: ' ',
      KGS: kgsTotal.toFixed(2),
      CBM: cbmTotal.toFixed(2),
      PKG: pkgTotal,
      SHIPPER: ' ',
      REMARK: ' ',
    };

    return [row1, row2];
  }, [items]);

  return (
    <div className="ag-theme-alpine" style={{ height: 500, width: '80vw' }}>
      <AgGridReact<Item>
        ref={gridRef}
        rowData={items}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        onCellValueChanged={onCellValueChanged}
        rowSelection={'multiple'}
        suppressRowClickSelection={true}
        pinnedBottomRowData={totals}
      />
    </div>
  );
}
