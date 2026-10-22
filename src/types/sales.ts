export interface SaleTicketRecord {
  dateCreation: Date | string;
  ticketNro: string | number;   
  productName: string;
  qty: number;
  soldprice: number;
  lineTotal: number;
  ticketStatus: number | string;
  productId: string;         
}