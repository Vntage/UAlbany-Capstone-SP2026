type ReportType = 
    | "Income"
    | "Expense"
    | "Cashflow"
    | "Category Breakdown";

type ReportModal = {
    open: boolean;
    onClose: () => void;
    reportType: ReportType;
    data: any;
    currency: string;
    onExport: () => void;
}

const formatCurrency = (value: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {style: "currency",currency}).format(value || 0);
};

export default function ReportModal({
    open, 
    onClose,
    reportType,
    data,
    currency,
    onExport,
}: ReportModal) {
    if(!open) return;

    return(
        <div className = "fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className = "bg-white rounded-2xl w-full max-w-lg p-6">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-xl font-bold">
                        {reportType} Report
                    </h2>
                    <button className="text-gray-400 hover:text-black text-xl" onClick={onClose}>✕</button>
                </div>

                <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
                    <button
                        onClick={onExport}
                        className = "px-4 py-1 rounded-md text-sm transition bg-white shadow font-medium text-gray-600"
                    >
                        Export PDF
                    </button>
                </div>
            </div>

            <div className="space-y-3">
                {!data ? (
                    <p>Loading...</p>
                ):(
                    <>
                        {reportType === "Income" &&(
                            <div>
                                <div className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                    <span>Revenue</span>
                                    <span>{formatCurrency(data.income, currency)}</span>
                                </div>
                                <div className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                    <span>Expenses</span>
                                    <span>{formatCurrency(data.expenses, currency)}</span>
                                </div>
                                <div className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                    <span>Net Profit</span>
                                    <span>{formatCurrency(data.netProfit, currency)}</span>
                                </div>
                            </div>
                        )}
                        {reportType === "Expense" && (
                            <table className="w-full text-sm">
                                <tbody className="text-xs uppercase text-gray-400 border-b">
                                    {data.map((row:any) => {
                                        <tr key={row.category}>
                                            <td>{row.category}</td>
                                            <td>{formatCurrency(row.total, currency)}</td>
                                        </tr>
                                    })}
                                </tbody>
                            </table>
                        )}
                        {reportType === "Cashflow" && (
                            <table className="w-full text-sm">
                                <tbody className="text-xs uppercase text-gray-400 border-b">
                                    {data.map((row:any) => {
                                        <tr key={row.date}>
                                            <td>
                                                {formatCurrency(row.income, currency)}
                                            </td>
                                            <td>
                                                {formatCurrency(row.expense, currency)}
                                            </td>
                                        </tr>
                                    })}
                                </tbody>
                            </table>
                        )}
                        {reportType === "Category Breakdown" && (
                            <table className="w-full text-sm">
                                <tbody className="text-xs uppercase text-gray-400 border-b">
                                    {data.map((row:any) => {
                                        <tr key={row.category}>
                                            <td>{row.category}</td>
                                            <td>{formatCurrency(row.total, currency)}</td>
                                        </tr>
                                    })}
                                </tbody>
                            </table>
                        )}
                    </>
                )
                }
            </div>
        </div>
    )
}
