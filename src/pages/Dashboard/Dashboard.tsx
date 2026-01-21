import React, { useState } from 'react'
import { SummaryCards } from '../../customComponent/SummaryCards'
import { CasesTable } from '../../customComponent/CaseTable'
import { mockCases, mockLawyers } from '../../data/mockData';
export type Case = {
  id: number;
  title: string;
  status: "Ongoing" | "Closed";
  lawyer: string;
  createdAt: string;
};

export default function Dashboard() {

     const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
    const companyName = 'DLF Limited';
     
  const totalCases = mockCases.length;
  const ongoingCases = mockCases.filter(c => c.status === 'Ongoing').length;
  const closedCases = mockCases.filter(c => c.status === 'Closed').length;
  const totalLawyers = mockLawyers.length;
   const handleViewCase = (caseData: Case) => {
    setSelectedCase(caseData);
    setIsSheetOpen(true);
  };
  return (
   <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-500">Overview</p>
              <h1 className="text-gray-900 mt-1">Welcome back, {companyName}</h1>
              <p className="text-gray-600 mt-2">Here's what's happening with your legal cases today</p>
            </div>
            <SummaryCards
              totalCases={totalCases}
              ongoingCases={ongoingCases}
              closedCases={closedCases}
              totalLawyers={totalLawyers}
            />
            <CasesTable cases={mockCases} onViewCase={handleViewCase} />
          </div>
  )
}
