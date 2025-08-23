export interface Characteristic {
  id: string;
  name: string;
  type: 'variable' | 'attribute';
  nominal: number | null;
  upperTol: number | null;
  lowerTol: number | null;
  unit: string;
  subgroupSize: number;
  dataText: string;
  data: number[];
  subgroups?: number[][];
  attributeData?: { sampleSize: number; defectCount: number }[];
  stats: StatisticalResults | null;
  spcStats?: SPCResults | null;
  pChartStats?: PChartResults | null;
}

export interface StatisticalResults {
  n: number;
  mean: number;
  stdDev: number;
  min: number;
  max: number;
  range: number;
  USL: number | null;
  LSL: number | null;
  tolerance: number | null;
  Cp: number | null;
  Cpk: number | null;
  Pp: number | null;
  Ppk: number | null;
  observedPPM: number;
  estimatedPPM: number;
  outOfSpecCount: number;
  normalityTest: {
    a2: number | null;
    pValue: number | null;
  };
}

export interface SPCResults {
  xBars: number[];
  ranges: number[];
  xDoubleBar: number;
  rBar: number;
  xBarUCL: number;
  xBarLCL: number;
  rUCL: number;
  rLCL: number;
  outOfControlX: number[];
  outOfControlR: number[];
  A2: number;
  d2: number;
  sigmaWithin?: number | null;
  allDataPoints?: number[];
}

export interface PChartResults {
  proportions: number[];
  pBar: number;
  ucl: number[];
  lcl: number[];
  outOfControl: number[];
}

export interface PartDefinition {
  name: string;
  image: string;
  characteristics: {
    name: string;
    type: 'variable' | 'attribute';
    initialValues: {
      subgroupSize: string;
      nominal?: string;
      usl?: string | null;
      lsl?: string | null;
      nominalValue?: string | null;
      data: string;
    };
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
