import { useState } from 'react';
import { Search, ArrowUpDown, Eye, Filter, Download } from 'lucide-react';
import { Case } from '../types';
import { Input } from './input';
import { Badge } from './badge';
import { Button } from './button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';
import { Card } from './card';

interface CasesTableProps {
  cases: Case[];
  onViewCase: (caseData: Case) => void;
}

export function CasesTable({ cases, onViewCase }: CasesTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Case>('nextHearingDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: keyof Case) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredCases = cases.filter((c) => {
    const search = searchTerm.toLowerCase();
    return (
      c.lawyerName.toLowerCase().includes(search) ||
      c.opponent.toLowerCase().includes(search) ||
      c.caseTitle.toLowerCase().includes(search) ||
      c.cnrNo.toLowerCase().includes(search) ||
      c.state.toLowerCase().includes(search) ||
      c.district.toLowerCase().includes(search) ||
      c.partyName.toLowerCase().includes(search)
    );
  });

  const sortedCases = [...filteredCases].sort((a, b) => {
    const aValue = a[sortField] || '';
    const bValue = b[sortField] || '';
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const isUpcoming = (date: string) => {
    if (!date) return false;
    const hearingDate = new Date(date);
    const today = new Date();
    const diffTime = hearingDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  };

  return (
    <Card className="border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-gray-900">Recent Cases</h3>
            <p className="text-sm text-gray-500 mt-1">Track and manage your legal cases</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2 border-gray-200 hover:bg-gray-50 rounded-lg">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button size="sm" className="gap-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by lawyer, opponent, case title, CNR, state, district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-50 border-gray-200 focus:border-green-500 focus:ring-green-500/20 rounded-lg text-sm"
          />
          {filteredCases.length > 0 && (
            <Badge variant="secondary" className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-green-100 text-green-700 border-0">
              {filteredCases.length}
            </Badge>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50 border-b border-gray-200">
              <TableHead className="cursor-pointer" onClick={() => handleSort('lawyerName')}>
                <div className="flex items-center gap-1">
                  Lawyer Name
                  <ArrowUpDown className="h-3 w-3 text-gray-400" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('opponent')}>
                <div className="flex items-center gap-1">
                  Opponent
                  <ArrowUpDown className="h-3 w-3 text-gray-400" />
                </div>
              </TableHead>
              <TableHead>Case Title</TableHead>
              <TableHead>CNR No.</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('state')}>
                <div className="flex items-center gap-1">
                  State
                  <ArrowUpDown className="h-3 w-3 text-gray-400" />
                </div>
              </TableHead>
              <TableHead>District</TableHead>
              <TableHead>Party Name</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('nextHearingDate')}>
                <div className="flex items-center gap-1">
                  Next Hearing
                  <ArrowUpDown className="h-3 w-3 text-gray-400" />
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCases.map((caseData, index) => (
              <TableRow 
                key={caseData.id} 
                className="hover:bg-gray-50/50 transition-colors border-b border-gray-100 group"
              >
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-600 p-2 rounded-lg text-white text-xs flex items-center justify-center w-8 h-8">
                      {caseData.lawyerName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <span className="text-sm">{caseData.lawyerName}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">{caseData.opponent}</TableCell>
                <TableCell className="max-w-xs">
                  <div className="truncate">{caseData.caseTitle}</div>
                  <div className="text-xs text-gray-500 mt-1">{caseData.caseType}</div>
                </TableCell>
                <TableCell className="text-xs text-gray-600 font-mono">{caseData.cnrNo}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-gray-200">
                    {caseData.state}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-600">{caseData.district}</TableCell>
                <TableCell>{caseData.partyName}</TableCell>
                <TableCell>
                  {caseData.nextHearingDate ? (
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-gray-900">
                        {new Date(caseData.nextHearingDate).toLocaleDateString('en-IN', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </span>
                      {isUpcoming(caseData.nextHearingDate) && (
                        <Badge className="text-xs bg-amber-100 text-amber-800 border-amber-200 w-fit">
                          Upcoming
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">N/A</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={caseData.status === 'Ongoing' ? 'default' : 'secondary'}
                    className={
                      caseData.status === 'Ongoing'
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }
                  >
                    {caseData.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewCase(caseData)}
                    className="text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {sortedCases.length === 0 && (
        <div className="p-12 text-center">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-gray-900 mb-2">No cases found</h3>
          <p className="text-gray-500">Try adjusting your search query</p>
        </div>
      )}
    </Card>
  );
}
