import { RssFeed, Wallet } from "@mui/icons-material";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";

interface CardDataValues {
  title: string;
  amount: number;
  // budgetamount: number ;
  percentage?: number | undefined;
  note?: string | undefined;
}

interface FinancialDataCardProps {
  data: CardDataValues[];
  route?: string;
}

function formatAmount(amount: number): string {
  return `₦${amount.toLocaleString()}`;
}

const fullName = localStorage.getItem("currentUser")
  ? JSON.parse(localStorage.getItem("currentUser")!).fullName
  : "";

const FinancialDataCardDisplay: React.FC<FinancialDataCardProps> = ({
  data,
}) => {
  // const router = usePathname();
  return (
    <div className="-mt-8">
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-4 justify-items-center mx-auto w-[80%]"> */}
      <div className="w-full flex justify-between items-center gap-4">
        <div className="w-[95%] bg-[#386d7a] rounded-xl px-4 py-3">
          <div className="flex justify-between items-center">
            <Wallet sx={{ color: "#eef5f7", fontSize: 36 }} />
            <RssFeed sx={{ color: "#eef5f7", fontSize: 36 }} />
          </div>
          <br />
          <div>
            <p className="text-3xl text-[#eef5f7] font-bold">{fullName}</p>
          </div>
          <br />
          <div className="flex justify-between items-center">
            <div className="text-[#eef5f7]">
              <p className="text-xs text-gray-300">Balance Amount</p>
              <p className="text-xl font-bold">₦500,000</p>
            </div>
            <div className="w-[20%] flex justify-between items-center">
              <div className="text-[#eef5f7]">
                <p className="text-xs text-gray-300">EXP</p>
                <p className="text-xs font-semibold">11/27</p>
              </div>
              <div className="text-[#eef5f7]">
                <p className="text-xs text-gray-300">CVV</p>
                <p className="text-xs font-semibold">127</p>
              </div>
            </div>
          </div>
        </div>
        {data.map((item, index) => (
          <div
            key={index}
            className="w-1/2 border border-[#E6E8ED] rounded-lg bg-[#FFF] p-5"
          >
            <div>
              <p className="font-medium text-gray-600">{item.title}</p>
              <p className="font-bold text-2xl text-main_black mt-2">
                {`${formatAmount(item.amount)}`}
              </p>
            </div>{" "}
            <div className="flex gap-2 items-center mt-3">
              {item.percentage !== undefined && (
                <div className="flex gap-1 items-center py-1 px-2 bg-[#eef5f7] border rounded-md shadow-box_shadow text-sm">
                  <ArrowCircleUpIcon sx={{ color: "green" }} />
                  <p className="text-main_black">{`+${item.percentage}%`}</p>
                </div>
              )}
              {item.note !== undefined && (
                <p className="text-xs text-main_grey">{item.note}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinancialDataCardDisplay;
