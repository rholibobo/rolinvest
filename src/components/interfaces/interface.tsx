export interface SalesData {
  name: string;
  revenue: number;
  expenditure: number;
  profitMargin?: number;
  cac?: number;
}

export interface UserGrowthData {
  name: string;
  users: number;
}

export interface CategoryData {
  name: string;
  value: number;
}

export interface BudgetRow {
  name: string;
  amount: number;
  dateSold: string;
  status: string;
}

export interface CardData {
  title: string;
  amount: number;
  percentage: number;
  note: string;
}
