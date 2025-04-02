import { http, HttpResponse, delay } from "msw";
import {
  CardDisplayData,
  categoryDistributionData,
  rows,
  salesData,
  userGrowthData,
} from "../components/constants/Constants";

const baseUrl:string = "https://www.getdata.com"

export const handlers = [
  //Line Chart Data API
  http.get(`${baseUrl}/api/dashboard/sales-trends`, async ({ request }) => {
    const url = new URL(request.url);
    const period = url.searchParams.get("period") || "year";

    // You could return different data based on the period
    let data = [...salesData];

    if (period === "month") {
      // Return only last 30 days data
      data = data.slice(-3);
    } else if (period === "quarter") {
      // Return quarterly data
      data = data.slice(-4);
    }

    await delay(400);
    return HttpResponse.json(data);
  }),

  // Bar Chart Data API
  http.get(`${baseUrl}/api/dashboard/user-growth`, async ({ request }) => {
    const url = new URL(request.url);
    const year = url.searchParams.get("year") || "current";

    // Could return different data based on the year
    await delay(600);
    return HttpResponse.json(userGrowthData);
  }),

  // Pie Chart Data API
  http.get(`${baseUrl}/api/dashboard/category-distribution`, async () => {
    await delay(700);
    return HttpResponse.json(categoryDistributionData);
  }),

  // Table Data API
  http.get(`${baseUrl}/api/dashboard/budget-details`, async ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const sortBy = url.searchParams.get("sortBy") || "name";
    const sortOrder = url.searchParams.get("sortOrder") || "asc";

    // Filter rows based on search query
    let filteredRows = [...rows];
    if (search) {
      filteredRows = rows.filter((row: { name: string }) =>
        row.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort rows
    filteredRows.sort((a, b) => {
      if (sortBy === "amount") {
        return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
      }

      // Sort by string properties
      const aValue = String(a[sortBy as keyof typeof a]);
      const bValue = String(b[sortBy as keyof typeof b]);

      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

    await delay(500);
    return HttpResponse.json({
      rows: filteredRows,
      total: rows.length,
      filtered: filteredRows.length,
    });
  }),

  // Summary Cards Data API
  http.get(`${baseUrl}/api/dashboard/summary`, async () => {
    const data = [...CardDisplayData];
    await delay(400);
    return HttpResponse.json(CardDisplayData);
  }),

 
];
