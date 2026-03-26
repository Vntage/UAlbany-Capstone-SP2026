const BUSINESS_ID = "19e3a2d1-c06b-4b98-91dd-0adfa38cb039";
const USER_ID = "5033b8ac-5d07-4c7f-88c9-3c8951f7fcd3";

export interface Alert {
  id: string;
  type: "warning" | "critical" | "info";
  title: string;
  message: string;
  date: string;
  category: string;
}

export interface BudgetItem {
  id: string;
  category: string;
  budgeted: number;
  actual: number;
  variance: number;
  percentageUsed: number;
}

export interface ForecastData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface MetricCard {
  title: string;
  value: string;
  change: number;
  trend: "up" | "down";
}

//mock alerts for unusual activity
//this should be generated from financial data and cached
export const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "critical",
    title: "Unusual Expense Spike",
    message: "Marketing expenses are 45% over budget this month. Review advertising spend.",
    date: "2026-03-02",
    category: "Budget",
  },
  {
    id: "2",
    type: "warning",
    title: "Revenue Below Target",
    message: "Monthly revenue is tracking 12% below forecast. Consider corrective actions.",
    date: "2026-03-01",
    category: "Forecast",
  },
  {
    id: "3",
    type: "critical",
    title: "Cash Flow Alert",
    message: "Projected cash runway reduced to 4 months. Review expenses and funding options.",
    date: "2026-02-28",
    category: "Cash Flow",
  },
  {
    id: "4",
    type: "info",
    title: "Seasonal Trend Detected",
    message: "Q1 revenue patterns align with historical seasonal trends.",
    date: "2026-02-27",
    category: "Analytics",
  },
  {
    id: "5",
    type: "warning",
    title: "Vendor Cost Increase",
    message: "Supplier costs increased 18% compared to last quarter average.",
    date: "2026-02-25",
    category: "Budget",
  },
];

export const mockBudgetData: BudgetItem[] = [
  {
    id: "1",
    category: "Sales & Marketing",
    budgeted: 50000,
    actual: 72500,
    variance: -22500,
    percentageUsed: 145,
  },
  {
    id: "2",
    category: "Operations",
    budgeted: 80000,
    actual: 76800,
    variance: 3200,
    percentageUsed: 96,
  },
  {
    id: "3",
    category: "Personnel",
    budgeted: 150000,
    actual: 150000,
    variance: 0,
    percentageUsed: 100,
  },
  {
    id: "4",
    category: "Technology",
    budgeted: 25000,
    actual: 21000,
    variance: 4000,
    percentageUsed: 84,
  },
  {
    id: "5",
    category: "Office & Admin",
    budgeted: 15000,
    actual: 12500,
    variance: 2500,
    percentageUsed: 83,
  },
  {
    id: "6",
    category: "Research & Development",
    budgeted: 30000,
    actual: 28900,
    variance: 1100,
    percentageUsed: 96,
  },
];

export const mockForecastData: ForecastData[] = [
  { month: "Jan", revenue: 380000, expenses: 315000, profit: 65000 },
  { month: "Feb", revenue: 395000, expenses: 325000, profit: 70000 },
  { month: "Mar", revenue: 410000, expenses: 340000, profit: 70000 },
  { month: "Apr", revenue: 425000, expenses: 345000, profit: 80000 },
  { month: "May", revenue: 445000, expenses: 350000, profit: 95000 },
  { month: "Jun", revenue: 460000, expenses: 360000, profit: 100000 },
  { month: "Jul", revenue: 480000, expenses: 365000, profit: 115000 },
  { month: "Aug", revenue: 495000, expenses: 370000, profit: 125000 },
  { month: "Sep", revenue: 510000, expenses: 380000, profit: 130000 },
  { month: "Oct", revenue: 525000, expenses: 385000, profit: 140000 },
  { month: "Nov", revenue: 545000, expenses: 390000, profit: 155000 },
  { month: "Dec", revenue: 560000, expenses: 395000, profit: 165000 },
];

//mock metrics for dashboard
export const mockMetrics: MetricCard[] = [
  {
    title: "Total Revenue",
    value: "$410,000",
    change: 3.8,
    trend: "up",
  },
  {
    title: "Net Profit",
    value: "$70,000",
    change: -12.3,
    trend: "down",
  },
  {
    title: "Burn Rate",
    value: "$340,000",
    change: 5.2,
    trend: "up",
  },
  {
    title: "Cash Runway",
    value: "4 months",
    change: -15.0,
    trend: "down",
  },
];

export const mockMonthlyTrend = [
  { month: "Oct", revenue: 420000, expenses: 310000 },
  { month: "Nov", revenue: 390000, expenses: 305000 },
  { month: "Dec", revenue: 435000, expenses: 320000 },
  { month: "Jan", revenue: 380000, expenses: 315000 },
  { month: "Feb", revenue: 395000, expenses: 325000 },
  { month: "Mar", revenue: 410000, expenses: 340000 },
];

export const mockRevenueByCategory = [
  { name: "Product Sales", value: 245000, percentage: 60 },
  { name: "Services", value: 98000, percentage: 24 },
  { name: "Subscriptions", value: 49000, percentage: 12 },
  { name: "Other", value: 18000, percentage: 4 },
];
