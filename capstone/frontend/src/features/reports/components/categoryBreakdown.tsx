export function CategoryBreakdownTable({ data, currency }: any) {
    return(
        <div className="space-y-8">
            {data.data.map((group: any, index: number) => (
                <div key={group.type || index}>

                    {/* Group Header */}
                    <div className="px-6 py-4 border-b bg-gray-50">
                        <h2 className="text-lg font-semibold text-gray-900 capitalize">
                            {group.type}
                        </h2>
                    </div>

                    {/* Table */}
                    <table className="w-full border-collapse">

                        {/* Header */}
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                                    Period
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                                    Category
                                </th>

                                <th className="text-right px-6 py-4 text-sm font-semibold text-blue-600">
                                    Total
                                </th>
                            </tr>
                        </thead>

                        {/* Body */}
                        <tbody>
                            {(group.categories ?? []).map((row: any, i: number) => (
                                <tr 
                                    key={i}
                                    className={` border-t transition hover:bg-gray-50 ${
                                        i % 2 === 0
                                            ? "bg-white"
                                            : "bg-gray-50/40"
                                    }`}
                                >
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        {row.period}
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        {row.category}
                                    </td>

                                    <td className="px-6 py-4 text-sm text-right text-blue-600 font-semibold">
                                        {currency} {row.total}
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