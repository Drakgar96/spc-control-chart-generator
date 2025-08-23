import { useState, useEffect } from 'react';
import { Characteristic } from '@/types/spc';
import { generateSampleData } from '@/lib/statistical-calculations';
import { Button } from '@/components/ui/button';

interface CharacteristicFormProps {
  characteristic: Characteristic;
  onCharacteristicChange: (characteristic: Characteristic) => void;
  onRemove: () => void;
  onGenerateChart: () => void;
}

export default function CharacteristicForm({ 
  characteristic, 
  onCharacteristicChange, 
  onRemove, 
  onGenerateChart 
}: CharacteristicFormProps) {
  const [dataString, setDataString] = useState<string>(characteristic.data.join(', '));

  useEffect(() => {
    setDataString(characteristic.data.join(', '));
  }, [characteristic.data]);

  const handlePropertyChange = (property: keyof Characteristic, value: any) => {
    onCharacteristicChange({
      ...characteristic,
      [property]: value
    });
  };

  const handleDataChange = (value: string) => {
    setDataString(value);
    try {
      const data = value.split(',').map(val => parseFloat(val.trim())).filter(val => !isNaN(val));
      handlePropertyChange('data', data);
    } catch (error) {
      console.error('Error parsing data:', error);
      handlePropertyChange('data', []);
    }
  };

  const handleGenerateSampleData = () => {
    const sampleData = generateSampleData(characteristic.nominal, characteristic.upperTol, characteristic.lowerTol);
    handlePropertyChange('data', sampleData);
    setDataString(sampleData.join(', '));
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800" data-testid={`text-characteristic-title-${characteristic.id}`}>
          {characteristic.name}
        </h3>
        <Button
          onClick={onRemove}
          variant="destructive"
          size="sm"
          className="no-print"
          data-testid={`button-remove-${characteristic.id}`}
        >
          Remove
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Characteristic Name</label>
          <input
            type="text"
            value={characteristic.name}
            onChange={(e) => handlePropertyChange('name', e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 no-print"
            data-testid={`input-name-${characteristic.id}`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nominal Value</label>
          <input
            type="number"
            value={characteristic.nominal}
            onChange={(e) => handlePropertyChange('nominal', parseFloat(e.target.value))}
            step="0.01"
            className="w-full rounded-md border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 no-print"
            data-testid={`input-nominal-${characteristic.id}`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Upper Tolerance</label>
          <input
            type="number"
            value={characteristic.upperTol}
            onChange={(e) => handlePropertyChange('upperTol', parseFloat(e.target.value))}
            step="0.01"
            className="w-full rounded-md border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 no-print"
            data-testid={`input-upper-tol-${characteristic.id}`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lower Tolerance</label>
          <input
            type="number"
            value={characteristic.lowerTol}
            onChange={(e) => handlePropertyChange('lowerTol', parseFloat(e.target.value))}
            step="0.01"
            className="w-full rounded-md border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 no-print"
            data-testid={`input-lower-tol-${characteristic.id}`}
          />
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
        <input
          type="text"
          value={characteristic.unit}
          onChange={(e) => handlePropertyChange('unit', e.target.value)}
          className="w-32 rounded-md border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 no-print"
          data-testid={`input-unit-${characteristic.id}`}
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Measurement Data (comma-separated)
        </label>
        <textarea
          value={dataString}
          onChange={(e) => handleDataChange(e.target.value)}
          placeholder="Enter measurement values separated by commas..."
          className="w-full rounded-md border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 h-32 no-print"
          data-testid={`textarea-data-${characteristic.id}`}
        />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2 no-print">
        <Button
          onClick={onGenerateChart}
          className="bg-green-600 hover:bg-green-700"
          data-testid={`button-generate-chart-${characteristic.id}`}
        >
          Generate Chart
        </Button>
        <Button
          onClick={handleGenerateSampleData}
          className="bg-yellow-600 hover:bg-yellow-700"
          data-testid={`button-sample-data-${characteristic.id}`}
        >
          Generate Sample Data
        </Button>
      </div>
    </div>
  );
}
