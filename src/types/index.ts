export interface ShipDetails {
  CARRIER_LINE: string;
  VOY: string;
  ETD: string;
  ETA: string;
  KGS: string;
  CBM: string;
  TOTAL_PKG: string;
}

export interface Item {
  id: string;
  FORWARDER: string;
  BLNO: string;
  PIC: string;
  DEST: string;
  HANDLING: string;
  OANDF: string;
  KGS: string;
  CBM: string;
  PKG: string;
  UNIT: string;
  SHIPPER: string;
  REMARK: string;
}

export interface Comment {
  id: string;
  user: string;
  comment: string;
  createdAt: Date;
}
