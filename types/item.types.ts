export interface Item {
  id: number;
  name: string;
  cates_id: number;
  warehouse_id: number;
  first_entery: number;
  date: Date;
  added: number;
  inuse: number;
  removed: number;
  current: number;
  barcode: string;
  username: string;
  changed: number;
  exchange: boolean;
  returned: number;
  price: number,
  note: string
}

export interface ItemDocument {
  id: number;
  name: string;
  cates_id: number;
  cates_name: string;
  unit_type: string,
  warehouse_id: number;
  first_entery: number;
  date: Date;
  added: number;
  inuse: number;
  returned: number;
  removed: number;
  current: number;
  barcode: string;
  username: string;
  changed: number;
  exchange: boolean;
  price: number;
  note: string
}
