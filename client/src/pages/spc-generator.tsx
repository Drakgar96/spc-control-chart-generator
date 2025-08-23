import { useState, useCallback } from 'react';
import { Characteristic, DocumentControl } from '@/types/spc';
import { PART_CONFIGS } from '@/lib/part-definitions';
import { exportToPdf } from '@/lib/pdf-export';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import DocumentControlSection from '@/components/document-control';
import PartSelector from '@/components/part-selector';
import CharacteristicForm from '@/components/characteristic-form';
import ControlChart from '@/components/control-chart';
import SummarySection from '@/components/summary-section';

export default function SPCGenerator() {
  const [characteristics, setCharacteristics] = useState<Characteristic[]>([]);
  const [characteristicCounter, setCharacteristicCounter] = useState(0);
  const [selectedPart, setSelectedPart] = useState('default');
  const [documentControl, setDocumentControl] = useState<DocumentControl>({
    documentNumber: '',
    revisionNumber: '',
    preparedBy: 'Edgar Contreras',
    approvedBy: 'Steven Rogoski',
    effectiveDate: new Date().toISOString().split('T')[0],
    reportStartDate: '',
    reportEndDate: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const addNewCharacteristic = useCallback((predefined?: any) => {
    const newCounter = characteristicCounter + 1;
    setCharacteristicCounter(newCounter);
    
    const defaultChar = predefined || {
      name: `Characteristic ${newCounter}`,
      type: 'variable' as 'variable' | 'attribute',
      initialValues: {
        subgroupSize: '4',
        nominalValue: '1000',
        usl: '1',
        lsl: '-1',
        data: ''
      }
    };

    const newCharacteristic: Characteristic = {
      id: `char_${newCounter}`,
      name: defaultChar.name,
      type: defaultChar.type || 'variable',
      subgroupSize: parseInt(defaultChar.initialValues?.subgroupSize || '4') || 4,
      nominal: defaultChar.initialValues?.nominalValue ? parseFloat(defaultChar.initialValues.nominalValue) : null,
      upperTol: defaultChar.initialValues?.usl ? parseFloat(defaultChar.initialValues.usl) : null,
      lowerTol: defaultChar.initialValues?.lsl ? parseFloat(defaultChar.initialValues.lsl) : null,
      unit: 'mm',
      dataText: defaultChar.initialValues?.data || '',
      data: [],
      stats: null,
      spcStats: null,
      pChartStats: null
    };

    setCharacteristics(prev => [...prev, newCharacteristic]);
  }, [characteristicCounter]);

  // Initialize with one characteristic
  const [initialized, setInitialized] = useState(false);
  if (!initialized && addNewCharacteristic) {
    addNewCharacteristic();
    setInitialized(true);
  }

  const removeCharacteristic = useCallback((id: string) => {
    setCharacteristics(prev => prev.filter(char => char.id !== id));
  }, []);

  const updateCharacteristic = useCallback((updatedCharacteristic: Characteristic) => {
    setCharacteristics(prev =>
      prev.map(char =>
        char.id === updatedCharacteristic.id ? updatedCharacteristic : char
      )
    );
  }, []);

  const generateAllCharts = useCallback(() => {
    let generatedCount = 0;
    
    // This function triggers chart generation for all characteristics that have data
    characteristics.forEach(char => {
      if ((char.type === 'variable' && char.subgroups && char.subgroups.length > 0) ||
          (char.type === 'attribute' && char.attributeData && char.attributeData.length > 0)) {
        generatedCount++;
      }
    });

    if (generatedCount > 0) {
      toast({
        title: "Info",
        description: `Found ${generatedCount} characteristics with data. Use the "Update Data & Calculate Statistics" button on each characteristic to generate charts.`,
      });
    } else {
      toast({
        title: "Warning",
        description: "No data available to generate charts. Please enter measurement data first.",
        variant: "destructive"
      });
    }
  }, [characteristics, toast]);

  const handlePartSelection = useCallback((partKey: string) => {
    setSelectedPart(partKey);

    if (partKey !== 'default' && PART_CONFIGS[partKey]) {
      const partConfig = PART_CONFIGS[partKey];
      
      // Clear existing characteristics
      setCharacteristics([]);
      setCharacteristicCounter(0);

      // Add predefined characteristics
      let counter = 0;
      partConfig.characteristics.forEach(charConfig => {
        counter++;
        const newCharacteristic: Characteristic = {
          id: `char_${counter}`,
          name: charConfig.name,
          type: charConfig.type as 'variable' | 'attribute',
          subgroupSize: parseInt(charConfig.initialValues.subgroupSize) || 4,
          nominal: charConfig.initialValues.nominalValue ? parseFloat(charConfig.initialValues.nominalValue) : null,
          upperTol: charConfig.initialValues.usl ? parseFloat(charConfig.initialValues.usl) : null,
          lowerTol: charConfig.initialValues.lsl ? parseFloat(charConfig.initialValues.lsl) : null,
          unit: charConfig.type === 'variable' ? 'mm' : '',
          dataText: charConfig.initialValues.data || '',
          data: [],
          stats: null,
          spcStats: null,
          pChartStats: null
        };
        setCharacteristics(prev => [...prev, newCharacteristic]);
      });
      setCharacteristicCounter(counter);
    } else {
      // Reset to default
      setCharacteristics([]);
      setCharacteristicCounter(0);
      addNewCharacteristic();
    }
  }, [addNewCharacteristic]);

  const handleExportPdf = useCallback(async () => {
    setIsLoading(true);
    try {
      await exportToPdf();
      toast({
        title: "Success",
        description: "PDF exported successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error generating PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const resetAll = useCallback(() => {
    if (confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
      setCharacteristics([]);
      setCharacteristicCounter(0);
      setSelectedPart('default');
      addNewCharacteristic();
      
      toast({
        title: "Info",
        description: "All data has been reset.",
      });
    }
  }, [addNewCharacteristic, toast]);

  const chartsWithData = characteristics.filter(char => 
    (char.type === 'variable' && char.spcStats) || 
    (char.type === 'attribute' && char.pChartStats)
  );

  return (
    <div className="bg-gray-100 p-4 sm:p-8 min-h-screen">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-700 font-medium">Generating PDF...</p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-lg p-6 sm:p-10 border border-gray-200">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-2 no-print">
          SPC Control Chart Generator
        </h1>
        <p className="text-center text-gray-500 mb-8 no-print">
          Statistical Process Control with Variable and Attribute Analysis
        </p>

        {/* Document Control Section */}
        <DocumentControlSection onDocumentControlChange={setDocumentControl} />

        {/* Part Selector Section */}
        <PartSelector selectedPart={selectedPart} onPartChange={handlePartSelection} />

        {/* Main Control Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8 no-print">
          <Button
            onClick={() => addNewCharacteristic()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
            data-testid="button-add-characteristic"
          >
            Add New Characteristic
          </Button>
          <Button
            onClick={generateAllCharts}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-6 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition duration-150 ease-in-out"
            data-testid="button-generate-all"
          >
            Generate All Charts
          </Button>
          <Button
            onClick={handleExportPdf}
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-150 ease-in-out"
            data-testid="button-export-pdf"
          >
            Export to PDF
          </Button>
          <Button
            onClick={resetAll}
            variant="secondary"
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition duration-150 ease-in-out"
            data-testid="button-reset-all"
          >
            Reset All
          </Button>
        </div>

        {/* Summary Section */}
        <SummarySection characteristics={characteristics} />

        {/* Characteristics Container */}
        <div className="space-y-8 mb-8" data-testid="container-characteristics">
          {characteristics.map(characteristic => (
            <CharacteristicForm
              key={characteristic.id}
              characteristic={characteristic}
              onUpdate={updateCharacteristic}
              onDelete={removeCharacteristic}
            />
          ))}
        </div>

        {/* Charts Container */}
        <div className="space-y-8 mb-12" data-testid="container-charts">
          {chartsWithData.map(characteristic => (
            <ControlChart key={characteristic.id} characteristic={characteristic} />
          ))}
        </div>

        <div className="text-center text-gray-500 text-sm mt-12 no-print">
          <p>&copy; 2024 MTU Quality Control. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}