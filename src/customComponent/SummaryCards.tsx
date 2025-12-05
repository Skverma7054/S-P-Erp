import { Briefcase, Clock, CheckCircle, Users, TrendingUp, ArrowUpRight } from 'lucide-react';
import { Card } from './card';

interface SummaryCardsProps {
  totalCases: number;
  ongoingCases: number;
  closedCases: number;
  totalLawyers: number;
}

export function SummaryCards({ totalCases, ongoingCases, closedCases, totalLawyers }: SummaryCardsProps) {
  const cards = [
    {
      title: 'Total Cases',
      value: totalCases,
      change: '+12%',
      icon: Briefcase,
      gradient: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-100',
      iconBg: 'bg-green-500',
      textColor: 'text-green-700'
    },
    {
      title: 'Ongoing Cases',
      value: ongoingCases,
      change: '+8%',
      icon: Clock,
      gradient: 'from-orange-500 to-amber-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-100',
      iconBg: 'bg-orange-500',
      textColor: 'text-orange-700'
    },
    {
      title: 'Closed Cases',
      value: closedCases,
      change: '+15%',
      icon: CheckCircle,
      gradient: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100',
      iconBg: 'bg-blue-500',
      textColor: 'text-blue-700'
    },
    {
      title: 'Total Lawyers',
      value: totalLawyers,
      change: '+2',
      icon: Users,
      gradient: 'from-purple-500 to-violet-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-100',
      iconBg: 'bg-purple-500',
      textColor: 'text-purple-700'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card 
            key={index} 
            className={`relative overflow-hidden border ${card.borderColor} hover:shadow-md transition-all duration-200`}
          >
            <div className={`absolute inset-0 ${card.bgColor} opacity-40`}></div>
            
            <div className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${card.gradient} shadow-sm`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                <div className="flex items-baseline gap-2 mb-2">
                  <h3 className="text-gray-900">{card.value}</h3>
                  <span className={`text-xs ${card.textColor} flex items-center gap-0.5`}>
                    <TrendingUp className="h-3 w-3" />
                    {card.change}
                  </span>
                </div>
                <p className="text-xs text-gray-500">vs last month</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
