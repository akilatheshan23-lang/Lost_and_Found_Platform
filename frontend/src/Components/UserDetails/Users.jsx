import React, { useState, useEffect } from 'react'
import Nav from '../Nav/Nav'
import api from '../../api'
import User from '../User/User';
import { AlertCircle, Loader2, Users as UsersIcon, PieChart as PieChartIcon, TrendingUp } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const fetchHandler = async () => {
  return await api.get('/Users').then((res) => res.data);
}

const fetchFacultyStats = async () => {
  return await api.get('/api/admin/faculty-stats').then((res) => res.data);
}

const COLORS = ['#6366f1', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];

function Users() {

  const [users, setUsers] = useState([]);
  const [facultyStats, setFacultyStats] = useState([]);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([fetchHandler(), fetchFacultyStats()])
      .then(([userData, statsData]) => {
        setUsers(userData.Users);
        setFacultyStats(statsData);
      })
      .catch((err) => {
        console.error('Failed to load user data:', err);
        setError('Failed to load user management data. Please refresh.');
      })
      .finally(() => setLoading(false))
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Nav />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="surface bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-8 text-white animate-fade-up relative overflow-hidden rounded-[2rem] border-b-4 border-indigo-500 shadow-2xl mb-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] -mr-20 -mt-20"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-indigo-300 uppercase tracking-widest text-xs font-black mb-2 flex items-center gap-2">
                <span className="w-8 h-[1px] bg-indigo-500"></span> Platform Intelligence
              </p>
              <h1 className="text-4xl font-black tracking-tight inline-flex items-center gap-3">
                <UsersIcon size={32} className="text-indigo-400" /> User Management
              </h1>
              <p className="mt-3 text-slate-300 max-w-xl font-medium leading-relaxed">
                Analyze student participation across departments and manage the campus recovery network from a centralized command center.
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <Loader2 size={48} className="animate-spin text-indigo-500 mb-4" />
            <p className="text-slate-500 font-bold tracking-tight">Synchronizing Platform Data...</p>
          </div>
        ) : error ? (
          <div className="surface p-6 bg-rose-50 border-2 border-rose-100 flex items-center gap-4 text-rose-800 rounded-2xl animate-fade-up">
            <div className="bg-rose-100 p-3 rounded-xl"><AlertCircle size={24} /></div>
            <div>
              <h3 className="font-bold text-lg">Connection Error</h3>
              <p className="text-sm opacity-90">{error}</p>
            </div>
            <button onClick={() => window.location.reload()} className="ml-auto bg-rose-800 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-rose-900 transition">Retry Connection</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-up-delay-1">
            {/* Faculty Analytics Card */}
            <div className="lg:col-span-5 h-fit sticky top-8">
              <div className="surface p-8 bg-white border border-slate-100 shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden group">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                      <TrendingUp size={24} className="text-emerald-500" /> Faculty Participation
                    </h2>
                    <p className="text-slate-400 text-sm font-bold mt-1 uppercase tracking-tighter">Impact Distribution</p>
                  </div>
                  <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600 group-hover:rotate-12 transition-transform duration-500">
                    <PieChartIcon size={24} />
                  </div>
                </div>

                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={facultyStats}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={8}
                        dataKey="value"
                        animationBegin={200}
                        animationDuration={1500}
                      >
                        {facultyStats.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]} 
                            strokeWidth={0}
                            className="hover:opacity-80 transition-opacity cursor-pointer shadow-lg"
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '1.5rem', 
                          border: 'none', 
                          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                          backgroundColor: '#1e293b',
                          color: '#fff',
                          padding: '1rem'
                        }}
                        itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                      />
                      <Legend 
                        layout="vertical" 
                        verticalAlign="middle" 
                        align="right"
                        iconType="circle"
                        formatter={(value, entry, index) => (
                          <span className="text-slate-700 font-bold text-sm ml-2">{value}</span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-50">
                   <div className="grid grid-cols-2 gap-4">
                      {facultyStats.slice(0, 4).map((stat, i) => (
                        <div key={stat.name} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 group/item hover:bg-indigo-50 transition-colors">
                           <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                           <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.name}</p>
                              <p className="text-lg font-black text-slate-900 leading-none">{stat.value} Users</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </div>

            {/* User List */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="font-black text-slate-900 uppercase tracking-tighter text-lg">Active Personnel Directory</h3>
                <span className="bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-black shadow-sm border border-indigo-200">
                  {users.length} TOTAL REGISTERED
                </span>
              </div>
              <div className="space-y-4 max-h-[1000px] overflow-y-auto pr-2 custom-scrollbar">
                {users.map((user, index) => (
                  <div key={user._id} className="animate-fade-up" style={{ animationDelay: `${index * 50}ms` }}>
                    <User user={user} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Users