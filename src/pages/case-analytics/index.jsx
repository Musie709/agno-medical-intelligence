import React, { useEffect, useState } from 'react';
import Header from '../../components/ui/Header';
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';

const COLORS = ['#00BFA5', '#3F3D56', '#7C4DFF', '#FF9800', '#4CAF50', '#F44336', '#2196F3', '#9C27B0'];

export default function CaseAnalytics() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/cases')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch cases');
        return res.json();
      })
      .then(data => {
        setCases(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load case data');
        setLoading(false);
      });
  }, []);

  // Analytics calculations
  const totalCases = cases.length;
  const byCountry = cases.reduce((acc, c) => {
    acc[c.country] = (acc[c.country] || 0) + 1;
    return acc;
  }, {});
  const byCity = cases.reduce((acc, c) => {
    acc[c.city] = (acc[c.city] || 0) + 1;
    return acc;
  }, {});
  const byDescription = cases.reduce((acc, c) => {
    acc[c.description] = (acc[c.description] || 0) + 1;
    return acc;
  }, {});
  const mostCommonDescription = Object.entries(byDescription).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';

  // Prepare data for recharts
  const countryData = Object.entries(byCountry).map(([name, value]) => ({ name, value }));
  const cityData = Object.entries(byCity).map(([name, value]) => ({ name, value }));
  const typeData = Object.entries(byDescription).map(([name, value]) => ({ name, value }));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-heading font-semibold mb-6">Case Analytics</h1>
        {loading ? (
          <div className="text-accent font-semibold text-lg">Loading analytics...</div>
        ) : error ? (
          <div className="text-error font-semibold text-lg">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-card border border-border rounded-lg p-6 shadow-card">
                <div className="text-3xl font-bold mb-2">{totalCases}</div>
                <div className="text-muted-foreground">Total Cases Submitted</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 shadow-card">
                <div className="text-3xl font-bold mb-2">{mostCommonDescription}</div>
                <div className="text-muted-foreground">Most Common Case Type</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 shadow-card">
                <div className="text-3xl font-bold mb-2">{Object.keys(byCountry).length}</div>
                <div className="text-muted-foreground">Countries Represented</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 shadow-card">
                <div className="text-3xl font-bold mb-2">{Object.keys(byCity).length}</div>
                <div className="text-muted-foreground">Cities Represented</div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-card border border-border rounded-lg p-6 shadow-card h-72 flex flex-col items-center justify-center overflow-auto">
                <div className="text-lg font-semibold mb-2">Cases by Country</div>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={countryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                      {countryData.map((entry, index) => (
                        <Cell key={`cell-country-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 shadow-card h-72 flex flex-col items-center justify-center overflow-auto">
                <div className="text-lg font-semibold mb-2">Cases by City</div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={cityData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#00BFA5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-card border border-border rounded-lg p-6 shadow-card h-72 flex flex-col items-center justify-center overflow-auto">
                <div className="text-lg font-semibold mb-2">Cases by Type</div>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={typeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                      {typeData.map((entry, index) => (
                        <Cell key={`cell-type-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 shadow-card h-72 flex flex-col items-center justify-center">
                <div className="text-lg font-semibold mb-2">[More Analytics Coming Soon]</div>
                <div className="text-muted-foreground">Add status, specialty, or date fields for richer analytics!</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 