// Features.tsx
import AlertsImg from "../../../assets/landingPage/Alerts.png";
import DashboardImg from "../../../assets/landingPage/Dashboard.png";
import FinanceImg from "../../../assets/landingPage/Finance.png";
import StatementImg from "../../../assets/landingPage/statement.png";

export default function Features() {
  return (
    <section id="features" className="py-32 bg-surface-container-low">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-xl">
            <span className="font-label uppercase tracking-[0.3em] text-secondary font-bold text-sm">
              Feature Highlights
            </span>
            <h2 className="font-headline font-extrabold text-4xl text-primary mt-4">
              Financial Monitoring Made Simple
            </h2>
          </div>
          <p className="text-on-surface-variant max-w-sm text-right">
            Tools designed for small business owners to manage cash flow, bank statements, and receive actionable insights—all in one place.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-12 gap-8">
          {/* Feature Card 1 */}
          <div className="col-span-12 md:col-span-8 bg-surface-container-lowest rounded-xl p-10 shadow-ambient relative overflow-hidden group border border-outline-variant/30">
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="max-w-md">
                <h3 className="font-headline text-2xl font-bold text-primary mb-4">
                  Automated Bank Integration
                </h3>
                <p className="text-on-surface-variant leading-relaxed">
                  Connect all your business accounts seamlessly. Transactions are automatically categorized, saving you hours of manual reconciliation.
                </p>
              </div>
              <div className="mt-12">
                <img
                  className="w-full max-h-64 md:max-h-80 object-contain rounded shadow-inner"
                  src={FinanceImg}
                  alt="Automated bank integration"
                />
              </div>
            </div>
          </div>

          {/* Feature Card 2 */}
          <div className="col-span-12 md:col-span-4 bg-primary text-on-primary rounded-xl p-10 shadow-ambient flex flex-col justify-between border border-outline-variant/30">
            <div className="mt-12">
              <img
                className="w-full max-h-64 md:max-h-80 object-contain rounded shadow-inner"
                src={AlertsImg}
                alt="Insight alerts"
              />
            </div>
            <div>
              <h3 className="font-headline text-2xl font-bold mb-4">Insight Alerts</h3>
              <p className="text-on-primary-container leading-relaxed text-sm">
                Stay ahead with automated alerts for unusual spending, low balances, or pending invoices. Make decisions before issues arise.
              </p>
            </div>
          </div>

          {/* Feature Card 3 */}
          <div className="col-span-12 md:col-span-4 bg-secondary-container rounded-xl p-10 shadow-ambient flex flex-col justify-between border border-outline-variant/30">
            <div>
              <img
                className="w-full max-h-64 md:max-h-80 object-contain rounded shadow-inner"
                src={DashboardImg}
                alt="Cash Flow Insights"
              />
              <h3 className="font-headline text-2xl font-bold text-on-secondary-container mb-4">
                Cash Flow Insights
              </h3>
              <p className="text-on-secondary-fixed-variant leading-relaxed text-sm">
                Visualize your income and expenses at a glance. Identify trends, predict shortfalls, and optimize your working capital effortlessly.
              </p>
            </div>
          </div>

          {/* Feature Card 4 */}
          <div className="col-span-12 md:col-span-8 bg-surface rounded-xl p-10 shadow-ambient border border-outline-variant/30 flex items-center gap-12">
            <div className="w-1/2">
              <h3 className="font-headline text-2xl font-bold text-primary mb-4">
                Simplified Statement Management
              </h3>
              <p className="text-on-surface-variant leading-relaxed">
                Access all your bank statements in one dashboard. Download, categorize, and review your business transactions quickly, with zero hassle.
              </p>
            </div>
            <div className="mt-12">
              <img
                className="w-full max-h-64 md:max-h-80 object-contain rounded shadow-inner"
                src={StatementImg}
                alt="Insight alerts"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}