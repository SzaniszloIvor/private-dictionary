// src/components/DailyProgress/ProgressChart.jsx
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, ComposedChart 
} from 'recharts';
import { useStatsHistory } from '../../hooks/useStatsHistory';

const ProgressChart = () => {
  const { getChartData, loading } = useStatsHistory('week');
  
  const [period, setPeriod] = useState('week'); // 'week' | 'month'
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!loading) {
      const days = period === 'week' ? 7 : 30;
      const data = getChartData(days);
      setChartData(data);
    }
  }, [period, loading, getChartData]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      return (
        <div className="
          bg-white dark:bg-gray-800
          border-2 border-gray-200 dark:border-gray-700
          rounded-lg p-3 shadow-lg
        ">
          <p className="font-bold text-gray-800 dark:text-gray-100 mb-2">
            {data.dayName} ({data.date})
          </p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-blue-600 dark:text-blue-400">Szavak:</span>
              <span className="font-bold text-gray-800 dark:text-gray-100">
                {data.wordsLearned}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-green-600 dark:text-green-400">Idő:</span>
              <span className="font-bold text-gray-800 dark:text-gray-100">
                {Math.round(data.timeSpentMinutes)} perc
              </span>
            </div>
            {data.avgPronunciationScore > 0 && (
              <div className="flex justify-between gap-4">
                <span className="text-purple-600 dark:text-purple-400">Kiejtés:</span>
                <span className="font-bold text-gray-800 dark:text-gray-100">
                  {Math.round(data.avgPronunciationScore)}%
                </span>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <span className="text-orange-600 dark:text-orange-400">Cél:</span>
              <span className="font-bold">
                {data.goalAchieved 
                  ? <span className="text-green-600 dark:text-green-400">✓</span>
                  : <span className="text-gray-400">✗</span>
                }
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <span className="text-2xl">📈</span>
          <span>Haladás Grafikon</span>
        </h3>
        
        {/* Period Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setPeriod('week')}
            className={`
              px-4 py-2 rounded-lg font-medium text-sm
              transition-all duration-200
              ${period === 'week'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}
            `}
          >
            Hét
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`
              px-4 py-2 rounded-lg font-medium text-sm
              transition-all duration-200
              ${period === 'month'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}
            `}
          >
            Hónap
          </button>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={chartData}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#e5e7eb"
            className="dark:stroke-gray-700"
          />
          <XAxis 
            dataKey="dayName" 
            stroke="#6b7280"
            className="dark:stroke-gray-400"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6b7280"
            className="dark:stroke-gray-400"
            style={{ fontSize: '12px' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ fontSize: '14px' }}
            iconType="circle"
          />
          
          {/* Bar: Words Learned */}
          <Bar 
            dataKey="wordsLearned" 
            fill="#3b82f6" 
            name="Tanult szavak"
            radius={[8, 8, 0, 0]}
          />
          
          {/* Line: Time Spent */}
          <Line 
            type="monotone" 
            dataKey="timeSpentMinutes" 
            stroke="#10b981" 
            strokeWidth={2}
            name="Idő (perc)"
            dot={{ fill: '#10b981', r: 4 }}
            activeDot={{ r: 6 }}
          />
          
          {/* Line: Pronunciation Score */}
          {chartData.some(d => d.avgPronunciationScore > 0) && (
            <Line 
              type="monotone" 
              dataKey="avgPronunciationScore" 
              stroke="#a855f7" 
              strokeWidth={2}
              name="Kiejtés (%)"
              dot={{ fill: '#a855f7', r: 4 }}
              activeDot={{ r: 6 }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {(() => {
          const totalWords = chartData.reduce((sum, day) => sum + day.wordsLearned, 0);
          const totalTime = chartData.reduce((sum, day) => sum + day.timeSpentMinutes, 0);
          const daysActive = chartData.filter(day => day.wordsLearned > 0).length;
          const avgWordsPerDay = daysActive > 0 ? Math.round(totalWords / daysActive) : 0;

          return (
            <>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <div className="text-xs text-blue-600 dark:text-blue-400">Összes szó</div>
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {totalWords}
                </div>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                <div className="text-xs text-green-600 dark:text-green-400">Összidő</div>
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {Math.round(totalTime)} p
                </div>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                <div className="text-xs text-purple-600 dark:text-purple-400">Aktív napok</div>
                <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {daysActive}
                </div>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                <div className="text-xs text-orange-600 dark:text-orange-400">Napi átlag</div>
                <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                  {avgWordsPerDay}
                </div>
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
};

export default ProgressChart;
