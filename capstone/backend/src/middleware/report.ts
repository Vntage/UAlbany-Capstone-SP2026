import puppeteer from "puppeteer";
import Handlebars from "handlebars";
import pool from "../config/db";

export class ReportService{
    async generateReport(params: {
        reportType: string;
        startDate: string | null;
        endDate: string |null; 
        periodType: "day" | "week" | "month" | "year";
        businessID: string;
    }) {
        const { reportType } = params;

        switch(reportType) {
            case "income_statement":
                return this.getIncomeStatement(params);
            case "cash_flow":
                return this.getCashFlow(params);
            case "expense_report":
                return this.getExpenseReport(params);
            case "category_breakdown":
                return this.getCategoryBreakdown(params);
            default:
                throw new Error("Invalid Report Type");
        }
    }

    private async getIncomeStatement(p: any) {
        const result = await pool.query(
            `
            WITH grouped AS (
            SELECT 
            DATE_TRUNC($4, date) AS period, 
            SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income,
            SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expense,
            SUM(
            CASE 
                WHEN type = 'income' THEN amount
                WHEN type = 'expense' THEN -amount
                ELSE 0
            END
            ) AS net
            FROM transactions
            WHERE business_id = $1
            AND (NULLIF($2, ''):: date IS NULL OR date >= NULLIF($2, '')::date)
            AND (NULLIF($3, ''):: date IS NULL OR date <= NULLIF($3, '')::date)
            GROUP BY period)
            SELECT *,
            SUM(income) OVER () AS total_income,
            SUM(expense) OVER () AS total_expense,
            SUM(net) OVER () AS total_net
            FROM grouped
            ORDER BY period`,
            [p.businessID, p.startDate, p.endDate, p.periodType]
        );

        return {
            data: result.rows.map(r => ({
                period: new Date(r.period).toISOString().slice(0, 10),
                income: Number(r.income),
                expense: Number(r.expense),
                net: Number(r.net),
            })),
            income: Number(result.rows[0]?.total_income ?? 0),
            expense: Number(result.rows[0]?.total_expense ?? 0),
            netTotal: Number(result.rows[0]?.total_net ?? 0)
        }
    }

    private async getExpenseReport(p: any) {
        const result = await pool.query(
            `WITH grouped AS(
                SELECT 
                DATE_TRUNC($4, t.date) AS period,
                c.name AS category,
                SUM(t.amount) AS expense
                FROM transactions t
                JOIN transaction_category c
                ON t.category_id = c.uid
                WHERE t.business_id = $1
                AND t.type = 'expense'
                AND (NULLIF($2, ''):: date IS NULL OR t.date >= NULLIF($2, '')::date)
                AND (NULLIF($3, ''):: date IS NULL OR t.date <= NULLIF($3, '')::date)
                GROUP BY period, c.name
            )
            SELECT *,
                SUM(expense) OVER (PARTITION BY category) AS total_by_category,
                SUM(expense) OVER () AS total_expense
            FROM grouped
            ORDER BY period, category`,
            [p.businessID, p.startDate, p.endDate, p.periodType]
        );

        const map = new Map();

        for (const r of result.rows){
            const key = r.period.toISOString();
            
            if(!map.has(key)){
                map.set(key, {
                    period: new Date(r.period).toISOString().slice(0, 10),
                    categories: []
                });
            }
            
            map.get(key).categories.push({
                category: r.category,
                expense: Number(r.expense)
            })
        }
        const data = Array.from(map.values())
        
        return {
            data,
            total: result.rows[0]?.total_expense ?? 0
        }
    }

    private async getCashFlow(p: any) {
        const result = await pool.query(
            `WITH grouped AS (
                SELECT
                DATE_TRUNC($4, date) AS period,
                SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) AS net_cash_flow,
                SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS inflow,
                SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS outflow
                FROM transactions
                WHERE business_id = $1
                AND (NULLIF($2, ''):: date IS NULL OR date >= NULLIF($2, '')::date)
                AND (NULLIF($3, ''):: date IS NULL OR date <= NULLIF($3, '')::date)
                GROUP BY period
            )
            SELECT *,
            SUM(net_cash_flow) OVER() AS total_cash_flow,
            SUM(inflow) OVER () AS total_inflow,
            SUM(outflow) OVER () AS total_outflow
            FROM grouped
            ORDER BY period
            `,
            [p.businessID, p.startDate, p.endDate, p.periodType]
        );

        return {
            data: result.rows.map(r => ({
                period: new Date(r.period).toISOString().slice(0, 10),
                inflow: Number(r.inflow),
                outflow: Number(r.outflow),
                netCashFlow: Number(r.net_cash_flow)
            })),
            inflow: Number(result.rows[0]?.total_inflow ?? 0),
            outflow: Number(result.rows[0]?.total_outflow ?? 0),
            net_cash_flow: Number(result.rows[0]?.total_cash_flow ?? 0)
        }
    }

    private async getCategoryBreakdown(p: any) {
        const result = await pool.query(
            `WITH grouped AS(
                SELECT 
                DATE_TRUNC($4, date) AS period,
                type,
                c.name AS category,
                SUM(amount) AS total
                FROM transactions t
                JOIN transaction_category c
                ON t.category_id = c.uid
                WHERE t.business_id = $1
                AND (NULLIF($2, ''):: date IS NULL OR t.date >= NULLIF($2, '')::date)
                AND (NULLIF($3, ''):: date IS NULL OR t.date <= NULLIF($3, '')::date)
                GROUP BY period, type, c.name
            )
            SELECT *,
            SUM(total) OVER (PARTITION BY category) AS total_by_category,
            SUM(total) OVER (PARTITION BY type) AS total_by_type,
            SUM(total) OVER () AS grand_total
            FROM grouped
            ORDER BY period, type, category`,
            [p.businessID, p.startDate, p.endDate, p.periodType]
        );

        const map = new Map();

        for (const r of result.rows){
            const key = r.type;

            if(!map.has(key)){
                map.set(key, {
                    type: key,
                    categories: []
                });
            }

            map.get(key).categories.push({
                period: new Date(r.period).toISOString().slice(0, 10),
                category: r.category,
                total: Number(r.total)
            });
        }

        const data = Array.from(map.values());

        return {
            data,
            grandTotal: result.rows[0]?.grand_total ?? 0
        };
    }
}

export class PDFReportService{
    async generatePDF(reportType: string, reportData: any){
        const html = this.renderHTML(reportType, reportData);

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setContent(html);

        const pdf = await page.pdf({
            format: "A4",
            printBackground: true
        })

        await browser.close();
        return pdf;
    }

    private renderHTML(type: string, data: any){
        const template = this.getTemplate(type);
        return Handlebars.compile(template)(data);
    }

    private getTemplate(type: string){
        switch(type){
            case "income_statement":
                return `
                    <h1> Income Statement </h1>
                    <table>
                        <tr> 
                            <th> Period </th>
                            <th> Income </th>
                            <th> Expense </th>
                            <th> Net </th>
                        </tr>
                        {{#each data}}
                        <tr>
                            <td>{{period}}</td>
                            <td>{{income}}</td>
                            <td>{{expense}}</td>
                            <td>{{net}}</td>
                        </tr>
                        {{/each}}
                        <tr>
                            <td>Total</td>
                            <td>{{income}}</td>
                            <td>{{expense}}</td>
                            <td>{{netTotal}}</td>
                        </tr>
                    </table>
                `;
            case "expense_report":
                return ``;
            case "cash_flow":
                return ``;
            case "category_breakdown":
                return ``;
            default:
                throw new Error("Invalid Report Type");
        }
    }
}