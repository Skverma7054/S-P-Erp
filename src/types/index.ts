export interface Case {
  id: string;
  lawyerName: string;
  opponent: string;
  caseTitle: string;
  cnrNo: string;
  state: string;
  district: string;
  partyName: string;
  barcode: string;
  complexNo: string;
  benchId: string;
  nextHearingDate: string;
  status: 'Ongoing' | 'Closed';
  filingDate: string;
  caseType: string;
  courtName: string;
  hearingHistory: {
    date: string;
    description: string;
  }[];
}

export interface Lawyer {
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
