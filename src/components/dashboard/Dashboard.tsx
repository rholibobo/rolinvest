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
  AddBoxOutlined,
  CurrencyExchangeOutlined,
  ScheduleOutlined,
  AddOutlined,
  ReportProblemOutlined,
  AirplanemodeActiveOutlined,
  HomeOutlined,
  LockOpenOutlined,
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
    <div className="md:pb-8">
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
        
        <br />
      <div className="w-[93%] mx-auto bg-[#284e57] rounded-lg px-4 py-5">
        <div className="w-8 h-8 flex justify-center items-center bg-white p-3 rounded-md">
          <LockOpenOutlined sx={{ color: "#284e57", fontSize: 26 }} />
          
        </div>
        <br />
        <br />
        <div>
          <p className="text-[#eef5f7]">Gain full access to your finances with detailed analytics and graphs</p>
        </div>

          <br />
        <div className="w-1/2 bg-[#30ca68] flex justify-center items-center rounded-md px-3 py-2">
          <p className="text-lg text-nowrap font-semibold">Get Pro</p>
        </div>
        
        
      </div>
    </div>
  );

  return (
    <div className="w-full flex overflow-hidden bg-[#FCFCFC]">
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
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: 220 },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: 220 },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <main className="w-full md:w-[calc(100%_-_200px)] overflow-x-hidden">
        {/* Header */}
        <div className="bg-[#f0f5f6] md:bg-transparent lg:bg-transparent w-full flex items-center fixed md:relative top-0 left-0 z-[1200] px-3 md:px-0 py-4 md:py-2">
          <Wallet
            sx={{
              display: { xs: "block", sm: "none" },
              color: "#284e57",
              fontSize: 44,
            }}
          />
          <Box
            className="w-full flex flex-col md:flex-row justify-between items-start md:items-center bg-transparent rounded-none px-4 md:px-6 py-2"
            sx={{
              mt: { xs: 0, sm: 0 },
              height: { xs: "auto", md: "80px" },
            }}
          >
            <p className="w-full md:w-fit font-bold text-2xl md:text-3xl text-center md:text-start">
              Dashboard
            </p>

            <div className="w-full md:w-[55%] flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="bg-[#eef5f7] w-full md:w-1/2 hidden items-center px-2 py-3 rounded-xl lg:flex">
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
          {/* Mobile menu button */}
          <Box
            sx={{
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
        </div>

        <br />

        <div className="flex flex-col lg:flex-row justify-between mt-20 md:mt-0">
          {/* Main Content */}
          <main className="px-2 sm:px-3 md:px-2 max-w-full overflow-x-hidden">
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

            <div className="flex flex-col lg:flex-row justify-between">
              {/* Savings Plans */}
              <div className="w-full lg:w-[35%] mt-8 md:pr-3 ">
                {/* Quick Action Buttons */}
                <div className="grid grid-cols-4 gap-2 bg-[#cbe1e7] rounded-xl p-4 mb-4">
                  <div className="flex flex-col gap-2 items-center  ">
                    <AddBoxOutlined sx={{ color: "#386d7a" }} />
                    <span className="text-xs text-[#284e57] font-medium">
                      Top Up
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 items-center ">
                    <CurrencyExchangeOutlined sx={{ color: "#386d7a" }} />
                    <span className="text-xs text-[#284e57] font-medium">
                      Transfer
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 items-center ">
                    <CurrencyExchangeOutlined sx={{ color: "#386d7a" }} />
                    <span className="text-xs text-[#284e57] font-medium">
                      Request
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 items-center">
                    <ScheduleOutlined sx={{ color: "#386d7a" }} />
                    <span className="text-xs text-[#284e57] font-medium">
                      History
                    </span>
                  </div>
                </div>

                {/* Daily Limit */}
                <div className="bg-white rounded-xl p-4 border mb-4 shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-base font-bold">Daily Limit</p>
                  </div>

                  <div className="flex justify-between items-center mb-2">
                    <div className="text-xs">
                      <span className="font-medium">₦2,500.00</span>
                      <span className="text-gray-500"> spent of </span>
                      <span className="text-sm">₦20,000.00</span>
                    </div>
                    <div className="text-xs text-green-600 font-medium">
                      12.5%
                    </div>
                  </div>

                  <div className="h-2 w-full bg-gradient-to-r from-[#85bac7] to-[#cbe1e7] rounded-full overflow-hidden">
                    <div className="h-full bg-[#386d7a] w-[12.5%] rounded-full"></div>
                  </div>
                </div>

                {/* Saving Plans */}
                <div className="bg-white rounded-xl p-4 shadow-sm border">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-base font-bold">Saving Plans</p>

                    <AddOutlined sx={{ color: "#386d7a" }} fontSize="small" />
                  </div>

                  <div className="mb-4">
                    <div className="text-xs text-gray-500">Total Savings</div>
                    <div className="text-lg font-bold text-gray-800">
                      ₦84,500
                    </div>
                  </div>

                  {/* Emergency Fund */}
                  <div className="border rounded-xl p-3 mb-3">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-1">
                        <ReportProblemOutlined
                          fontSize="small"
                          sx={{ color: "#85bac7" }}
                        />
                        <span className="text-xs font-medium">
                          Emergency Fund
                        </span>
                      </div>
                      <MoreVert fontSize="small" />
                    </div>

                    <div className="h-2 w-full bg-gradient-to-r from-[#85bac7] to-[#cbe1e7] rounded-full overflow-hidden mb-2">
                      <div className="h-full bg-[#386d7a] w-[50%] rounded-full"></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-xs">
                        <span>₦5,000</span>
                        <span className="text-green-600 ml-1">50%</span>
                      </div>
                    </div>
                  </div>

                  {/* Vacation Fund */}
                  <div className="border rounded-xl p-3 mb-3">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <AirplanemodeActiveOutlined
                          fontSize="small"
                          sx={{ color: "#85bac7" }}
                        />
                        <span className="text-xs font-medium">
                          Vacation Fund
                        </span>
                      </div>
                      <MoreVert fontSize="small" />
                    </div>

                    <div className="h-2 w-full bg-gradient-to-r from-[#85bac7] to-[#cbe1e7] rounded-full overflow-hidden mb-2">
                      <div className="h-full bg-[#386d7a] w-[60%] rounded-full"></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-xs">
                        <span>₦3,000</span>
                        <span className="text-green-600 ml-1">60%</span>
                      </div>
                    </div>
                  </div>

                  {/* Home Down Payment */}
                  <div className="border rounded-xl p-3">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <HomeOutlined
                          fontSize="small"
                          sx={{ color: "#85bac7" }}
                        />
                        <span className="text-xs font-medium">
                          Home Down Payment
                        </span>
                      </div>
                      <MoreVert fontSize="small" />
                    </div>

                    <div className="h-2 w-full bg-gradient-to-r from-[#85bac7] to-[#cbe1e7] rounded-full overflow-hidden mb-2">
                      <div className="h-full bg-[#386d7a] w-[36.25%] rounded-full"></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-xs">
                        <span>₦7,250</span>
                        <span className="text-green-600 ml-1">36.25%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual Charts */}
              <div className="w-full lg:w-[70%] mt-8">
                {/* Line Graph */}
                <Paper sx={{ p: { xs: 2, md: 3 }, mb: 4, maxWidth: "100%" }}>
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
                <Paper sx={{ p: { xs: 2, md: 3 }, mb: 4, maxWidth: "100%" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                      gap: 2,
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
                                  <p className="font-semibold">{row.name}</p>
                                  <p className="text-xs text-gray-500">
                                    {row.category}
                                  </p>
                                </TableCell>
                                <TableCell align="right">
                                  <p className="font-semibold">
                                    {row.amount.toLocaleString("en-NG", {
                                      style: "currency",
                                      currency: "NGN",
                                    })}
                                  </p>
                                </TableCell>
                                <TableCell align="right">
                                  <p className="text-nowrap">{row.dateSold}</p>
                                  <p className="text-xs text-gray-500">
                                    {row.time}
                                  </p>
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
              </div>
            </div>
          </main>

          {/* Statistics tab */}

          <div className="w-[95%] lg:max-w-[18rem] mx-auto rounded-xl overflow-hidden">
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
      </main>
    </div>
  );
}
