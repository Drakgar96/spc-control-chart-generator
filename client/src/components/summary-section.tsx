import { Characteristic, SummaryData } from '@/types/spc';

interface SummarySectionProps {
  characteristics: Characteristic[];
}

export default function SummarySection({ characteristics }: SummarySectionProps) {
  const validCharacteristics = characteristics.filter(char => char.stats !== null);
  
  if (validCharacteristics.length === 0) {
    return (
      <div className="mb-12 bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Analysis Summary</h2>
        <div className="space-y-4">
          <p className="text-gray-600 text-center py-8" data-testid="text-no-summary">
            Generate charts to see summary statistics and analysis results.
          </p>
        </div>
      </div>
    );
  }

  // Calculate overall statistics
  const totalSamples = validCharacteristics.reduce((sum, char) => sum + char.data.length, 0);
  const totalOutOfSpec = validCharacteristics.reduce((sum, char) => sum + char.stats!.outOfSpecCount, 0);
  const overallObservedPPM = (totalOutOfSpec / totalSamples) * 1000000;
  
  // Count characteristics passing normality test (p > 0.05)
  const normalCharacteristics = validCharacteristics.filter(char => 
    char.stats!.normalityTest.pValue !== null && char.stats!.normalityTest.pValue > 0.05
  ).length;

  const getCapabilityColor = (value: number) => {
    if (value >= 1.33) return 'text-green-600';
    if (value >= 1.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getNormalityColor = (pValue: number | null) => {
    if (pValue !== null && pValue > 0.05) return 'text-green-600';
    return 'text-red-600';
  };

  return (
    <div className="mb-12 bg-blue-50 p-6 rounded-lg border border-blue-200" data-testid="container-summary">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Analysis Summary</h2>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-3">Overall Process Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Characteristics:</span>
                <span className="font-medium" data-testid="text-total-characteristics">{validCharacteristics.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Samples:</span>
                <span className="font-medium" data-testid="text-total-samples">{totalSamples}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Out of Spec Parts:</span>
                <span className="font-medium" data-testid="text-out-of-spec">{totalOutOfSpec}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Overall Observed PPM:</span>
                <span className="font-medium text-blue-600" data-testid="text-overall-observed-ppm">
                  {overallObservedPPM.toFixed(0)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-3">Normality Assessment</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Normal Distribution:</span>
                <span className="font-medium" data-testid="text-normal-distribution">
                  {normalCharacteristics}/{validCharacteristics.length}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Anderson-Darling test (α = 0.05)
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-3">Detailed Characteristics Summary</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-1 text-left">Characteristic</th>
                  <th className="px-2 py-1 text-right">n</th>
                  <th className="px-2 py-1 text-right">Mean</th>
                  <th className="px-2 py-1 text-right">Std Dev</th>
                  <th className="px-2 py-1 text-right">Cp</th>
                  <th className="px-2 py-1 text-right">Cpk</th>
                  <th className="px-2 py-1 text-right">Est. PPM</th>
                  <th className="px-2 py-1 text-right">Obs. PPM</th>
                  <th className="px-2 py-1 text-right">AD p-val</th>
                </tr>
              </thead>
              <tbody>
                {validCharacteristics.map(char => (
                  <tr key={char.id} className="border-t border-gray-200">
                    <td className="px-2 py-1 font-medium" data-testid={`table-name-${char.id}`}>
                      {char.name}
                    </td>
                    <td className="px-2 py-1 text-right" data-testid={`table-n-${char.id}`}>
                      {char.stats!.n}
                    </td>
                    <td className="px-2 py-1 text-right" data-testid={`table-mean-${char.id}`}>
                      {char.stats!.mean.toFixed(3)}
                    </td>
                    <td className="px-2 py-1 text-right" data-testid={`table-stddev-${char.id}`}>
                      {char.stats!.stdDev.toFixed(3)}
                    </td>
                    <td className={`px-2 py-1 text-right ${getCapabilityColor(char.stats!.Cp)}`} data-testid={`table-cp-${char.id}`}>
                      {char.stats!.Cp.toFixed(3)}
                    </td>
                    <td className={`px-2 py-1 text-right ${getCapabilityColor(char.stats!.Cpk)}`} data-testid={`table-cpk-${char.id}`}>
                      {char.stats!.Cpk.toFixed(3)}
                    </td>
                    <td className="px-2 py-1 text-right text-blue-600" data-testid={`table-est-ppm-${char.id}`}>
                      {char.stats!.estimatedPPM.toFixed(0)}
                    </td>
                    <td className="px-2 py-1 text-right text-blue-600" data-testid={`table-obs-ppm-${char.id}`}>
                      {char.stats!.observedPPM.toFixed(0)}
                    </td>
                    <td className={`px-2 py-1 text-right ${getNormalityColor(char.stats!.normalityTest.pValue)}`} data-testid={`table-ad-pvalue-${char.id}`}>
                      {char.stats!.normalityTest.pValue?.toFixed(3) || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
