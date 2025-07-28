import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsCard = ({ title, value, trend, trendValue, icon, color, description }) => {
  const getTrendIcon = () => {
    if (trend === 'up') return 'TrendingUp';
    if (trend === 'down') return 'TrendingDown';
    return 'Minus';
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-success';
    if (trend === 'down') return 'text-error';
    return 'text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
          <Icon name={icon} size={24} color="white" />
        </div>
        <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
          <Icon name={getTrendIcon()} size={16} />
          <span className="text-sm font-body font-medium">{trendValue}</span>
        </div>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-2xl font-heading font-bold text-card-foreground">
          {value}
        </h3>
        <p className="text-sm font-body font-medium text-card-foreground">
          {title}
        </p>
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
};

export default MetricsCard;