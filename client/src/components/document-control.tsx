import { useState, useEffect } from 'react';
import { DocumentControl } from '@/types/spc';

interface DocumentControlProps {
  onDocumentControlChange: (control: DocumentControl) => void;
}

export default function DocumentControlSection({ onDocumentControlChange }: DocumentControlProps) {
  const [documentControl, setDocumentControl] = useState<DocumentControl>({
    documentNumber: '',
    revisionNumber: '',
    preparedBy: 'Edgar Contreras',
    approvedBy: 'Steven Rogoski',
    effectiveDate: new Date().toISOString().split('T')[0],
    reportStartDate: '',
    reportEndDate: ''
  });

  useEffect(() => {
    onDocumentControlChange(documentControl);
  }, [documentControl, onDocumentControlChange]);

  const handleInputChange = (field: keyof DocumentControl, value: string) => {
    setDocumentControl(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="mb-8 bg-gray-50 p-6 rounded-lg border">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Document Control Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="documentNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Document Number
          </label>
          <input
            type="text"
            id="documentNumber"
            value={documentControl.documentNumber}
            onChange={(e) => handleInputChange('documentNumber', e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 no-print"
            placeholder="MTU-SPC-001"
            data-testid="input-document-number"
          />
          <span className="print-only hidden">MTU-SPC-001</span>
        </div>
        <div>
          <label htmlFor="revisionNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Revision Number
          </label>
          <input
            type="text"
            id="revisionNumber"
            value={documentControl.revisionNumber}
            onChange={(e) => handleInputChange('revisionNumber', e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 no-print"
            placeholder="Rev. 1.0"
            data-testid="input-revision-number"
          />
          <span className="print-only hidden">1.0</span>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prepared By</label>
          <input
            type="text"
            value={documentControl.preparedBy}
            onChange={(e) => handleInputChange('preparedBy', e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 no-print"
            readOnly
            data-testid="input-prepared-by"
          />
          <span className="print-only hidden">Edgar Contreras</span>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Approved By</label>
          <input
            type="text"
            value={documentControl.approvedBy}
            onChange={(e) => handleInputChange('approvedBy', e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 no-print"
            readOnly
            data-testid="input-approved-by"
          />
          <span className="print-only hidden">Steven Rogoski</span>
        </div>
        <div>
          <label htmlFor="effectiveDate" className="block text-sm font-medium text-gray-700 mb-1">
            Effective Date
          </label>
          <input
            type="date"
            id="effectiveDate"
            value={documentControl.effectiveDate}
            onChange={(e) => handleInputChange('effectiveDate', e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100 no-print"
            readOnly
            data-testid="input-effective-date"
          />
          <span className="print-only hidden"></span>
        </div>
        <div>
          <label htmlFor="reportStartDate" className="block text-sm font-medium text-gray-700 mb-1">
            Report Valid From
          </label>
          <input
            type="date"
            id="reportStartDate"
            value={documentControl.reportStartDate}
            onChange={(e) => handleInputChange('reportStartDate', e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 no-print"
            data-testid="input-report-start-date"
          />
          <span className="print-only hidden"></span>
        </div>
        <div>
          <label htmlFor="reportEndDate" className="block text-sm font-medium text-gray-700 mb-1">
            Report Valid To
          </label>
          <input
            type="date"
            id="reportEndDate"
            value={documentControl.reportEndDate}
            onChange={(e) => handleInputChange('reportEndDate', e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 no-print"
            data-testid="input-report-end-date"
          />
          <span className="print-only hidden"></span>
        </div>
      </div>
    </div>
  );
}
