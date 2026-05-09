export function IncomeTable({ data, currency }: any) {
    return(
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">

                {/* Header */}
                <thead className="bg-gray-50 border-b">
                    <tr>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                            Period
                        </th>

                        <th className="text-right px-6 py-4 text-sm font-semibold text-green-600">
                            Income
                        </th>

                        <th className="text-right px-6 py-4 text-sm font-semibold text-red-500">
                            Expense
                        </th>

                        <th className="text-right px-6 py-4 text-sm font-semibold text-blue-600">
                            Net
                        </th>
                    </tr>
                </thead>

                {/* Body */}
                <tbody>
                    {data.data.map((row: any, index: number) => (
                        <tr 
                            key={row.period}
                            className={`border-b transition hover:bg-gray-50 ${
                                    index % 2 === 0 ? "bg-white" : "bg-gray-50/40"
                                }`}
                        >
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                {row.period}
                            </td>

                            <td className="px-6 py-4 text-sm text-right text-green-600 font-medium">
                                {currency} {row.income}
                            </td>

                            <td className="px-6 py-4 text-sm text-right text-red-500 font-medium">
                                {currency} {row.expense}
                            </td>

                            <td className={`px-6 py-4 text-sm text-right font-semibold ${
                                    row.net >= 0
                                        ? "text-blue-600"
                                        : "text-red-600"
                                }`}
                            >
                                {currency} {row.net}
                            </td>
                        </tr>
                    ))}
                </tbody>

                {/* FOOTER */}
                <tfoot className="bg-gray-100 border-t-2">
                    <tr>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">
                            Total
                        </td>

                        <td className="px-6 py-4 text-sm text-right font-bold text-green-700">
                            {currency}{data.income}
                        </td>

                        <td className="px-6 py-4 text-sm text-right font-bold text-red-600">
                            {currency}{data.expense}
                        </td>

                        <td className={`px-6 py-4 text-sm text-right font-bold ${
                                data.netTotal >= 0
                                    ? "text-blue-700"
                                    : "text-red-700"
                            }`}
                        >
                            {currency}{data.netTotal}
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    )
}