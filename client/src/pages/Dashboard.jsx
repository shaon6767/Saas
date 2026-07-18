import { useEffect, useState } from "react";
import { getDashboardStats } from "../api";
import Spinner from "../components/Spinner";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = stats
    ? [
        {
          title: "Total Revenue",
          value: `$${stats.totalRevenue.toFixed(2)}`,
          color: "bg-green-500",
        },
        {
          title: "Total Unpaid",
          value: `$${stats.totalUnpaid.toFixed(2)}`,
          color: "bg-yellow-500",
        },
        { title: "Products", value: stats.productCount, color: "bg-blue-500" },
        {
          title: "Low Stock Alerts",
          value: stats.lowStockCount,
          color: "bg-red-500",
        },
      ]
    : [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {loading && <Spinner />}
      {!loading && error && (
        <p className="text-red-500">Failed to load dashboard data.</p>
      )}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${card.color} mb-4`}
              >
                <span className="text-white text-xl font-bold">$</span>
              </div>
              <p className="text-sm font-medium text-gray-500 truncate">
                {card.title}
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {card.value}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
