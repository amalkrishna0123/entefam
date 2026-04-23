import ExpenseSummary from '@/components/dashboard/expense-summary';
import UpcomingEvents from '@/components/dashboard/upcoming-events';
import EMIAlerts from '@/components/dashboard/emi-alerts';
import HealthAlerts from '@/components/dashboard/health-alerts';
import QuickExpense from '@/components/dashboard/quick-expense';
import AIInsights from '@/components/dashboard/ai-insights';

function getCurrentGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

export default function DashboardPage() {
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const greeting = getCurrentGreeting();

  return (
    <div className="space-y-12 animate-fade-in py-4">
      
      {/* Header */}
      <div className="flex flex-col gap-3" style={{marginBottom:"20px"}}>
        <h1 className="text-3xl md:text-5xl tracking-tight text-[var(--text-primary)]" style={{ fontWeight: 800 }}>
          {greeting}, Amal.
        </h1>
        <p className="text-[var(--text-secondary)] text-xl font-medium">
          {currentDate}
        </p>
      </div>
      
      {/* KPIs Row */}
      <div className="grid gap-3 md:gap-8 md:grid-cols-2 lg:grid-cols-4 stagger" style={{marginBottom:"20px"}}>
        <ExpenseSummary />
      </div>
      
      {/* Main Grid Floor */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7 stagger">
        {/* Left Column (Main content) */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <UpcomingEvents />
          <AIInsights />
        </div>
        
        {/* Right Column (Side panel widgets) */}
        <div className="lg:col-span-3 flex flex-col gap-8">
          <EMIAlerts />
          <HealthAlerts />
          <QuickExpense />
        </div>
      </div>

    </div>
  );
}

