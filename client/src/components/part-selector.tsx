import { partDefinitions, PART_IMAGES } from '@/lib/part-definitions';

interface PartSelectorProps {
  selectedPart: string;
  onPartChange: (partKey: string) => void;
}

export default function PartSelector({ selectedPart, onPartChange }: PartSelectorProps) {
  const partImage = selectedPart !== 'default' ? PART_IMAGES[selectedPart as keyof typeof PART_IMAGES] : null;
  const selectedPartName = selectedPart !== 'default' && partDefinitions[selectedPart] 
    ? partDefinitions[selectedPart].name 
    : 'Custom Characteristics';

  return (
    <div className="mb-8">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <label htmlFor="partSelector" className="block text-sm font-medium text-gray-700 mb-2">
            Select Part to Analyze
          </label>
          <select
            id="partSelector"
            value={selectedPart}
            onChange={(e) => onPartChange(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm p-3 text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out no-print"
            data-testid="select-part"
          >
            <option value="default">Custom Characteristics (Default)</option>
            <option value="axle-profile">Axle Profile HY10 - 148 253</option>
            <option value="lamella-profile">Lamella Profile HY10 - 123 257</option>
            <option value="rh-side-profile">RH Side Profile HY10 - 142 942</option>
            <option value="lh-side-profile">LH Side Profile HY10 - 142 943</option>
            <option value="lid-profile">Lid Profile HY10 - 142 421</option>
            <option value="front-profile">Front Profile HY10 - 142 408</option>
            <option value="rear-profile">Rear Profile HY10 - 142 221</option>
          </select>
          <div className="print-only hidden mt-2">
            <span className="font-medium text-gray-700">Analyzed Part: </span>
            <span id="selectedPartName" data-testid="text-selected-part">{selectedPartName}</span>
          </div>
        </div>
        <div className="flex-shrink-0">
          <label className="block text-sm font-medium text-gray-700 mb-2">Part Image</label>
          <div className="w-full lg:w-80 h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
            {partImage ? (
              <img
                id="partImage"
                src={partImage}
                className="part-image"
                alt="Part Image"
                data-testid="img-part"
              />
            ) : (
              <div id="partImagePlaceholder" className="text-center text-gray-500" data-testid="placeholder-part-image">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="mt-2">Select a part to view image</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
