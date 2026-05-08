export function CashFlowTable({ data, currency }: any) {
    return(
        <table>
            <thead>
                <tr>
                    <th>Period</th>
                    <th>Inflow</th>
                    <th>Outflow</th>
                    <th>Net</th>
                </tr>
            </thead>

            <tbody>
                {data.data.map((row: any) => (
                    <tr key={row.period}>
                        <td>{row.period ? row.period.slice(0,10) : ""}</td>
                        <td>{currency} {row.inflow}</td>
                        <td>{currency} {row.outflow}</td>
                        <td>{currency} {row.netCashFlow}</td>
                    </tr>
                ))}
            </tbody>

            <tfoot>
                <tr>
                    <td>Total</td>
                    <td>{currency} {data.inflow}</td>
                    <td>{currency} {data.outflow}</td>
                    <td>{currency} {data.net_cash_flow}</td>
                </tr>
            </tfoot>
        </table>
    )
}