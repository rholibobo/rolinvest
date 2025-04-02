export const salesData = [
    { name: "Jan", revenue: 400000, expenditure: 25000, profitMargin: 37.5, cac: 50 },
    { name: "Feb", revenue: 450000, expenditure: 280000, profitMargin: 38.4, cac: 52 },
    { name: "Mar", revenue: 500000, expenditure: 300000, profitMargin: 40, cac: 55 },
    { name: "Apr", revenue: 530000, expenditure: 310000, profitMargin: 41.5, cac: 53 },
    { name: "May", revenue: 550000, expenditure: 330000, profitMargin: 40.9, cac: 51 },
    { name: "Jun", revenue: 200000, expenditure: 350000, profitMargin: 41.7, cac: 50 },
    { name: "Jul", revenue: 650000, expenditure: 370000, profitMargin: 42.3, cac: 49 },
    { name: "Aug", revenue: 300000, expenditure: 390000, profitMargin: 43, cac: 48 },
    { name: "Sep", revenue: 750000, expenditure: 420000, profitMargin: 44, cac: 47 },
    { name: "Oct", revenue: 800000, expenditure: 440000, profitMargin: 44.5, cac: 46 },
    { name: "Nov", revenue: 850000, expenditure: 460000, profitMargin: 45, cac: 45 },
    { name: "Dec", revenue: 400000, expenditure: 480000, profitMargin: 46.7, cac: 44 },
  ];

  export const userGrowthData = [
    { name: "Jan", users: 4000 },
    { name: "Feb", users: 3500 },
    { name: "Mar", users: 3000 },
    { name: "Apr", users: 4500 },
    { name: "May", users: 5000 },
    { name: "Jun", users: 6000 },
    { name: "Jul", users: 7000 },
    { name: "Aug", users: 7500 },
    { name: "Sep", users: 8200 },
    { name: "Oct", users: 8500 },
    { name: "Nov", users: 9000 },
    { name: "Dec", users: 9500 },
  ];

export const categoryDistributionData = [
  { name: "Rent & Living", value: 400000 },
  { name: "Investment", value: 30000 },
  { name: "Education", value: 150000 },
  { name: "Food and Drinks", value: 100000 },
  { name: "Entertainment", value: 9000 },
];

export const COLORS = ["#284e57", "#386d7a", "#62a6b7", "#85bac7", "#cbe1e7"]

export const createData = (name: string, amount: number, dateSold: string, status: string, note: string) => {
  return { name, amount, dateSold, status, note };
};

export const rows = [
  createData("Electricity Bill", 1200, "2025-03-01", "Completed", "Paid on time"),
  createData("Weekly Groceries", 1100, "2025-03-05", "Pending", "Need to buy milk and bread"),
  createData("Monthly Rent", 499, "2025-03-10", "Completed", "Paid via bank transfer"),
  createData("Internet Bill", 1500, "2025-03-15", "In Progress", "Payment pending"),
  createData("Water Bill", 2500, "2025-03-20", "Completed", "Paid in full"),
  createData("Phone Bill", 299, "2025-03-25", "Completed", "No issues"),
  createData("Gas Bill", 299, "2025-03-30", "In Progress", "Payment due soon"),
  createData("Car Insurance", 899, "2025-04-02", "Completed", "Renewed for 1 year"),
];



export const CardDisplayData = [
    {
      title: "Total Income",
      amount: 1438960,
      percentage: 10,
      note: "Year to Date",
    },
    {
      title: "Total Expense",
      amount: 60075,
      percentage: 15,
      note: "Year to Date",
    },
    {
      title: "Total Savings",
      amount: 5000000,
      percentage: 6,
      note: "Year to Date",
    },
    // {
    //   title: "Total Expenditure",
    //   amount: 1000000,
    //   percentage: 25,
    //   note: "Year to Date",
    // },
  ];