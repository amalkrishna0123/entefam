"use client"
import ExpenseSummary from '@/components/dashboard/expense-summary';
import UpcomingEvents from '@/components/dashboard/upcoming-events';
import EMIAlerts from '@/components/dashboard/emi-alerts';
import HealthAlerts from '@/components/dashboard/health-alerts';
import QuickExpense from '@/components/dashboard/quick-expense';
import AIInsights from '@/components/dashboard/ai-insights';
import WeatherWidget from '@/components/dashboard/WeatherWidget';
import { motion } from 'framer-motion';

import { useAuthStore } from '@/store/auth-store';
import { formatDate } from '@/lib/date-utils';

function getCurrentGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

export default function DashboardPage() {
  const { user, profile } = useAuthStore();
  const currentDate = formatDate(new Date());
  const greetingText = getCurrentGreeting();

  const getInitials = () => {
    if (user?.displayName) return user.displayName[0].toUpperCase();
    if (user?.email) return user.email[0].toUpperCase();
    return 'A';
  };

  return (
    <div className="dashboard-page" style={{marginTop:"15px"}}>

      {/* ── Header ───────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="dashboard-header"
      >
        <div className="dashboard-header__left">
          <div className="dashboard-header__greeting">
            {/* Live weather widget replaces the static icon */}
            <WeatherWidget />
            <h1 className="dashboard-header__title">
              {greetingText}, {user?.displayName?.split(' ')[0] || 'User'}.
            </h1>
          </div>
          <p className="dashboard-header__date">{currentDate}</p>
        </div>

        <div className="dashboard-header__user">
          <div className="dashboard-header__avatar overflow-hidden">
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              getInitials()
            )}
          </div>
          <div className="dashboard-header__user-info">
            <span className="dashboard-header__user-name">{user?.displayName || "Amal Krishna"}</span>
            <span className="dashboard-header__user-role">Family Admin</span>
          </div>
        </div>
      </motion.div>

      {/* ── KPI Stat Cards Row ────────────────────────────── */}
      <section className="dashboard-kpi">
        <ExpenseSummary />
      </section>

      {/* ── Main Content: 70 / 30 split ──────────────────── */}
      <div className="dashboard-main">
        {/* Left: Upcoming Events + AI Insights */}
        <div className="dashboard-main__left">
          <UpcomingEvents />
          <AIInsights />
        </div>

        {/* Right: Quick Expense + EMI + Health */}
        <div className="dashboard-main__right">
          <QuickExpense />
          <EMIAlerts />
          <HealthAlerts />
        </div>
      </div>

    </div>
  );
}
