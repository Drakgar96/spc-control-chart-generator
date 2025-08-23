export interface Characteristic {
  id: string;
  name: string;
  nominal: number;
  upperTol: number;
  lowerTol: number;
  unit: string;
  data: number[];
  stats: StatisticalResults | null;
}

export interface StatisticalResults {
  n: number;
  mean: number;
  stdDev: number;
  min: number;
  max: number;
  range: number;
  USL: number;
  LSL: number;
  tolerance: number;
  Cp: number;
  Cpk: number;
  Pp: number;
  Ppk: number;
  observedPPM: number;
  estimatedPPM: number;
  outOfSpecCount: number;
  normalityTest: {
    a2: number | null;
    pValue: number | null;
  };
}

export interface PartDefinition {
  name: string;
  image: string;
  characteristics: {
    name: string;
    nominal: number;
    upperTol: number;
    lowerTol: number;
    unit: string;
  }[];
}

export interface DocumentControl {
  documentNumber: string;
  revisionNumber: string;
  preparedBy: string;
  approvedBy: string;
  effectiveDate: string;
  reportStartDate: string;
  reportEndDate: string;
}

export interface SummaryData {
  validCharacteristics: number;
  totalSamples: number;
  avgCp: number;
  avgCpk: number;
  totalOutOfSpec: number;
  overallObservedPPM: number;
  overallEstimatedPPM: number;
  normalCharacteristics: number;
}
