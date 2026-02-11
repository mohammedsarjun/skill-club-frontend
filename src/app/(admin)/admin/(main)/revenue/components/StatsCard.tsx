interface StatsCardProps {
  label: string;
  value: string;
  change: string;
  changePositive: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  change,
  changePositive,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      <p className={`mt-2 text-sm ${changePositive ? 'text-green-600' : 'text-red-600'}`}>
        {change}
      </p>
    </div>
  );
};

export default StatsCard;
