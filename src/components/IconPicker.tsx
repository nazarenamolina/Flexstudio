import { 
  Video, Headphones, Infinity, Award, Star, Heart, 
  Zap, Shield, Smartphone, BookOpen, CheckCircle, Users 
} from 'lucide-react';
const ICONS_DISPONIBLES = {
  Video: Video,
  Headphones: Headphones,
  Infinity: Infinity,
  Award: Award,
  Star: Star,
  Heart: Heart,
  Zap: Zap,
  Shield: Shield,
  Smartphone: Smartphone,
  BookOpen: BookOpen,
  CheckCircle: CheckCircle,
  Users: Users,
};

export type IconName = keyof typeof ICONS_DISPONIBLES;

interface IconPickerProps {
  value: string; 
  onChange: (iconName: string) => void; 
}

export const IconPicker = ({ value, onChange }: IconPickerProps) => {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {Object.entries(ICONS_DISPONIBLES).map(([name, IconComponent]) => (
        <button
          key={name}
          type="button"
          onClick={() => onChange(name)}
          className={`p-3 rounded-xl border transition-all duration-200 ${
            value === name 
              ? 'bg-[#d7f250] border-[#d7f250] text-[#131313] scale-110 shadow-lg' 
              : 'bg-[#131313] border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'
          }`}
          title={name}
        >
          <IconComponent size={20} />
        </button>
      ))}
    </div>
  );
};
 
export const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
  const IconComponent = ICONS_DISPONIBLES[name as IconName] || CheckCircle; 
  return <IconComponent className={className} />;
};