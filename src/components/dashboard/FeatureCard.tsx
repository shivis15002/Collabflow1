
import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  route: string;
  icon: LucideIcon;
  gradient: string;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  title, 
  route, 
  icon: Icon, 
  gradient,
  delay = 0
}) => {
  const animationDelay = `${delay * 0.1}s`;
  
  return (
    <Link 
      to={route} 
      className={`feature-card ${gradient} animate-enter`}
      style={{ animationDelay }}
    >
      <div className="feature-card-icon">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-2 text-white/80">
        Manage your {title.toLowerCase()} effectively
      </p>
    </Link>
  );
};

export default FeatureCard;
