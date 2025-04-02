"use client";

import type React from "react";
import { useRef, useState, useEffect } from "react";
import {
  Typography,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Box,
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  IconButton,
  ListItemButton,
  useMediaQuery,
  useTheme,
  Alert,
  CircularProgress,
} from "@mui/material";

import {
  Dashboard as DashboardIcon,
  Assessment,
  AccountBalance,
  Description,
  Settings,
  ExitToApp,
  Menu as MenuIcon,
  Search,
  Notifications,
  Person,
  KeyboardArrowDown,
  KeyboardArrowUp,
  FilterList,
  Refresh,
  Payment,
  SyncAlt,
  Receipt,
  CreditScore,
  Savings,
  Inventory,
  Mail,
  Insights,
  Wallet,
  Chat,
  RssFeed,
  ExpandMore,
  MoreVert,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";
import { BarChart, Bar } from "recharts";
import { PieChart, Pie, Cell } from "recharts";
import { COLORS, rows } from "../constants/Constants";
import FinancialDataCardDisplay from "../cards/SummaryCards";
import {
  BudgetRow,
  CardData,
  CategoryData,
  SalesData,
  UserGrowthData,
} from "../interfaces/interface";
import pp from "../../../public/pp1.png";
import Image from "next/image";

import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/auth-context";

export default function DashboardPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [dropdownArrow, setDropdownArrow] = useState<boolean>(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState("year");
  const { logout } = useAuth();
  const router = useRouter();

  // State for API data
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<UserGrowthData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [budgetRows, setBudgetRows] = useState<BudgetRow[]>([]);
  const [summaryData, setSummaryData] = useState<CardData[]>([]);

  // Loading and error states
  const [loadingSales, setLoadingSales] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingBudget, setLoadingBudget] = useState(true);
  const [loadingSummary, setLoadingSummary] = useState(true);

  const [errorSales, setErrorSales] = useState<string | null>(null);
  const [errorUsers, setErrorUsers] = useState<string | null>(null);
  const [errorCategories, setErrorCategories] = useState<string | null>(null);
  const [errorBudget, setErrorBudget] = useState<string | null>(null);
  const [errorSummary, setErrorSummary] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState("This Month");

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownArrow(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
    if (isMobile) {
      setMobileOpen(false); // Close drawer on mobile after selection
    }
  };

  const displayDropdownArrow = () => {
    setDropdownArrow((prev) => !prev);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterName(event.target.value);
  };

  const filteredRows = rows.filter((row) =>
    row.name.toLowerCase().includes(filterName.toLowerCase())
  );

  const fullName = localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser")!).fullName
    : "";

  const sortedRows = filteredRows.sort((a, b) => {
    if (orderBy === "amount") {
      return order === "asc" ? a.amount - b.amount : b.amount - a.amount;
    }
    return order === "asc"
      ? a[orderBy as keyof typeof a] < b[orderBy as keyof typeof b]
        ? -1
        : 1
      : b[orderBy as keyof typeof b] < a[orderBy as keyof typeof a]
      ? -1
      : 1;
  });

  const baseUrl: string = "https://www.getdata.com";

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `₦${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `₦${(num / 1000).toFixed(1)}k`;
    }
    return `₦${num.toString()}`;
  };

  // Fetch data functions

  const fetchSalesData = async () => {
    setLoadingSales(true);
    setErrorSales(null);
    try {
      const response = await fetch(
        `${baseUrl}/api/dashboard/sales-trends?period=${selectedPeriod}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch sales data");
      }
      const data = await response.json();

      setSalesData(data);
    } catch (error) {
      setErrorSales(
        error instanceof Error ? error.message : "An error occurred"
      );
      console.error("Error fetching sales data:", error);
    } finally {
      setLoadingSales(false);
    }
  };

  const fetchUserGrowthData = async () => {
    setLoadingUsers(true);
    setErrorUsers(null);
    try {
      const response = await fetch(`${baseUrl}/api/dashboard/user-growth`);
      if (!response.ok) {
        throw new Error("Failed to fetch user growth data");
      }
      const data = await response.json();

      setUserGrowthData(data);
    } catch (error) {
      setErrorUsers(
        error instanceof Error ? error.message : "An error occurred"
      );
      console.error("Error fetching user growth data:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchCategoryData = async () => {
    setLoadingCategories(true);
    setErrorCategories(null);
    try {
      const response = await fetch(
        `${baseUrl}/api/dashboard/category-distribution`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch category data");
      }
      const data = await response.json();

      setCategoryData(data);
    } catch (error) {
      setErrorCategories(
        error instanceof Error ? error.message : "An error occurred"
      );
      console.error("Error fetching category data:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchBudgetData = async () => {
    setLoadingBudget(true);
    setErrorBudget(null);
    try {
      const response = await fetch(
        `${baseUrl}/api/dashboard/budget-details?search=${filterName}&sortBy=${orderBy}&sortOrder=${order}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch budget data");
      }
      const data = await response.json();
      setBudgetRows(data.rows);
    } catch (error) {
      setErrorBudget(
        error instanceof Error ? error.message : "An error occurred"
      );
      console.error("Error fetching budget data:", error);
    } finally {
      setLoadingBudget(false);
    }
  };

  const fetchSummaryData = async () => {
    setLoadingSummary(true);
    setErrorSummary(null);
    try {
      const response = await fetch(`${baseUrl}/api/dashboard/summary`);
      if (!response.ok) {
        throw new Error("Failed to fetch summary data");
      }
      const data = await response.json();

      setSummaryData(data);
    } catch (error) {
      setErrorSummary(
        error instanceof Error ? error.message : "An error occurred"
      );
      console.error("Error fetching summary data:", error);
    } finally {
      setLoadingSummary(false);
    }
  };

  // Fetch all data on initial load
  useEffect(() => {
    fetchSalesData();
    fetchUserGrowthData();
    fetchCategoryData();
    fetchBudgetData();
    fetchSummaryData();
  }, []);

  // Refetch sales data when period changes
  useEffect(() => {
    fetchSalesData();
  }, [selectedPeriod]);

  // Refetch budget data when filter or sort changes
  useEffect(() => {
    fetchBudgetData();
  }, [filterName, orderBy, order]);

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  function getStatusColor(status: string) {
    switch (status) {
      case "Completed":
        return "status-completed";
      case "In Progress":
        return "status-in-progress";
      case "Pending":
        return "status-pending";
      default:
        return ""; // Default class if status is not recognized
    }
  }

  const drawer = (
    <div>
      <Box
        sx={{
          display: "flex",
          gap: 1,
          alignItems: "center",
          padding: "16px",
          color: "#386d7a",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          height: "auto",
        }}
      >
        <Wallet sx={{ fontSize: 40 }} />
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ fontWeight: "bold" }}
        >
          Rolinvest
        </Typography>
      </Box>
      <List sx={{ mt: 2 }}>
        {[
          "Dashboard",
          "Payments",
          "Transactions",
          "Invoices",
          "Cards",
          "Saving PLans",
          "Investments",
          "Inbox",
          "Insights",
          "Settings",
        ].map((text, index) => (
          <ListItemButton
            key={text}
            selected={selectedIndex === index}
            onClick={(event) => handleListItemClick(event, index)}
            sx={{
              "&.Mui-selected": {
                backgroundColor: "#62a6b7",
                borderLeft: "4px solid white",
                paddingLeft: "12px",
                color: "black",
              },
              paddingLeft: "16px",
              borderRadius: "0 8px 8px 0",
              margin: "12px 8px 3px 0",

              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "rgba(79, 195, 247, 0.2)",
              },
            }}
          >
            <ListItemIcon>
              {index === 0 ? (
                <DashboardIcon />
              ) : index === 1 ? (
                <Payment />
              ) : index === 2 ? (
                <SyncAlt />
              ) : index === 3 ? (
                <Receipt />
              ) : index === 4 ? (
                <CreditScore />
              ) : index === 5 ? (
                <Savings />
              ) : index === 6 ? (
                <Inventory />
              ) : index === 7 ? (
                <Mail />
              ) : index === 8 ? (
                <Assessment />
              ) : index === 9 ? (
                <Insights />
              ) : (
                <Settings />
              )}
            </ListItemIcon>
            <Typography
              variant="body1"
              sx={{
                fontSize: "14px",
                "&.Mui-selected": { fontWeight: "bold" },
              }}
            >
              {text}
            </Typography>
          </ListItemButton>
        ))}
        <ListItemButton
          key="Logout"
          onClick={handleLogout}
          sx={{
            paddingLeft: "16px",
            borderRadius: "0 8px 8px 0",
            margin: "12px 8px 36px 0",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              backgroundColor: "rgba(79, 195, 247, 0.2)",
            },
          }}
        >
          <ListItemIcon>
            <ExitToApp />
          </ListItemIcon>
          <Typography variant="body1" sx={{ fontSize: "14px" }}>
            Logout
          </Typography>
        </ListItemButton>
      </List>
    </div>
  );

  return (
    <Box
      sx={{
        display: "flex",
        overflow: "hidden", // Add this to prevent overflow
        width: "100%", // Ensure the box doesn't exceed viewport width
      }}
      className="bg-[#FCFCFC]"
    >
      {/* Mobile menu button */}
      <Box
        className="mb-8"
        sx={{
          position: "fixed",
          top: "10px",
          left: "20px",
          zIndex: 1200,
          display: { xs: "block", sm: "none" },
        }}
      >
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            backgroundColor: "#1a2233",
            color: "white",
            "&:hover": {
              backgroundColor: "#62a6b7",
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      </Box>

      {/* Sidebar navigation */}
      <Box
        component="nav"
        sx={{ width: { sm: 240 }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { xs: "100%", sm: `calc(100% - 240px)` },
          //   marginLeft: { xs: 0, sm: "240px" },
          overflowX: "hidden", // Add this to prevent horizontal scrolling
        }}
      >
        {/* Header */}
        <Box
          className="flex flex-col md:flex-row justify-between items-start md:items-center bg-transparent rounded-none px-4 md:px-6 py-2"
          sx={{
            mt: { xs: 4, sm: 0 },
            height: { xs: "auto", md: "80px" },
          }}
        >
          <div className="flex justify-between items-center gap-4 lg:block mb-4 md:mb-0">
            <p className="font-bold text-2xl md:text-3xl">Dashboard</p>
            <div className="flex w-full md:w-auto justify-between items-center gap-4 md:hidden">
              <div className="bg-[#efecec] h-10 w-10 rounded-[50%] flex items-center justify-center">
                <Notifications sx={{ color: "#828282" }} />
              </div>
              <div className="bg-[#eef5f7] h-10 w-10 rounded-[50%] flex items-center justify-center">
                <Chat sx={{ fontSize: "20px" }} />
              </div>
              <div className="flex justify-center items-center gap-2 rounded-3xl px-3 py-2 w-1/2 md:w-auto">
                <p className="text-sm font-bold">{fullName}</p>
                <div className="flex items-center justify-center bg-[#488c9d] h-12 w-12 rounded-[50%]">
                  <Image
                    src={pp}
                    alt="profile img"
                    width={40}
                    height={40}
                    className="rounded-[50%]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-[50%] flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="bg-[#eef5f7] w-full md:w-1/2 flex items-center px-2 py-3 rounded-xl md:hidden lg:flex">
              <Search sx={{ color: "#000" }} />
              <input
                type="text"
                className="outline-none bg-transparent placeholder:text-sm w-full"
                placeholder="Search"
              />
            </div>
            <div className="hidden md:flex w-full md:w-auto justify-between items-center gap-4">
              <div className="bg-[#eef5f7] h-10 w-10 rounded-[50%] flex items-center justify-center">
                <Notifications sx={{ fontSize: "20px" }} />
              </div>
              <div className="bg-[#eef5f7] h-10 w-10 rounded-[50%] flex items-center justify-center">
                <Chat sx={{ fontSize: "20px" }} />
              </div>
              <div className="flex justify-center items-center gap-2 rounded-3xl px-3 py-2 w-1/2 md:w-auto">
                <p className="text-sm font-bold">{fullName}</p>
                <div className="flex items-center justify-center bg-[#488c9d] h-12 w-12 rounded-[50%]">
                  <Image
                    src={pp}
                    alt="profile img"
                    width={40}
                    height={40}
                    className="rounded-[50%]"
                  />
                </div>
              </div>
            </div>
          </div>
        </Box>
        <br />

        <div className="flex justify-between">
          {/* Main Content */}
          <Container
            maxWidth="lg"
            sx={{
              px: { xs: 2, sm: 3, md: 2 },
              maxWidth: "100%", // Ensure container doesn't exceed parent width
              overflowX: "hidden", // Prevent horizontal scrolling
            }}
          >
            {/* Summary Cards */}
            <Box sx={{ mt: 4 }}>
              {loadingSummary ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : errorSummary ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errorSummary}
                </Alert>
              ) : (
                <FinancialDataCardDisplay data={summaryData} />
              )}
              {loadingSummary ? (
                <IconButton onClick={fetchSummaryData} size="small">
                  <Refresh />
                </IconButton>
              ) : null}
            </Box>

            <div className="flex gap-4 justify-around">
              {/* Savings Plans */}
              <div className="max-w-md mx-auto bg-gray-50 p-4">
                {/* Quick Action Buttons */}
                <div className="grid grid-cols-4 gap-2 bg-[#f0f8f0] rounded-xl p-4 mb-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mb-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </div>
                    <span className="text-xs text-gray-700">Top Up</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mb-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="8 12 12 16 16 12"></polyline>
                        <line x1="12" y1="8" x2="12" y2="16"></line>
                      </svg>
                    </div>
                    <span className="text-xs text-gray-700">Transfer</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mb-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="16 12 12 8 8 12"></polyline>
                        <line x1="12" y1="16" x2="12" y2="8"></line>
                      </svg>
                    </div>
                    <span className="text-xs text-gray-700">Request</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mb-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                    </div>
                    <span className="text-xs text-gray-700">History</span>
                  </div>
                </div>

                {/* Daily Limit */}
                <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-base font-medium">Daily Limit</div>
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="12" cy="5" r="1"></circle>
                        <circle cx="12" cy="19" r="1"></circle>
                      </svg>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm">
                      <span className="font-medium">$2,500.00</span>
                      <span className="text-gray-500 text-xs"> spent of </span>
                      <span>$20,000.00</span>
                    </div>
                    <div className="text-sm text-green-600 font-medium">
                      12.5%
                    </div>
                  </div>

                  <div className="h-2 w-full bg-gradient-to-r from-green-100 to-green-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#1a4d3c] w-[12.5%] rounded-full"></div>
                  </div>
                </div>

                {/* Saving Plans */}
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-base font-medium">Saving Plans</div>
                    <div className="text-xs text-green-600 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-1"
                      >
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                      Add Plan
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-xs text-gray-500">Total Savings</div>
                    <div className="text-2xl font-bold text-gray-800">
                      $84,500
                    </div>
                  </div>

                  {/* Emergency Fund */}
                  <div className="bg-[#f0f8f0] rounded-xl p-3 mb-3">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#f59e0b"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                            <line x1="12" y1="9" x2="12" y2="13"></line>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                          </svg>
                        </div>
                        <span className="text-sm font-medium">
                          Emergency Fund
                        </span>
                      </div>
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="1"></circle>
                          <circle cx="12" cy="5" r="1"></circle>
                          <circle cx="12" cy="19" r="1"></circle>
                        </svg>
                      </div>
                    </div>

                    <div className="h-2 w-full bg-gradient-to-r from-green-100 to-green-200 rounded-full overflow-hidden mb-2">
                      <div className="h-full bg-[#1a4d3c] w-[50%] rounded-full"></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        <span>$5,000</span>
                        <span className="text-green-600 ml-1">50%</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        <span>Target: </span>
                        <span className="font-medium">Target $10,000</span>
                      </div>
                    </div>
                  </div>

                  {/* Vacation Fund */}
                  <div className="bg-[#f0f8f0] rounded-xl p-3 mb-3">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="22" y1="12" x2="2" y2="12"></line>
                            <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
                            <line x1="6" y1="16" x2="6.01" y2="16"></line>
                            <line x1="10" y1="16" x2="10.01" y2="16"></line>
                          </svg>
                        </div>
                        <span className="text-sm font-medium">
                          Vacation Fund
                        </span>
                      </div>
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="1"></circle>
                          <circle cx="12" cy="5" r="1"></circle>
                          <circle cx="12" cy="19" r="1"></circle>
                        </svg>
                      </div>
                    </div>

                    <div className="h-2 w-full bg-gradient-to-r from-green-100 to-green-200 rounded-full overflow-hidden mb-2">
                      <div className="h-full bg-[#1a4d3c] w-[60%] rounded-full"></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        <span>$3,000</span>
                        <span className="text-green-600 ml-1">60%</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        <span>Target: </span>
                        <span className="font-medium">Target $5,000</span>
                      </div>
                    </div>
                  </div>

                  {/* Home Down Payment */}
                  <div className="bg-[#f0f8f0] rounded-xl p-3">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#6366f1"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                          </svg>
                        </div>
                        <span className="text-sm font-medium">
                          Home Down Payment
                        </span>
                      </div>
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="1"></circle>
                          <circle cx="12" cy="5" r="1"></circle>
                          <circle cx="12" cy="19" r="1"></circle>
                        </svg>
                      </div>
                    </div>

                    <div className="h-2 w-full bg-gradient-to-r from-green-100 to-green-200 rounded-full overflow-hidden mb-2">
                      <div className="h-full bg-[#1a4d3c] w-[36.25%] rounded-full"></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        <span>$7,250</span>
                        <span className="text-green-600 ml-1">36.25%</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        <span>Target: </span>
                        <span className="font-medium">Target $20,000</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual Charts */}
              <Box sx={{ mt: 6 }}>
                {/* Line Graph */}
                <Paper sx={{ p: { xs: 2, md: 3 }, mb: 4, maxWidth: "93%" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <p className="text-xl md:text-2xl text-[#273043] font-bold">
                      Sales Trends
                    </p>
                    <div className="flex items-center gap-2 px-2 py-2 border border-[#cbe1e7] text-sm font-medium rounded-lg cursor-pointer">
                      <p>This Year</p>
                      <ExpandMore />
                    </div>
                    {loadingSales ? (
                      <IconButton onClick={fetchSalesData} size="small">
                        <Refresh />
                      </IconButton>
                    ) : null}
                  </Box>
                  <div className="mt-5 mb-8 flex">
                    <div>
                      <p className="text-sm">Total Balance</p>
                      <p className="text-2xl font-bold text-[#386d7a]">
                        ₦500,000
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#284e57] rounded-lg"></div>
                        <p className="text-xs ">Income</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#85bac7] rounded-lg"></div>
                        <p className="text-xs ">Expenses</p>
                      </div>
                    </div>
                  </div>
                  {loadingSales ? (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        p: 4,
                        height: { xs: 200, sm: 300, md: 400 },
                      }}
                    >
                      <CircularProgress />
                    </Box>
                  ) : errorSales ? (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {errorSales}
                    </Alert>
                  ) : (
                    <Box sx={{ height: { xs: 300, sm: 300, md: 300 } }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={salesData}>
                          <CartesianGrid
                            strokeDasharray="5 5"
                            stroke="#e0e0e0"
                          />
                          <XAxis
                            dataKey="name"
                            stroke="#888888"
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis
                            dataKey="revenue"
                            stroke="#888888"
                            tick={{ fontSize: 12 }}
                            // Hide Y-axis on mobile to save space
                            hide={isMobile}
                            tickFormatter={(value) => formatNumber(value)}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#fff",
                              borderRadius: "5px",
                              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.15)",
                            }}
                            itemStyle={{ fontSize: "14px" }}
                            formatter={(value: number) => formatNumber(value)}
                          />

                          <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#284e57"
                            strokeWidth={3}
                            dot={{
                              r: isMobile ? 2 : 4,
                              fill: "#284e57",
                              stroke: "#fff",
                              strokeWidth: 2,
                            }}
                            activeDot={{ r: isMobile ? 4 : 6 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="expenditure"
                            stroke="#85bac7"
                            strokeWidth={3}
                            dot={{
                              r: isMobile ? 2 : 4,
                              fill: "#85bac7",
                              stroke: "#fff",
                              strokeWidth: 2,
                            }}
                            activeDot={{ r: isMobile ? 4 : 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </Box>
                  )}
                </Paper>

                {/* Data Table */}
                <Paper sx={{ p: { xs: 2, md: 3 }, mb: 4, maxWidth: "93%" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                      fontSize: "12px",
                    }}
                  >
                    <p className="text-xl md:text-2xl text-[#273043] font-bold text-nowrap">
                      Recent Transactions
                    </p>
                    {loadingBudget ? (
                      <IconButton onClick={fetchBudgetData} size="small">
                        <Refresh />
                      </IconButton>
                    ) : null}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: { xs: "stretch", sm: "center" },
                        justifyContent: "end",
                        width: "100%",
                        gap: 2,
                        mb: 3,
                        mt: 2,
                      }}
                    >
                      <TextField
                        label="Filter by Transaction Name"
                        id="outlined-size-small"
                        variant="outlined"
                        value={filterName}
                        onChange={handleFilterChange}
                        sx={{
                          flex: { xs: "1", sm: "0 0 50%" },
                          maxWidth: { sm: "600px" },
                        }}
                        size="small"
                      />
                    </Box>
                  </Box>

                  {loadingBudget ? (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        p: 4,
                        height: { xs: 200, sm: 300, md: 400 },
                      }}
                    >
                      <CircularProgress />
                    </Box>
                  ) : errorBudget ? (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {errorBudget}
                    </Alert>
                  ) : (
                    <>
                      {/* Responsive filter input */}

                      {/* Responsive table */}
                      <TableContainer
                        sx={{
                          overflowX: "auto",
                          maxWidth: "100%", // Add this to ensure it doesn't exceed parent width
                          "&::-webkit-scrollbar": {
                            height: "8px",
                          },
                          "&::-webkit-scrollbar-thumb": {
                            backgroundColor: "rgba(0,0,0,0.2)",
                            borderRadius: "4px",
                          },
                        }}
                      >
                        <Table sx={{ minWidth: { xs: 500, md: 650 } }}>
                          <TableHead sx={{ backgroundColor: "#cbe1e7" }}>
                            <TableRow>
                              <TableCell>
                                <TableSortLabel
                                  active={orderBy === "name"}
                                  direction={orderBy === "name" ? order : "asc"}
                                  onClick={() => handleRequestSort("name")}
                                >
                                  Transaction Name
                                </TableSortLabel>
                              </TableCell>
                              <TableCell align="right">
                                <TableSortLabel
                                  active={orderBy === "amount"}
                                  direction={
                                    orderBy === "amount" ? order : "asc"
                                  }
                                  onClick={() => handleRequestSort("amount")}
                                >
                                  Amount
                                </TableSortLabel>
                              </TableCell>
                              <TableCell align="right">
                                <TableSortLabel
                                  active={orderBy === "dateModified"}
                                  direction={
                                    orderBy === "dateModified" ? order : "asc"
                                  }
                                  onClick={() =>
                                    handleRequestSort("dateModified")
                                  }
                                  sx={{ fontSize: "14px" }}
                                >
                                  Date
                                </TableSortLabel>
                              </TableCell>
                              <TableCell align="center">
                                <TableSortLabel
                                  active={orderBy === "note"}
                                  direction={orderBy === "note" ? order : "asc"}
                                  onClick={() => handleRequestSort("note")}
                                >
                                  Note
                                </TableSortLabel>
                              </TableCell>
                              <TableCell align="right">
                                <TableSortLabel
                                  active={orderBy === "status"}
                                  direction={
                                    orderBy === "status" ? order : "asc"
                                  }
                                  onClick={() => handleRequestSort("status")}
                                >
                                  Status
                                </TableSortLabel>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {sortedRows.map((row) => (
                              <TableRow key={row.name}>
                                <TableCell component="th" scope="row">
                                  {row.name}
                                </TableCell>
                                <TableCell align="right">
                                  {row.amount.toLocaleString("en-NG", {
                                    style: "currency",
                                    currency: "NGN",
                                  })}
                                </TableCell>
                                <TableCell align="right">
                                  {row.dateSold}
                                </TableCell>
                                <TableCell align="right">{row.note}</TableCell>
                                <TableCell align="center">
                                  <div className="flex justify-end">
                                    <div
                                      className={`${getStatusColor(
                                        row.status
                                      )} text-white rounded-md p-2 w-24 flex justify-center items-center`}
                                    >
                                      {row.status}
                                    </div>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </>
                  )}
                </Paper>
              </Box>
            </div>
          </Container>

          {/* Statistics tab */}

          <div className="max-w-md mx-auto rounded-xl overflow-hidden">
            {/* Statistics Section */}
            <div className="p-5 border border-[#cbe1e7] rounded-lg mt-4">
              <div className="flex justify-between items-center mb-4">
                <p className="text-lg font-semibold">Statistics</p>
                <div className="relative">
                  <div className="flex items-center gap-1 text-sm cursor-pointer">
                    <span className="text-xs">{timeframe}</span>
                    <ExpandMore />
                  </div>
                </div>
              </div>

              <div className="flex justify-between mb-4">
                <div className="text-sm">
                  <span className="font-medium">Income </span>
                  <span className="text-gray-500 font-semibold">(₦5M)</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Expense </span>
                  <span className="text-gray-500 font-semibold">(₦600K)</span>
                  <div className="h-0.5 bg-[#284e57] mt-1"></div>
                </div>
              </div>

              {/* Donut Chart */}
              <Box sx={{ height: { xs: 300, sm: 400, md: 250 } }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={isMobile ? 100 : isTablet ? 100 : 100}
                      innerRadius={isMobile ? 35 : isTablet ? 50 : 50}
                      fill="#8884d8"
                      dataKey="value"
                      animationDuration={1000}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        borderRadius: "5px",
                        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.15)",
                        fontSize: "14px",
                      }}
                      labelStyle={{ fontWeight: "bold" }}
                      formatter={(value) => `${value} units`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>

              {/* Expense Categories */}
              <div className="space-y-3">
                {/* Rent & Living */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded p-2 bg-[#284e57] flex items-center justify-center">
                      <span className="text-xs font-medium">60%</span>
                    </div>
                    <span className="text-sm">Rent & Living</span>
                  </div>
                  <span className="text-sm font-medium">₦400,000</span>
                </div>

                {/* Investment */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded p-2 bg-[#386d7a] flex items-center justify-center">
                      <span className="text-xs font-medium">20%</span>
                    </div>
                    <span className="text-sm">Investment</span>
                  </div>
                  <span className="text-sm font-medium">₦52,000</span>
                </div>

                {/* Education */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded p-2 bg-[#62a6b7] flex items-center justify-center">
                      <span className="text-xs font-medium">10%</span>
                    </div>
                    <span className="text-sm">Education</span>
                  </div>
                  <span className="text-sm font-medium">₦42,000</span>
                </div>

                {/* Food & Drink */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded p-2 bg-[#85bac7] flex items-center justify-center">
                      <span className="text-xs font-medium">9%</span>
                    </div>
                    <span className="text-sm">Food & Drink</span>
                  </div>
                  <span className="text-sm font-medium">₦28,000</span>
                </div>

                {/* Entertainment */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded p-2 bg-[#cbe1e7] flex items-center justify-center">
                      <span className="text-xs font-medium">7%</span>
                    </div>
                    <span className="text-sm">Entertainment</span>
                  </div>
                  <span className="text-sm font-medium">₦17,005</span>
                </div>
              </div>
            </div>

            {/* Recent Activity Section */}
            <div className="p-5 border border-[#cbe1e7] rounded-lg mt-5">
              <div className="flex justify-between items-center mb-4">
                <p className="text-lg font-semibold">Recent Activity</p>
                <MoreVert />
              </div>

              <div>
                <div className="text-sm font-medium mb-3">Today</div>

                {/* Jamie Smith */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#488c9d] overflow-hidden flex-shrink-0">
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-xs text-[#182f34]">JS</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm">
                      <span className="font-medium">Jamie Smith</span>
                      <span> updated account settings</span>
                    </div>
                    <div className="text-xs text-gray-500">10:30</div>
                  </div>
                </div>

                {/* Alex Johnson */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#488c9d] overflow-hidden flex-shrink-0">
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-xs text-[#182f34]">AJ</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm">
                      <span className="font-medium">Alex Johnson</span>
                      <span> logged in</span>
                    </div>
                    <div className="text-xs text-gray-500">09:01</div>
                  </div>
                </div>

                {/* Morgan Lee */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#488c9d] overflow-hidden flex-shrink-0">
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-xs text-[#182f34]">ML</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm">
                      <span className="font-medium">Morgan Lee</span>
                      <span> added a new savings goal for vacation</span>
                    </div>
                    <div className="text-xs text-gray-500">08:45</div>
                  </div>
                </div>

                <div className="text-sm font-medium mb-3 mt-5">Yesterday</div>

                {/* Taylor Green */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#488c9d] overflow-hidden flex-shrink-0">
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-xs text-[#182f34]">TG</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm">
                      <span className="font-medium">Taylor Green</span>
                      <span> reviewed recent transactions</span>
                    </div>
                    <div className="text-xs text-gray-500">21:25</div>
                  </div>
                </div>

                {/* Wilson Baptiste */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#488c9d] overflow-hidden flex-shrink-0">
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-xs text-[#182f34]">WB</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm">
                      <span className="font-medium">Wilson Baptiste</span>
                      <span> transferred funds to emergency fund</span>
                    </div>
                    <div className="text-xs text-gray-500">09:02</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Box>
    </Box>
  );
}
