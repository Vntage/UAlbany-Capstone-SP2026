export function IncomeTable({ data, currency }: any) {
    return(
        <table>
            <thead>
                <tr>
                    <th>Period</th>
                    <th>Income</th>
                    <th>Expense</th>
                    <th>Net</th>
                </tr>
            </thead>

            <tbody>
                {data.data.map((row: any) => (
                    <tr key={row.period}>
                        <td>{row.period}</td>
                        <td>{currency} {row.income}</td>
                        <td>{currency} {row.expense}</td>
                        <td>{currency} {row.net}</td>
                    </tr>
                ))}
            </tbody>

            <tfoot>
                <tr>
                    <td>Total</td>
                    <td>{currency}{data.income}</td>
                    <td>{currency}{data.expense}</td>
                    <td>{currency}{data.netTotal}</td>
                </tr>
            </tfoot>
        </table>
    )
}