import React, { useState, useEffect, useCallback } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, Label 
} from 'recharts';
import { 
  TrendingUp, Users, FileText, IndianRupee,
  ArrowUp, ArrowDown, Award, ChevronRight 
} from 'lucide-react';
import './Performance.css';

const Performance = ({ adminPassword }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all'); // all, month, week

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://stubits.onrender.com/api/admin/stats?timeRange=${timeRange}`,
        {
          headers: {
            'adminKey': adminPassword
          }
        }
      );
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }, [adminPassword, timeRange]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats, timeRange]);

  if (loading) {
    return (
      <div className="admin-component-content">
        <div className="loading-state">
          <div className="loader"></div>
          <p>Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (!stats || !stats.salesDistribution) {
    return (
      <div className="admin-component-content">
        <div className="loading-state">
          <div className="loader"></div>
          <p>Loading statistics...</p>
        </div>
      </div>
    );
  }

  // Ensure data exists before rendering charts
  const hasData = {
    salesDistribution: Array.isArray(stats.salesDistribution) && stats.salesDistribution.length > 0,
    revenueTrend: Array.isArray(stats.revenueTrend) && stats.revenueTrend.length > 0,
    topNotes: Array.isArray(stats.topNotes) && stats.topNotes.length > 0,
    topCustomers: Array.isArray(stats.topCustomers) && stats.topCustomers.length > 0
  };

  const COLORS = ['#9333ea', '#7928ca', '#4c1d95', '#2e1065'];

  return (
    <div className="admin-component-content">
      <div className="admin-component-header">
        <div className="header-text">
          <h2>Performance Analytics</h2>
          <p>Track your platform's performance and sales metrics</p>
        </div>
        <div className="time-range-filter">
          <button 
            className={timeRange === 'week' ? 'active' : ''} 
            onClick={() => setTimeRange('week')}
          >
            Week
          </button>
          <button 
            className={timeRange === 'month' ? 'active' : ''} 
            onClick={() => setTimeRange('month')}
          >
            Month
          </button>
          <button 
            className={timeRange === 'all' ? 'active' : ''} 
            onClick={() => setTimeRange('all')}
          >
            All Time
          </button>
        </div>
      </div>

      <div className="stats-grid">
        {/* Quick Stats Cards */}
        <div className="quick-stats">
          <div className="stat-card total-revenue">
            <div className="stat-icon">
              <IndianRupee size={24} />
            </div>
            <div className="stat-info">
              <h3>Total Revenue</h3>
              <p className="stat-value">₹{stats?.totalRevenue}</p>
              <span className="stat-change positive">
                <ArrowUp size={16} />
                12.5% vs last period
              </span>
            </div>
          </div>

          <div className="stat-card total-sales">
            <div className="stat-icon">
              <FileText size={24} />
            </div>
            <div className="stat-info">
              <h3>Total Sales</h3>
              <p className="stat-value">{stats?.totalSales}</p>
              <span className="stat-change positive">
                <ArrowUp size={16} />
                8.2% vs last period
              </span>
            </div>
          </div>

          <div className="stat-card active-customers">
            <div className="stat-icon">
              <Users size={24} />
            </div>
            <div className="stat-info">
              <h3>Active Customers</h3>
              <p className="stat-value">{stats?.activeCustomers}</p>
              <span className="stat-change negative">
                <ArrowDown size={16} />
                3.1% vs last period
              </span>
            </div>
          </div>

          <div className="stat-card avg-order">
            <div className="stat-icon">
              <TrendingUp size={24} />
            </div>
            <div className="stat-info">
              <h3>Avg. Order Value</h3>
              <p className="stat-value">₹{stats?.avgOrderValue}</p>
              <span className="stat-change positive">
                <ArrowUp size={16} />
                5.7% vs last period
              </span>
            </div>
          </div>
        </div>

        {/* Revenue Trend Chart */}
        <div className="chart-card revenue-trend">
          <h3>Revenue Trend</h3>
          {hasData.revenueTrend && (
            <RevenueChart data={stats?.revenueTrend} />
          )}
        </div>

        {/* Top Performing Notes */}
        <div className="chart-card top-notes">
          <h3>Top Performing Notes</h3>
          {hasData.topNotes && (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats?.topNotes}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(147, 51, 234, 0.1)" />
                <XAxis dataKey="title" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip />
                <Bar dataKey="sales" fill="#9333ea" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Sales Distribution */}
        <div className="chart-card sales-distribution">
          <h3>Sales Distribution</h3>
          {hasData.salesDistribution && (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats?.salesDistribution}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats?.salesDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
          <div className="chart-legend">
            {stats?.salesDistribution.map((item, index) => (
              <div key={item.name} className="legend-item">
                <span className="legend-color" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                <span className="legend-label">{item.name}</span>
                <span className="legend-value">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Customers */}
        <div className="top-customers-card">
          <h3>Top Customers</h3>
          <div className="customers-list">
            {hasData.topCustomers && stats?.topCustomers.map((customer, index) => (
              <div key={customer.id} className="customer-item">
                <div className="customer-rank">
                  {index === 0 && <Award className="rank-icon gold" />}
                  {index === 1 && <Award className="rank-icon silver" />}
                  {index === 2 && <Award className="rank-icon bronze" />}
                  {index > 2 && <span className="rank-number">#{index + 1}</span>}
                </div>
                <div className="customer-info">
                  <h4>{customer.name}</h4>
                  <p>{customer.purchases} purchases · ₹{customer.spent}</p>
                </div>
                <ChevronRight size={20} className="customer-arrow" />
              </div>
            ))}
          </div>
        </div>

        {/* Category Performance */}
        <CategoryPerformance data={stats?.categoryPerformance} />
      </div>
    </div>
  );
};

const RevenueChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <AreaChart data={data}>
      <defs>
        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3}/>
          <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(147, 51, 234, 0.1)" />
      <XAxis 
        dataKey="date" 
        stroke="#94A3B8"
        tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })}
      />
      <YAxis stroke="#94A3B8">
        <Label
          value="Revenue (₹)"
          position="insideLeft"
          angle={-90}
          style={{ fill: '#94A3B8' }}
        />
      </YAxis>
      <Tooltip
        contentStyle={{
          backgroundColor: 'rgba(17, 12, 34, 0.9)',
          border: '1px solid rgba(147, 51, 234, 0.2)',
          borderRadius: '8px'
        }}
        formatter={(value) => [`₹${value}`, 'Revenue']}
      />
      <Area
        type="monotone"
        dataKey="amount"
        stroke="#9333ea"
        fillOpacity={1}
        fill="url(#colorRevenue)"
      />
    </AreaChart>
  </ResponsiveContainer>
);

const CategoryPerformance = ({ data }) => (
  <div className="category-performance">
    <h3>Category Performance</h3>
    <div className="category-grid">
      {data.map(category => (
        <div key={category.category} className="category-card">
          <h4>{category.category}</h4>
          <div className="category-stats">
            <div className="stat">
              <span>Revenue</span>
              <strong>₹{category.revenue.toLocaleString()}</strong>
            </div>
            <div className="stat">
              <span>Sales</span>
              <strong>{category.sales}</strong>
            </div>
            <div className="stat">
              <span>Avg. Order</span>
              <strong>₹{category.averageOrderValue.toLocaleString()}</strong>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Performance;