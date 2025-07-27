import Table from '@mui/joy/Table';
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import Checkbox from '@mui/joy/Checkbox';
import { Item } from '../types';

interface DataTableProps {
  items: Item[];
  selectedItemIds: string[];
  onItemChange: (updatedItem: Item) => void;
  onAddItem: () => void;
  onSelectionChange: (id: string) => void;
  onSelectAll: () => void;
}

export default function DataTable({
  items,
  selectedItemIds,
  onItemChange,
  onAddItem,
  onSelectionChange,
  onSelectAll,
}: DataTableProps) {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string,
    field: keyof Omit<Item, 'id'>
  ) => {
    const itemToUpdate = items.find((item) => item.id === id);
    if (itemToUpdate) {
      const updatedItem = { ...itemToUpdate, [field]: e.target.value };
      onItemChange(updatedItem);
    }
  };

  const isAllSelected =
    items.length > 0 && selectedItemIds.length === items.length;

  return (
    <>
      <Table
        borderAxis="both"
        size="sm"
        sx={{
          '& th, & td': {
            textAlign: 'center',
            verticalAlign: 'middle !important',
            padding: '4px 8px',
            fontSize: '0.75rem',
            whiteSpace: 'normal',
            wordBreak: 'break-all',
          },
          '& input': {
            padding: '4px 8px',
            fontSize: '0.65rem',
            border: 'none',
            background: 'transparent',
            width: '100%',
            boxSizing: 'border-box',
          },
          '& th': {
            fontWeight: 'bold',
            backgroundColor: '#f0f4f8',
          },
          '& thead tr:nth-of-type(3) th': {
            backgroundColor: '#ffd700',
          },
          '& th:not(:last-child), & td:not(:last-child)': {
            borderRight: '1px solid rgba(0, 0, 0, 0.12)',
          },
        }}
      >
        <thead>
          <tr>
            <th rowSpan={3}>
              <Checkbox checked={isAllSelected} onChange={onSelectAll} />
            </th>
            <th colSpan={8}>CARRIER LINE</th>
            <th colSpan={10}>VSL/VOY NO</th>
            <th colSpan={5}>ETD</th>
            <th colSpan={5}>ETA</th>
            <th colSpan={5}>POL</th>
            <th colSpan={7}>POD</th>
            <th colSpan={5}>C/TIME</th>
            <th colSpan={2}></th>
            <th colSpan={2}></th>
            <th colSpan={10}>PLACE OF DELIVERY</th>
            <th colSpan={9} rowSpan={2}>
              SOGO
            </th>
          </tr>
          <tr>
            <th colSpan={8}>CAMELLIA</th>
            <th colSpan={10}>NEW CAMELLIA 3211N</th>
            <th colSpan={5}>7/30</th>
            <th colSpan={5}>7/30</th>
            <th colSpan={5}>HAKATA</th>
            <th colSpan={7}>BUSAN</th>
            <th colSpan={5}></th>
            <th colSpan={2}></th>
            <th colSpan={2}></th>
            <th colSpan={10}>CY . CFS . DOOR</th>
          </tr>
          <tr>
            <th colSpan={2}>NO.</th>
            <th colSpan={6}>FORWARDER</th>
            <th colSpan={10}>B/L NO.</th>
            <th colSpan={5}>PIC</th>
            <th colSpan={5}>DEST</th>
            <th colSpan={5}>HADNLING</th>
            <th colSpan={2}>O/F</th>
            <th colSpan={5}>KGS</th>
            <th colSpan={5}>CBM</th>
            <th colSpan={2}>PKG</th>
            <th colSpan={2}>UNIT</th>
            <th colSpan={10}>SHIPPER / 通関</th>
            <th colSpan={9}>REMARK</th>
          </tr>
        </thead>
        <tbody>
          {items.map((row, index) => (
            <tr key={row.id}>
              <td>
                <Checkbox
                  checked={selectedItemIds.includes(row.id)}
                  onChange={() => onSelectionChange(row.id)}
                />
              </td>
              <td colSpan={2}>{index + 1}</td>
              <td colSpan={6}>
                <Input
                  value={row.FORWARDER}
                  onChange={(e) => handleInputChange(e, row.id, 'FORWARDER')}
                />
              </td>
              <td colSpan={10}>
                <Input
                  value={row.BLNO}
                  onChange={(e) => handleInputChange(e, row.id, 'BLNO')}
                />
              </td>
              <td colSpan={5}>
                <Input
                  value={row.PIC}
                  onChange={(e) => handleInputChange(e, row.id, 'PIC')}
                />
              </td>
              <td colSpan={5}>
                <Input
                  value={row.DEST}
                  onChange={(e) => handleInputChange(e, row.id, 'DEST')}
                />
              </td>
              <td colSpan={5}>
                <Input
                  value={row.HANDLING}
                  onChange={(e) => handleInputChange(e, row.id, 'HANDLING')}
                />
              </td>
              <td colSpan={2}>
                <Input
                  value={row.OANDF}
                  onChange={(e) => handleInputChange(e, row.id, 'OANDF')}
                />
              </td>
              <td colSpan={5}>
                <Input
                  value={row.KGS}
                  onChange={(e) => handleInputChange(e, row.id, 'KGS')}
                />
              </td>
              <td colSpan={5}>
                <Input
                  value={row.CBM}
                  onChange={(e) => handleInputChange(e, row.id, 'CBM')}
                />
              </td>
              <td colSpan={2}>
                <Input
                  value={row.PKG}
                  onChange={(e) => handleInputChange(e, row.id, 'PKG')}
                />
              </td>
              <td colSpan={2}>
                <Input
                  value={row.UNIT}
                  onChange={(e) => handleInputChange(e, row.id, 'UNIT')}
                />
              </td>
              <td colSpan={10}>
                <Input
                  value={row.SHIPPER}
                  onChange={(e) => handleInputChange(e, row.id, 'SHIPPER')}
                />
              </td>
              <td colSpan={9}>
                <Input
                  value={row.REMARK}
                  onChange={(e) => handleInputChange(e, row.id, 'REMARK')}
                />
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={9}>REMARK</td>
            <td colSpan={27}></td>
            <td colSpan={5}>KGS</td>
            <td colSpan={5}>CBM</td>
            <td colSpan={4}>TOTAL PKG</td>
            <td colSpan={10}>CFS R/TON</td>
            <td colSpan={9}>PROFIT R/TON</td>
          </tr>
          <tr>
            <td colSpan={36}></td>
            <td colSpan={5}>147000</td>
            <td colSpan={5}>1500</td>
            <td colSpan={4}>32</td>
            <td colSpan={10}></td>
            <td colSpan={9}></td>
          </tr>
        </tfoot>
      </Table>
    </>
  );
}
