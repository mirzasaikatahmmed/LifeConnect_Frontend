import React from "react";

type StatsCardProps = {
  number: string | number; // সংখ্যা বা string দুটোই হতে পারে
  label: string;
  icon: React.ReactNode; // যেকোনো JSX element (icon)
};

const StatsCard: React.FC<StatsCardProps> = ({ number, label, icon }) => {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-2">{icon}</div>
      <div className="text-3xl font-bold text-white mb-1">{number}</div>
      <div className="text-red-100 text-sm">{label}</div>
    </div>
  );
};

export default StatsCard;
