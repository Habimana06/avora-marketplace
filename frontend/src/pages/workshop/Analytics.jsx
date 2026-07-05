import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';

export default function WorkshopAnalytics() {
  const { data } = useQuery({
    queryKey: ['workshop-analytics'],
    queryFn: async () => (await api.get('/workshop/stats')).data.stats,
  });

  const chartData = [
    { label: 'Pending', value: data?.pending ?? 0 },
    { label: 'In Progress', value: data?.inProgress ?? 0 },
    { label: 'Quality Check', value: data?.qualityCheck ?? 0 },
    { label: 'Completed', value: data?.completed ?? 0 },
  ];

  const maxVal = Math.max(...chartData.map((d) => d.value), 1);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading font-bold text-3xl mb-2">Production Analytics</h1>
        <p className="text-gray-600">Workshop performance metrics.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {chartData.map((item) => (
          <div key={item.label} className="bg-white border border-gray-100 p-6 text-center">
            <p className="text-3xl font-bold text-gold mb-1">{item.value}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-100 p-6">
        <h2 className="font-heading font-semibold mb-6">Production Pipeline</h2>
        <div className="flex items-end gap-4 h-48">
          {chartData.map((item) => (
            <div key={item.label} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full bg-gold transition-all duration-500"
                style={{ height: `${(item.value / maxVal) * 100}%`, minHeight: item.value ? '8px' : '0' }}
              />
              <span className="text-[10px] text-gray-500 uppercase text-center">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
