import React, { useState, useEffect, useCallback } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, Label 
} from 'recharts';
import { 
  TrendingUp, Users, FileText, IndianRupee,
  ChevronDown, Heart
} from 'lucide-react';
import './Performance.css';

const Performance = ({ adminPassword }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [donationStats, setDonationStats] = useState({
    totalDonations: 0,
    totalAmount: 0,
    recentDonations: [],
    topDonations: []
  });

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams({
        timeRange,
        ...(timeRange === 'month' && { month: selectedMonth + 1 })
      });
      
      const response = await fetch(
        `https://stubits.onrender.com/api/admin/stats?${queryParams}`,
        {
          headers: {
            'adminKey': adminPassword
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [adminPassword, timeRange, selectedMonth]);

  // First useEffect to fetch data when component mounts
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Second useEffect to handle month selection changes
  useEffect(() => {
    if (timeRange === 'month') {
      fetchStats();
    }
  }, [timeRange, selectedMonth, fetchStats]); // Added timeRange as dependency

  useEffect(() => {
    const fetchDonationStats = async () => {
      try {
        const response = await fetch('https://stubits.onrender.com/api/donations/stats');
        const data = await response.json();
        setDonationStats(data);
      } catch (error) {
        console.error('Error fetching donation stats:', error);
      }
    };

    fetchDonationStats();
  }, []);

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

  if (error) {
    return (
      <div className="admin-component-content">
        <div className="error-state">
          <p>Error loading statistics: {error}</p>
          <button onClick={fetchStats}>Retry</button>
        </div>
      </div>
    );
  }

  // Simplified data validation
  if (!stats || !stats.overview) {
    return (
      <div className="admin-component-content">
        <div className="loading-state">
          <div className="loader"></div>
          <p>Loading statistics...</p>
        </div>
      </div>
    );
  }

  // Define colors array
  const COLORS = ['#9333ea', '#7928ca', '#4c1d95', '#2e1065'];

  const months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];

  const renderTimeRangeSelector = () => (
    <div className="time-range-selector">
      <div className="time-range-filter">
        <button 
          className={timeRange === 'week' ? 'active' : ''} 
          onClick={() => setTimeRange('week')}
        >
          Week
        </button>
        <button 
          className={timeRange === 'month' ? 'active' : ''} 
          onClick={() => {
            setTimeRange('month');
            setShowMonthDropdown(true);
          }}
        >
          Month <ChevronDown size={16} />
        </button>
        <button 
          className={timeRange === 'all' ? 'active' : ''} 
          onClick={() => setTimeRange('all')}
        >
          All Time
        </button>
      </div>
      
      {timeRange === 'month' && showMonthDropdown && (
        <div className="month-dropdown">
          {months.map((month, index) => (
            <button
              key={month}
              className={selectedMonth === index ? 'active' : ''}
              onClick={() => {
                setSelectedMonth(index);
                setShowMonthDropdown(false);
              }}
            >
              {month}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="admin-component-content">
      <div className="performance-header">
        <div className="header-content">
          <h2>Performance Analytics</h2>
          <p>Track your platform's performance and sales metrics</p>
        </div>
        {renderTimeRangeSelector()}
      </div>

      <div className="stats-grid">
        {/* Quick Stats */}
        <div className="quick-stats">
          <div className="stat-card total-revenue">
            <div className="stat-icon">
              <IndianRupee size={24} />
            </div>
            <div className="stat-info">
              <h3>Total Revenue</h3>
              <p className="stat-value">₹{stats.overview.totalRevenue}</p>
            </div>
          </div>

          <div className="stat-card total-sales">
            <div className="stat-icon">
              <FileText size={24} />
            </div>
            <div className="stat-info">
              <h3>Total Sales</h3>
              <p className="stat-value">{stats.overview.totalSales}</p>
            </div>
          </div>

          <div className="stat-card active-customers">
            <div className="stat-icon">
              <Users size={24} />
            </div>
            <div className="stat-info">
              <h3>Active Customers</h3>
              <p className="stat-value">{stats.overview.activeCustomers}</p>
            </div>
          </div>

          <div className="stat-card avg-order">
            <div className="stat-icon">
              <TrendingUp size={24} />
            </div>
            <div className="stat-info">
              <h3>Avg. Order Value</h3>
              <p className="stat-value">₹{stats.overview.averageOrderValue}</p>
            </div>
          </div>

          <div className="stat-card total-donations">
            <div className="stat-icon">
              <Heart size={24} />
            </div>
            <div className="stat-info">
              <h3>Total Donations</h3>
              <p className="stat-value">₹{donationStats.totalAmount}</p>
              <span className="stat-label">{donationStats.totalDonations} donations received</span>
            </div>
          </div>
        </div>

        {/* Revenue Trend */}
        {stats.revenueTrend && stats.revenueTrend.length > 0 && (
          <div className="chart-card revenue-trend">
            <h3>Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={stats.revenueTrend}>
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
          </div>
        )}

        {/* Top Notes */}
        {stats.topNotes && stats.topNotes.length > 0 && (
          <div className="chart-card top-notes">
            <h3>Top Performing Notes</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.topNotes}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(147, 51, 234, 0.1)" />
                <XAxis dataKey="title" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip />
                <Bar dataKey="sales" fill="#9333ea" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Sales Distribution */}
        {stats.salesDistribution && stats.salesDistribution.length > 0 && (
          <div className="chart-card sales-distribution">
            <h3>Sales Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.salesDistribution}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="name"
                >
                  {stats.salesDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="chart-legend">
              {stats.salesDistribution.map((item, index) => (
                <div key={item.name} className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                  <span className="legend-label">{item.name}</span>
                  <span className="legend-value">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Donation Analytics */}
        <div className="chart-card donation-analytics">
          <h3>Donation Analytics</h3>
          <div className="donation-stats-grid">
            <div className="donation-overview">
              <div className="stat-item total-donations">
                <div className="stat-icon">
                  <Heart size={24} />
                </div>
                <div className="stat-info">
                  <h4>Total Donations</h4>
                  <p className="stat-value">{donationStats.totalDonations}</p>
                </div>
              </div>
              <div className="stat-item total-amount">
                <div className="stat-icon">
                  <IndianRupee size={24} />
                </div>
                <div className="stat-info">
                  <h4>Total Amount</h4>
                  <p className="stat-value">₹{donationStats.totalAmount}</p>
                </div>
              </div>
            </div>

            {donationStats.recentDonations && donationStats.recentDonations.length > 0 && (
              <div className="recent-donations">
                <h4>Recent Donations</h4>
                <div className="donations-list">
                  {donationStats.recentDonations.map((donation, index) => (
                    <div key={index} className="donation-item">
                      <div className="donation-amount">
                        <IndianRupee size={16} />
                        <span>{donation.amount}</span>
                      </div>
                      <span className="donation-date">
                        {new Date(donation.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Donation Insights */}
        <div className="donation-insights">
          <div className="top-donations">
            <h3>Top Donations</h3>
            <div className="donations-list">
              {donationStats.topDonations?.map((donation, index) => (
                <div key={donation._id} className="donation-card">
                  <div className="card-header">
                    <div className="rank-container">
                      <span className="rank">#{index + 1}</span>
                      <span className="amount">
                        <IndianRupee size={16} />
                        {donation.amount}
                      </span>
                    </div>
                    <span className="date">
                      {new Date(donation.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="donor-details">
                    <div className="donor-name">
                      <span className="label">Donor:</span>
                      <span className="value">{donation.name}</span>
                    </div>
                    <div className="donor-upi">
                      <span className="label">UPI ID:</span>
                      <span className="value">{donation.upiId}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="recent-donations">
            <h3>Recent Donations</h3>
            <div className="donations-table-wrapper">
              <table className="donations-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Name</th>
                    <th>UPI ID</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {donationStats.recentDonations?.map((donation) => (
                    <tr key={donation._id}>
                      <td>
                        {new Date(donation.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td>{donation.name}</td>
                      <td className="upi-cell">{donation.upiId}</td>
                      <td>
                        <div className="amount">
                          <IndianRupee size={14} />
                          {donation.amount}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Performance;