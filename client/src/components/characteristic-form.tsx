import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Characteristic } from '@/types/spc';
import { 
  generateSampleData, 
  calculateStatistics, 
  parseVariableData, 
  parseAttributeData, 
  calculateSPCStats, 
  calculateSigmaWithin, 
  calculatePChartStats 
} from '@/lib/statistical-calculations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';

interface CharacteristicFormProps {
  characteristic: Characteristic;
  onUpdate: (characteristic: Characteristic) => void;
  onDelete: (id: string) => void;
}

export default function CharacteristicForm({ characteristic, onUpdate, onDelete }: CharacteristicFormProps) {
  const [name, setName] = useState(characteristic.name);
  const [type, setType] = useState<'variable' | 'attribute'>(characteristic.type);
  const [subgroupSize, setSubgroupSize] = useState(characteristic.subgroupSize?.toString() || '4');
  const [nominal, setNominal] = useState(characteristic.nominal !== null ? characteristic.nominal.toString() : '');
  const [upperTol, setUpperTol] = useState(characteristic.upperTol !== null ? characteristic.upperTol.toString() : '');
  const [lowerTol, setLowerTol] = useState(characteristic.lowerTol !== null ? characteristic.lowerTol.toString() : '');
  const [unit, setUnit] = useState(characteristic.unit);
  const [dataInput, setDataInput] = useState(characteristic.dataText);

  // Update local state when characteristic prop changes
  useEffect(() => {
    setName(characteristic.name);
    setType(characteristic.type);
    setSubgroupSize(characteristic.subgroupSize?.toString() || '4');
    setNominal(characteristic.nominal !== null ? characteristic.nominal.toString() : '');
    setUpperTol(characteristic.upperTol !== null ? characteristic.upperTol.toString() : '');
    setLowerTol(characteristic.lowerTol !== null ? characteristic.lowerTol.toString() : '');
    setUnit(characteristic.unit);
    setDataInput(characteristic.dataText);
  }, [characteristic]);

  const handleDataUpdate = () => {
    try {
      if (type === 'variable') {
        // Parse variable data as subgroups
        const subgroups = parseVariableData(dataInput);

        if (subgroups.length === 0) {
          alert('Please enter valid variable data in subgroups (one subgroup per line, comma-separated)');
          return;
        }

        const nominalValue = nominal ? parseFloat(nominal) : null;
        const upperTolValue = upperTol ? parseFloat(upperTol) : null;
        const lowerTolValue = lowerTol ? parseFloat(lowerTol) : null;
        const subgroupSizeValue = parseInt(subgroupSize);

        // Calculate SPC statistics
        const spcStats = calculateSPCStats(subgroups, subgroupSizeValue);
        const allDataPoints = subgroups.flat();
        const sigmaWithin = calculateSigmaWithin(subgroups);

        // Add additional properties to spcStats
        const enhancedSpcStats = {
          ...spcStats,
          allDataPoints,
          sigmaWithin
        };

        // Calculate basic statistics on all data points
        let stats = null;
        if (nominalValue && upperTolValue !== null && lowerTolValue !== null) {
          stats = calculateStatistics(allDataPoints, nominalValue, upperTolValue, lowerTolValue, sigmaWithin);
        }

        const updatedCharacteristic: Characteristic = {
          ...characteristic,
          name,
          type: 'variable',
          subgroupSize: subgroupSizeValue,
          nominal: nominalValue,
          upperTol: upperTolValue,
          lowerTol: lowerTolValue,
          unit,
          dataText: dataInput,
          data: allDataPoints,
          subgroups,
          stats,
          spcStats: enhancedSpcStats
        };

        onUpdate(updatedCharacteristic);
      } else {
        // Parse attribute data
        const attributeData = parseAttributeData(dataInput);

        if (attributeData.length === 0) {
          alert('Please enter valid attribute data (sample size, defect count per line)');
          return;
        }

        const subgroupSizeValue = parseInt(subgroupSize);

        // Calculate P-chart statistics
        const pChartStats = calculatePChartStats(attributeData);

        const updatedCharacteristic: Characteristic = {
          ...characteristic,
          name,
          type: 'attribute',
          subgroupSize: subgroupSizeValue,
          nominal: null,
          upperTol: null,
          lowerTol: null,
          unit,
          dataText: dataInput,
          data: [],
          attributeData,
          stats: null,
          pChartStats
        };

        onUpdate(updatedCharacteristic);
      }
    } catch (error) {
      alert('Error processing data: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleGenerateSampleData = () => {
    if (type === 'variable') {
      const nominalValue = nominal ? parseFloat(nominal) : 1000;
      const upperTolValue = upperTol ? parseFloat(upperTol) : 1;
      const lowerTolValue = lowerTol ? parseFloat(lowerTol) : -1;
      const subgroupSizeValue = parseInt(subgroupSize) || 4;

      const sampleData = generateSampleData(nominalValue, upperTolValue, lowerTolValue, 5 * subgroupSizeValue);

      // Format as subgroups
      const subgroupData = [];
      for (let i = 0; i < sampleData.length; i += subgroupSizeValue) {
        const subgroup = sampleData.slice(i, i + subgroupSizeValue);
        subgroupData.push(subgroup.join(', '));
      }

      setDataInput(subgroupData.join('\n'));
    } else {
      // Generate sample attribute data
      const sampleSize = parseInt(subgroupSize) || 100;
      const sampleData = [];

      for (let i = 0; i < 10; i++) {
        const defects = Math.floor(Math.random() * 8); // Random defects 0-7
        sampleData.push(`${sampleSize},${defects}`);
      }

      setDataInput(sampleData.join('\n'));
    }
  };

  return (
    <div className="no-print mb-8">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">Characteristic Configuration</CardTitle>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => onDelete(characteristic.id)}
            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
            data-testid={`button-delete-${characteristic.id}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`name-${characteristic.id}`}>Characteristic Name</Label>
              <Input
                id={`name-${characteristic.id}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter characteristic name"
                data-testid={`input-name-${characteristic.id}`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`type-${characteristic.id}`}>Type</Label>
              <Select value={type} onValueChange={(value: 'variable' | 'attribute') => setType(value)}>
                <SelectTrigger data-testid={`select-type-${characteristic.id}`}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="variable">Variable</SelectItem>
                  <SelectItem value="attribute">Attribute</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`subgroup-size-${characteristic.id}`}>Subgroup Size</Label>
              <Input
                id={`subgroup-size-${characteristic.id}`}
                type="number"
                value={subgroupSize}
                onChange={(e) => setSubgroupSize(e.target.value)}
                placeholder="4"
                data-testid={`input-subgroup-size-${characteristic.id}`}
              />
            </div>
            {type === 'variable' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor={`nominal-${characteristic.id}`}>Nominal Value</Label>
                  <Input
                    id={`nominal-${characteristic.id}`}
                    type="number"
                    step="any"
                    value={nominal}
                    onChange={(e) => setNominal(e.target.value)}
                    placeholder="1000"
                    data-testid={`input-nominal-${characteristic.id}`}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`upper-tol-${characteristic.id}`}>Upper Tolerance</Label>
                  <Input
                    id={`upper-tol-${characteristic.id}`}
                    type="number"
                    step="any"
                    value={upperTol}
                    onChange={(e) => setUpperTol(e.target.value)}
                    placeholder="1.0"
                    data-testid={`input-upper-tol-${characteristic.id}`}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`lower-tol-${characteristic.id}`}>Lower Tolerance</Label>
                  <Input
                    id={`lower-tol-${characteristic.id}`}
                    type="number"
                    step="any"
                    value={lowerTol}
                    onChange={(e) => setLowerTol(e.target.value)}
                    placeholder="-1.0"
                    data-testid={`input-lower-tol-${characteristic.id}`}
                  />
                </div>
              </>
            )}
            {type === 'variable' && (
              <div className="space-y-2">
                <Label htmlFor={`unit-${characteristic.id}`}>Unit</Label>
                <Input
                  id={`unit-${characteristic.id}`}
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="mm"
                  data-testid={`input-unit-${characteristic.id}`}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`data-${characteristic.id}`}>
              {type === 'variable' ? 
                'Measurement Data (subgroups, one per line)' : 
                'Attribute Data (sample size, defect count per line)'}
            </Label>
            <Textarea
              id={`data-${characteristic.id}`}
              value={dataInput}
              onChange={(e) => setDataInput(e.target.value)}
              placeholder={
                type === 'variable' ? 
                  'Enter subgroup data, one subgroup per line:\n10.1, 10.2, 9.9, 10.0\n10.3, 9.8, 10.1, 10.2\n9.9, 10.0, 10.1, 9.8' :
                  'Enter sample size and defect count per line:\n100,3\n100,5\n100,2\n100,4'
              }
              className="min-h-[100px]"
              data-testid={`textarea-data-${characteristic.id}`}
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleDataUpdate}
              className="bg-blue-600 hover:bg-blue-700"
              data-testid={`button-update-${characteristic.id}`}
            >
              Update Data & Calculate Statistics
            </Button>
            <Button
              variant="outline"
              onClick={handleGenerateSampleData}
              data-testid={`button-generate-${characteristic.id}`}
            >
              Generate Sample Data
            </Button>
          </div>

          {/* Data Format Help */}
          <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded">
            <strong>Data Format Help:</strong>
            {type === 'variable' ? (
              <div>
                <p>• Enter one subgroup per line, values separated by commas</p>
                <p>• Each subgroup should have {subgroupSize} measurements</p>
                <p>• Example: 1252.5, 1253.1, 1252.8, 1253.0</p>
              </div>
            ) : (
              <div>
                <p>• Enter sample size and defect count per line, separated by comma</p>
                <p>• Example: 100,3 means 100 samples with 3 defects</p>
              </div>
            )}
          </div>

        </CardContent>
      </Card>
    </div>
  );
}