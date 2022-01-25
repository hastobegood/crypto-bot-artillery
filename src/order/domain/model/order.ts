export type OrderExchange = 'Binance';
export type OrderSide = 'Buy' | 'Sell';
export type OrderType = 'Market' | 'Limit';
export type OrderStatus = 'Waiting' | 'PartiallyFilled' | 'Filled' | 'Canceled' | 'Error' | 'Unknown';

export interface SendOrder {
  exchange: OrderExchange;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  quote: boolean;
  requestedQuantity: number;
  requestedPrice?: number;
}

export interface TransientOrder extends SendOrder {
  id: string;
  creationDate: Date;
}

export interface Order extends TransientOrder {
  status: OrderStatus;
  externalId: string;
  externalStatus: string;
  transactionDate: Date;
  executedQuantity?: number;
  executedPrice?: number;
}

export interface CheckOrder {
  exchange: OrderExchange;
  symbol: string;
  externalId: string;
}

export interface OrderCheckup extends CheckOrder {
  status: OrderStatus;
  externalStatus: string;
  executedQuantity?: number;
  executedPrice?: number;
}
