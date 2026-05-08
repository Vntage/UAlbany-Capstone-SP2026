import { CashFlowTable } from "./cashFlowTable";
import { CategoryBreakdownTable } from "./categoryBreakdown";
import { ExpenseTable } from "./expenseTable";
import { IncomeTable } from "./incomeTable";

type ReportType = 
  | "income_statement"
  | "expense_report"
  | "cash_flow"
  | "category_breakdown"

export function ReportRenderer ({
    reportType,
    data,
    currency,
} : {
    reportType: ReportType;
    data: any;
    currency: string;
}) {
    if(!data) return;

    switch(reportType){
        case "income_statement":
            return <IncomeTable data={data} currency={currency}/>
        case "expense_report":
            return <ExpenseTable data={data} currency={currency}/>
        case "cash_flow":
            return <CashFlowTable data={data} currency={currency}/>
        case "category_breakdown":
            return <CategoryBreakdownTable data={data} currency={currency}/>
        default:
            return <div>No Renderer</div>
    }
}