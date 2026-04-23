"use client"
import ExpenseSummary from '@/components/dashboard/expense-summary';
import UpcomingEvents from '@/components/dashboard/upcoming-events';
import EMIAlerts from '@/components/dashboard/emi-alerts';
import HealthAlerts from '@/components/dashboard/health-alerts';
import QuickExpense from '@/components/dashboard/quick-expense';
import AIInsights from '@/components/dashboard/ai-insights';
import { motion } from 'framer-motion';
import { Sun, Moon, CloudSun } from 'lucide-react';

function getCurrentGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return { text: "Good Morning", icon: Sun, color: "#f59e0b" };
  if (hour < 18) return { text: "Good Afternoon", icon: CloudSun, color: "#3b82f6" };
  return { text: "Good Evening", icon: Moon, color: "#6366f1" };
}

export default function DashboardPage() {
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const greeting = getCurrentGreeting();
  const Icon = greeting.icon;

  return (
    <div className="dashboard-page">

      {/* ── Header ───────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="dashboard-header"
      >
        <div className="dashboard-header__left">
          <div className="dashboard-header__greeting">
            <div className="dashboard-header__icon-wrap">
              <Icon size={24} color={greeting.color} />
            </div>
            <h1 className="dashboard-header__title">
              {greeting.text}, Amal.
            </h1>
          </div>
          <p className="dashboard-header__date">{currentDate}</p>
        </div>

        <div className="dashboard-header__user">
          <div className="dashboard-header__avatar">A</div>
          <div className="dashboard-header__user-info">
            <span className="dashboard-header__user-name">Amal Krishna</span>
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
