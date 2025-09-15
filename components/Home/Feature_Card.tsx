import React from "react";

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
};

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  className = "",
}) => {
  return (
    <div
      className={`bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
    >
      <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default FeatureCard;
