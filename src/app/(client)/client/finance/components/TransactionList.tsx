import { IClientTransaction } from "@/types/interfaces/IClientFinance";
import { Calendar } from "lucide-react";

interface TransactionListProps {
  transactions: IClientTransaction[];
  type: "spent" | "refund";
}

export default function TransactionList({ transactions, type }: TransactionListProps) {
  const getStatusBadge = (status: string) => {
    return (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Completed
      </span>
    );
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No {type === "spent" ? "spending" : "refund"} transactions yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div
          key={transaction.transactionId}
          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">
                {transaction.description}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {type === "spent" ? "To" : "From"}: {transaction.freelancerName}
              </p>
            </div>
            <div className="text-right">
              <p
                className={`text-xl font-bold ${
                  type === "spent" ? "text-red-600" : "text-green-600"
                }`}
              >
                {type === "spent" ? "-" : "+"}₹{transaction.amount.toFixed(2)}
              </p>
              {getStatusBadge("completed")}
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-500 mt-2">
            <Calendar className="w-4 h-4 mr-1" />
            {transaction.createdAt}
            <span className="mx-2">•</span>
            <span className="capitalize">{transaction.purpose}</span>
            <span className="mx-2">•</span>
            <span className="text-xs font-mono">{transaction.transactionId}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
