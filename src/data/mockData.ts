import { Case, Lawyer } from '../types';

export const mockCases: Case[] = [
  {
    id: '1',
    lawyerName: 'Adv. Rajesh Kumar',
    opponent: 'Adv. Priya Sharma',
    caseTitle: 'DLF vs Municipal Corporation',
    cnrNo: 'DLHC010012342023',
    state: 'Delhi',
    district: 'South Delhi',
    partyName: 'DLF Limited',
    barcode: 'BC2023001234',
    complexNo: 'CX-001',
    benchId: 'BENCH-12',
    nextHearingDate: '2025-11-05',
    status: 'Ongoing',
    filingDate: '2023-02-15',
    caseType: 'Civil',
    courtName: 'Delhi High Court',
    hearingHistory: [
      { date: '2024-10-15', description: 'Arguments heard, next hearing scheduled' },
      { date: '2024-09-10', description: 'Evidence submission' },
      { date: '2024-08-05', description: 'Case filed and admitted' }
    ]
  },
  {
    id: '2',
    lawyerName: 'Adv. Meera Patel',
    opponent: 'Adv. Amit Singh',
    caseTitle: 'DLF vs Property Dispute',
    cnrNo: 'GRHC020045672023',
    state: 'Haryana',
    district: 'Gurugram',
    partyName: 'DLF Limited',
    barcode: 'BC2023004567',
    complexNo: 'CX-002',
    benchId: 'BENCH-05',
    nextHearingDate: '2025-11-12',
    status: 'Ongoing',
    filingDate: '2023-05-20',
    caseType: 'Property',
    courtName: 'Punjab & Haryana High Court',
    hearingHistory: [
      { date: '2024-10-08', description: 'Mediation attempted' },
      { date: '2024-09-15', description: 'Documents verified' }
    ]
  },
  {
    id: '3',
    lawyerName: 'Adv. Suresh Reddy',
    opponent: 'Adv. Kiran Desai',
    caseTitle: 'DLF vs Land Acquisition',
    cnrNo: 'TSHC030078902022',
    state: 'Telangana',
    district: 'Hyderabad',
    partyName: 'DLF Limited',
    barcode: 'BC2022007890',
    complexNo: 'CX-003',
    benchId: 'BENCH-18',
    nextHearingDate: '2025-10-30',
    status: 'Ongoing',
    filingDate: '2022-11-10',
    caseType: 'Land Dispute',
    courtName: 'Telangana High Court',
    hearingHistory: [
      { date: '2024-09-25', description: 'Survey report submitted' },
      { date: '2024-08-20', description: 'Expert witness testimony' },
      { date: '2024-07-15', description: 'Initial hearing completed' }
    ]
  },
  {
    id: '4',
    lawyerName: 'Adv. Anjali Verma',
    opponent: 'Adv. Ravi Gupta',
    caseTitle: 'DLF vs Tax Department',
    cnrNo: 'DLHC040023452024',
    state: 'Delhi',
    district: 'Central Delhi',
    partyName: 'DLF Limited',
    barcode: 'BC2024002345',
    complexNo: 'CX-004',
    benchId: 'BENCH-07',
    nextHearingDate: '2025-11-20',
    status: 'Ongoing',
    filingDate: '2024-01-15',
    caseType: 'Tax',
    courtName: 'Delhi High Court',
    hearingHistory: [
      { date: '2024-10-01', description: 'Financial records reviewed' },
      { date: '2024-09-05', description: 'Case admitted' }
    ]
  },
  {
    id: '5',
    lawyerName: 'Adv. Vikram Malhotra',
    opponent: 'Adv. Neha Joshi',
    caseTitle: 'DLF vs Construction Dispute',
    cnrNo: 'MNHC050056782021',
    state: 'Maharashtra',
    district: 'Mumbai',
    partyName: 'DLF Limited',
    barcode: 'BC2021005678',
    complexNo: 'CX-005',
    benchId: 'BENCH-22',
    nextHearingDate: '',
    status: 'Closed',
    filingDate: '2021-03-10',
    caseType: 'Construction',
    courtName: 'Bombay High Court',
    hearingHistory: [
      { date: '2024-06-15', description: 'Case settled out of court' },
      { date: '2024-05-20', description: 'Final arguments' },
      { date: '2024-04-10', description: 'Evidence presented' }
    ]
  },
  {
    id: '6',
    lawyerName: 'Adv. Deepak Chopra',
    opponent: 'Adv. Sanjay Kapoor',
    caseTitle: 'DLF vs Environmental Clearance',
    cnrNo: 'KNHC060034562023',
    state: 'Karnataka',
    district: 'Bangalore',
    partyName: 'DLF Limited',
    barcode: 'BC2023003456',
    complexNo: 'CX-006',
    benchId: 'BENCH-14',
    nextHearingDate: '',
    status: 'Closed',
    filingDate: '2023-07-22',
    caseType: 'Environmental',
    courtName: 'Karnataka High Court',
    hearingHistory: [
      { date: '2024-08-10', description: 'Clearance granted, case closed' },
      { date: '2024-07-05', description: 'Environmental report submitted' }
    ]
  },
  {
    id: '7',
    lawyerName: 'Adv. Rajesh Kumar',
    opponent: 'Adv. Lakshmi Iyer',
    caseTitle: 'DLF vs Contract Breach',
    cnrNo: 'DLHC070089012024',
    state: 'Delhi',
    district: 'North Delhi',
    partyName: 'DLF Limited',
    barcode: 'BC2024008901',
    complexNo: 'CX-007',
    benchId: 'BENCH-09',
    nextHearingDate: '2025-11-15',
    status: 'Ongoing',
    filingDate: '2024-03-05',
    caseType: 'Contract',
    courtName: 'Delhi High Court',
    hearingHistory: [
      { date: '2024-10-10', description: 'Contract documents examined' },
      { date: '2024-09-12', description: 'Initial pleadings filed' }
    ]
  },
  {
    id: '8',
    lawyerName: 'Adv. Meera Patel',
    opponent: 'Adv. Arun Mehta',
    caseTitle: 'DLF vs Labor Dispute',
    cnrNo: 'GRHC080067892023',
    state: 'Haryana',
    district: 'Faridabad',
    partyName: 'DLF Limited',
    barcode: 'BC2023006789',
    complexNo: 'CX-008',
    benchId: 'BENCH-16',
    nextHearingDate: '2025-11-08',
    status: 'Ongoing',
    filingDate: '2023-09-18',
    caseType: 'Labor',
    courtName: 'Punjab & Haryana High Court',
    hearingHistory: [
      { date: '2024-10-05', description: 'Labor commission report reviewed' },
      { date: '2024-09-01', description: 'Witness statements recorded' }
    ]
  }
];

export const mockLawyers: Lawyer[] = [
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
