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
                    <h2 className="text-xl font-bold text-gray-900">
                        {reportType} Report
                    </h2>
                    <button className="text-gray-400 hover:text-black text-xl transition" onClick={onClose}>✕</button>
                </div>

                <div className="flex gap-2 mb-6">
                    <button
                        onClick={onExport}
                        className = "px-4 py-2 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-700 transition shadow"
                    >
                        Export PDF
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {!data ? (
                    <p className="text-gray-500 text-sm">Loading...</p>
                ):(
                    <>
                        {reportType === "Income" &&(
                            <div className="space-y-3">
                                <div className="flex justify-between items-center px-4 py-3 border rounded-lg bg-gray-50">
                                    <span className="text-gray-600">Revenue:</span>
                                    <span className="font-medium text-gray-900">{formatCurrency(data.income, currency)}</span>
                                </div>
                                <div className="flex justify-between items-center px-4 py-3 border rounded-lg bg-gray-50">
                                    <span className="text-gray-600">Expenses:</span>
                                    <span className="font-medium text-gray-900">{formatCurrency(data.expenses, currency)}</span>
                                </div>
                                <div className="flex justify-between items-center px-4 py-3 border rounded-lg bg-gray-50">
                                    <span className="text-gray-700 font-medium">Net Profit:</span>
                                    <span className="font-bold text-blue-700">{formatCurrency(data.netProfit, currency)}</span>
                                </div>
                            </div>
                        )}
                        {reportType === "Expense" && (
                            <table className="w-full text-sm">
                                <thead>
                                        <tr className="text-xs text-gray-400 border-b">
                                            <th className="text-left py-2">Category</th>
                                            <th className="text-right py-2">Total</th>
                                        </tr>
                                </thead>
                                <tbody>
                                    {data.map((row:any) => {
                                        <tr key={row.category} className="border-b last:border-none hover:bg-gray-50">
                                            <td className="py-2 text-gray-700">{row.category}</td>
                                            <td className="py-2 text-right font-medium">{formatCurrency(row.total, currency)}</td>
                                        </tr>
                                    })}
                                </tbody>
                            </table>
                        )}

                        {reportType === "Cashflow" && (
                            <table className="w-full text-sm">
                                <thead>
                                        <tr className="text-xs text-gray-400 border-b">
                                            <th className="text-left py-2">Income</th>
                                            <th className="text-right py-2">Expense</th>
                                        </tr>
                                </thead>
                                <tbody className="text-xs uppercase text-gray-400 border-b">
                                    {data.map((row:any) => {
                                        <tr key={row.date} className="border-b last:border-none hover:bg-gray-50">
                                            <td className="py-2 text-green-600 font-medium">
                                                {formatCurrency(row.income, currency)}
                                            </td>
                                            <td className="py-2 text-right text-red-600 font-medium">
                                                {formatCurrency(row.expense, currency)}
                                            </td>
                                        </tr>
                                    })}
                                </tbody>
                            </table>
                        )}

                        {reportType === "Category Breakdown" && (
                            <table className="w-full text-sm">
                                <thead>
                                        <tr className="text-xs text-gray-400 border-b">
                                            <th className="text-left py-2">Category</th>
                                            <th className="text-right py-2">Total</th>
                                        </tr>
                                </thead>
                                <tbody className="text-xs uppercase text-gray-400 border-b">
                                    {data.map((row:any) => {
                                        <tr key={row.category} className="border-b last:border-none hover:bg-gray-50">
                                            <td className="py-2 text-gray-700">{row.category}</td>
                                            <td className="py-2 text-right font-medium">{formatCurrency(row.total, currency)}</td>
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
