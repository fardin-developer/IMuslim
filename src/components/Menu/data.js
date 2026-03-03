import DashboardIcon from "@mui/icons-material/Dashboard";
import PhoneIcon from "@mui/icons-material/Phone";
import QuizIcon from "@mui/icons-material/Quiz";
import Person2Icon from "@mui/icons-material/Person2";
import ShareIcon from "@mui/icons-material/Share";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

export const userMenu = [
  {
    name: "Dashboard",
    path: "/user-dashboard",
    icon: DashboardIcon,
  },
  {
    name: "Refferal",
    path: "/refer-link",
    icon: ShareIcon,
  },
  {
    name: "Add Money",
    path: "/add-money",
    icon: AccountBalanceWalletIcon,
  },
  {
    name: "Withdraw",
    path: "/withdraw-money",
    icon: AccountBalanceIcon,
  },
  {
    name: "Quiz",
    path: "/quiz",
    icon: QuizIcon,
  },
  {
    name: "Result",
    path: "/quiz-result",
    icon: AutoStoriesIcon,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: Person2Icon,
  },
];

//admin menu
export const adminMenu = [
  {
    name: "Dashboard",
    path: "/user-dashboard",
    icon: DashboardIcon,
  },
  {
    name: "Users",
    path: "/all-users",
    icon: Person2Icon,
  },
  {
    name: "Quiz",
    path: "/admin-quiz",
    icon: QuizIcon,
  },
  {
    name: "Activation Fees",
    path: "/admin-activation-fees",
    icon: PointOfSaleIcon,
  },
  {
    name: "Payment Request",
    path: "/payment-request",
    icon: AccountBalanceIcon,
  },
  {
    name: "Withdraw Request",
    path: "/withdraw-request",
    icon: AccountBalanceWalletIcon,
  },
];
