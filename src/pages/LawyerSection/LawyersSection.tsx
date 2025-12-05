import { Phone, Mail, Briefcase, MapPin, Award, Star } from 'lucide-react';
// import { Lawyer } from '../types';
// import { Card } from '../';
import { Badge } from '../../customComponent/ui/badge';
import { Avatar, AvatarFallback } from '../../customComponent/ui/avatar';
import { Button } from '../../customComponent/ui/button';
import { Card } from '../../customComponent/ui/card';

interface LawyersSectionProps {
 id: string;
  name: string;
  barId: string;
  state: string;
  district: string;
  contact: string;
  email: string;
  specialization: string;
  assignedCases: number;
}
const lawyers: Lawyer[] = [
  {
    id: '1',
    name: 'Adv. Rajesh Kumar',
    barId: 'BAR/DL/12345',
    state: 'Delhi',
    district: 'South Delhi',
    contact: '+91 98765 43210',
    email: 'rajesh.kumar@legalfirm.com',
    specialization: 'Civil & Contract Law',
    assignedCases: 2
  },
  {
    id: '2',
    name: 'Adv. Meera Patel',
    barId: 'BAR/HR/23456',
    state: 'Haryana',
    district: 'Gurugram',
    contact: '+91 98765 43211',
    email: 'meera.patel@legalfirm.com',
    specialization: 'Property & Labor Law',
    assignedCases: 2
  },
  {
    id: '3',
    name: 'Adv. Suresh Reddy',
    barId: 'BAR/TS/34567',
    state: 'Telangana',
    district: 'Hyderabad',
    contact: '+91 98765 43212',
    email: 'suresh.reddy@legalfirm.com',
    specialization: 'Land Acquisition',
    assignedCases: 1
  },
  {
    id: '4',
    name: 'Adv. Anjali Verma',
    barId: 'BAR/DL/45678',
    state: 'Delhi',
    district: 'Central Delhi',
    contact: '+91 98765 43213',
    email: 'anjali.verma@legalfirm.com',
    specialization: 'Tax & Corporate Law',
    assignedCases: 1
  },
  {
    id: '5',
    name: 'Adv. Vikram Malhotra',
    barId: 'BAR/MH/56789',
    state: 'Maharashtra',
    district: 'Mumbai',
    contact: '+91 98765 43214',
    email: 'vikram.malhotra@legalfirm.com',
    specialization: 'Construction Law',
    assignedCases: 1
  },
  {
    id: '6',
    name: 'Adv. Deepak Chopra',
    barId: 'BAR/KA/67890',
    state: 'Karnataka',
    district: 'Bangalore',
    contact: '+91 98765 43215',
    email: 'deepak.chopra@legalfirm.com',
    specialization: 'Environmental Law',
    assignedCases: 1
  }
];
export function LawyersSection({  }: LawyersSectionProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getGradient = (index: number) => {
    const gradients = [
      'from-green-500 to-emerald-600',
      'from-blue-500 to-cyan-600',
      'from-purple-500 to-violet-600',
      'from-orange-500 to-amber-600',
      'from-pink-500 to-rose-600',
      'from-indigo-500 to-blue-600'
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Legal Team</p>
          <h1 className="text-gray-900 mt-1">Company Lawyers</h1>
          <p className="text-gray-600 mt-2">Manage your legal team and their assignments</p>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-800 border-0 px-4 py-2">
          {lawyers?.length} Lawyers
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lawyers?.map((lawyer, index) => (
          <Card key={lawyer.id} className="border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden group">
            {/* Header gradient */}
            <div className={`h-24 bg-gradient-to-br ${getGradient(index)} relative`}>
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute bottom-0 right-4">
                <Star className="h-5 w-5 text-white/30" />
              </div>
            </div>

            <div className="p-6 pt-0">
              {/* Avatar */}
              <div className="flex items-start gap-4 -mt-10 relative z-10 mb-4">
                <Avatar className={`h-20 w-20 bg-gradient-to-br ${getGradient(index)} ring-4 ring-white shadow-lg`}>
                  <AvatarFallback className="text-white text-xl">
                    {getInitials(lawyer.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 pt-10">
                  <h3 className="text-gray-900 truncate">{lawyer.name}</h3>
                  <p className="text-xs text-gray-500 mt-1 font-mono">{lawyer.barId}</p>
                </div>
              </div>

              {/* Specialization badge */}
              <div className="mb-4">
                <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50 border">
                  <Award className="h-3 w-3 mr-1" />
                  {lawyer.specialization}
                </Badge>
              </div>

              {/* Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
                  <MapPin className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="truncate">{lawyer.district}, {lawyer.state}</span>
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
                  <Phone className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="truncate">{lawyer.contact}</span>
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
                  <Mail className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="truncate">{lawyer.email}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Assigned Cases</span>
                  </div>
                  <Badge className={`bg-gradient-to-r ${getGradient(index)} text-white shadow-sm`}>
                    {lawyer.assignedCases}
                  </Badge>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full border-green-600 text-green-700 hover:bg-green-50 rounded-lg"
                >
                  View Profile
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
