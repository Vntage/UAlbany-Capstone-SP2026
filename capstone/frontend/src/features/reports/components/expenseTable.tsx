export function ExpenseTable({ data , currency }: any) {
    return(
        <div className="space-y-8">

            {data.data.map((period: any, index: number) => (
                <div key={index}>

                    {/* Period Header */}
                    <div className="px-6 py-4 border-b bg-gray-50">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {period.period}
                        </h3>
                    </div>

                    {/* Category Breakdown */}
                    <table className="w-full border-collapse">

                        {/* Header */}
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                                    Category
                                </th>
                                <th className="text-right px-6 py-4 text-sm font-semibold text-red-500">
                                    Expense
                                </th>
                            </tr>
                        </thead>

                        {/* Body */}
                        <tbody>
                            {(period.categories ?? []).map((c: any, i: number) => (
                                <tr key={c.category}
                                    className={`transition hover:bg-gray-50 ${
                                        i % 2 === 0
                                            ? "bg-white"
                                            : "bg-gray-50/40"
                                    }`}
                                >

                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        {c.category}
                                    </td>

                                    <td className="px-6 py-4 text-sm text-right text-red-500 font-medium">
                                        {currency} {c.expense}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    )
}