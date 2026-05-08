export function ExpenseTable({ data , currency }: any) {
    return(
        <div>
            {data.data.map((period: any) => (
                <div>
                    <h3>{period.period}</h3>

                    <table>
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Expense</th>
                            </tr>
                        </thead>

                        <tbody>
                            {(period.categories ?? []).map((c: any) => (
                                <tr key={c.category}>
                                    <td>{c.category}</td>
                                    <td>{currency} {c.expense}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    )
}