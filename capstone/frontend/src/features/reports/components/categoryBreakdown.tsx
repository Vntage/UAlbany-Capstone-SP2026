export function CategoryBreakdownTable({ data, currency }: any) {
    return(
        <div>
            {data.data.map((group: any) => (
                <div key={group.type}>
                    <h2>{group.type}</h2>

                    <table>
                        <thead>
                            <tr>
                                <th>Period</th>
                                <th>Category</th>
                                <th>Total</th>
                            </tr>
                        </thead>

                        <tbody>
                            {(group.categories ?? []).map((row: any, i: number) => (
                                <tr key={i}>
                                    <td>{row.period}</td>
                                    <td>{row.category}</td>
                                    <td>{currency} {row.total}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    )
}