declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
  }
}

export async function exportToPdf(): Promise<void> {
  // Load required libraries if not already loaded
  if (!window.jspdf) {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
  }
  
  if (!window.html2canvas) {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
  }

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF('p', 'mm', 'a4');
  
  // Capture the entire document content
  const element = document.querySelector('.max-w-6xl') as HTMLElement;
  
  if (!element) {
    throw new Error('Could not find main content element');
  }
  
  // Temporarily hide no-print elements and show print-only elements
  const noPrintElements = document.querySelectorAll('.no-print') as NodeListOf<HTMLElement>;
  const printOnlyElements = document.querySelectorAll('.print-only') as NodeListOf<HTMLElement>;
  
  noPrintElements.forEach(el => el.style.display = 'none');
  printOnlyElements.forEach(el => el.classList.remove('hidden'));
  
  try {
    // Update print-only content
    const documentNumberEl = document.querySelector('.print-only[id*="documentNumber"]') as HTMLElement;
    const revisionNumberEl = document.querySelector('.print-only[id*="revisionNumber"]') as HTMLElement;
    const effectiveDateEl = document.querySelector('.print-only[id*="effectiveDate"]') as HTMLElement;
    const reportStartDateEl = document.querySelector('.print-only[id*="reportStartDate"]') as HTMLElement;
    const reportEndDateEl = document.querySelector('.print-only[id*="reportEndDate"]') as HTMLElement;

    if (documentNumberEl) {
      const input = document.getElementById('documentNumber') as HTMLInputElement;
      documentNumberEl.textContent = input?.value || 'MTU-SPC-001';
    }
    
    if (revisionNumberEl) {
      const input = document.getElementById('revisionNumber') as HTMLInputElement;
      revisionNumberEl.textContent = input?.value || '1.0';
    }
    
    if (effectiveDateEl) {
      const input = document.getElementById('effectiveDate') as HTMLInputElement;
      effectiveDateEl.textContent = input?.value || '';
    }
    
    if (reportStartDateEl) {
      const input = document.getElementById('reportStartDate') as HTMLInputElement;
      reportStartDateEl.textContent = input?.value || '';
    }
    
    if (reportEndDateEl) {
      const input = document.getElementById('reportEndDate') as HTMLInputElement;
      reportEndDateEl.textContent = input?.value || '';
    }

    // Capture content as canvas
    const canvas = await window.html2canvas(element, {
      scale: 1.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      height: element.scrollHeight,
      width: element.scrollWidth
    });

    // Calculate dimensions
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 190; // A4 width minus margins (210mm - 20mm)
    const pageHeight = 290; // A4 height minus margins (297mm - 7mm)
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 10; // Top margin

    // Add first page
    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight + 10; // Add margin
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Generate filename with current date
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
    const filename = `SPC_Report_${dateStr}_${timeStr}.pdf`;

    pdf.save(filename);
    
  } finally {
    // Restore display states
    noPrintElements.forEach(el => el.style.display = '');
    printOnlyElements.forEach(el => el.classList.add('hidden'));
  }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}
