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
  
  // Define A4 dimensions in mm (minus margins)
  const pageWidth = 190; // 210mm - 20mm margins
  const pageHeight = 270; // 297mm - 27mm margins
  
  try {
    // Hide no-print elements
    const noPrintElements = document.querySelectorAll('.no-print') as NodeListOf<HTMLElement>;
    const printOnlyElements = document.querySelectorAll('.print-only') as NodeListOf<HTMLElement>;
    
    noPrintElements.forEach(el => el.style.display = 'none');
    printOnlyElements.forEach(el => el.classList.remove('hidden'));

    // Update print-only content with current values
    await updatePrintOnlyContent();

    // Wait for any pending chart renders to complete
    await new Promise(resolve => setTimeout(resolve, 1000));

    let pageCount = 0;

    // Page 1: Cover Page (Document Control + Part Info)
    const coverPageData = await createCoverPage();
    if (pageCount > 0) pdf.addPage();
    pdf.addImage(coverPageData, 'PNG', 10, 15, pageWidth, pageHeight);
    pageCount++;

    // Page 2: Summary Page
    const summaryPageData = await createSummaryPage();
    if (pageCount > 0) pdf.addPage();
    pdf.addImage(summaryPageData, 'PNG', 10, 15, pageWidth, pageHeight);
    pageCount++;

    // Following Pages: Individual Characteristic Pages
    const characteristics = document.querySelectorAll('[data-testid^="canvas-xbar-chart-"],[data-testid^="canvas-p-chart-"]');
    const characteristicIds = new Set<string>();
    
    characteristics.forEach(canvas => {
      const testId = canvas.getAttribute('data-testid') || '';
      const match = testId.match(/-(char_\d+)$/);
      if (match) {
        characteristicIds.add(match[1]);
      }
    });

    for (const charId of Array.from(characteristicIds)) {
      const characteristicPageData = await createCharacteristicPage(charId);
      if (characteristicPageData) {
        if (pageCount > 0) pdf.addPage();
        pdf.addImage(characteristicPageData, 'PNG', 10, 15, pageWidth, pageHeight);
        pageCount++;
      }
    }

    // Generate filename with current date
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
    const filename = `SPC_Report_${dateStr}_${timeStr}.pdf`;

    pdf.save(filename);
    
  } finally {
    // Restore display states
    const noPrintElements = document.querySelectorAll('.no-print') as NodeListOf<HTMLElement>;
    const printOnlyElements = document.querySelectorAll('.print-only') as NodeListOf<HTMLElement>;
    
    noPrintElements.forEach(el => el.style.display = '');
    printOnlyElements.forEach(el => el.classList.add('hidden'));
  }
}

async function createCoverPage(): Promise<string> {
  // Create a temporary container for cover page
  const coverContainer = document.createElement('div');
  coverContainer.className = 'pdf-cover-page';
  coverContainer.style.width = '800px';
  coverContainer.style.height = '1100px';
  coverContainer.style.position = 'absolute';
  coverContainer.style.top = '-9999px';
  coverContainer.style.background = 'white';
  coverContainer.style.padding = '40px';
  
  // Add title
  const title = document.createElement('h1');
  title.textContent = 'SPC Control Chart Analysis Report';
  title.style.fontSize = '32px';
  title.style.fontWeight = 'bold';
  title.style.marginBottom = '40px';
  title.style.color = '#1f2937';
  title.style.textAlign = 'center';
  coverContainer.appendChild(title);

  // Add document control information
  const docControl = document.querySelector('.bg-gray-50') as HTMLElement;
  if (docControl) {
    const clonedDocControl = docControl.cloneNode(true) as HTMLElement;
    clonedDocControl.style.backgroundColor = 'transparent';
    clonedDocControl.style.border = '1px solid #e5e7eb';
    clonedDocControl.style.marginBottom = '40px';
    
    // Show print-only content
    const printOnlyElements = clonedDocControl.querySelectorAll('.print-only');
    printOnlyElements.forEach(el => (el as HTMLElement).classList.remove('hidden'));
    
    // Hide no-print elements
    const noPrintElements = clonedDocControl.querySelectorAll('.no-print');
    noPrintElements.forEach(el => (el as HTMLElement).style.display = 'none');
    
    coverContainer.appendChild(clonedDocControl);
  }

  // Add part information and image
  const partSection = document.createElement('div');
  partSection.style.marginTop = '40px';
  partSection.style.textAlign = 'center';
  
  const selectedPartName = document.getElementById('selectedPartName')?.textContent || 'Custom Characteristics';
  const partTitle = document.createElement('h2');
  partTitle.textContent = `Analyzed Part: ${selectedPartName}`;
  partTitle.style.fontSize = '24px';
  partTitle.style.fontWeight = '600';
  partTitle.style.marginBottom = '30px';
  partTitle.style.color = '#374151';
  partSection.appendChild(partTitle);

  // Add part image
  const partImage = document.getElementById('partImage') as HTMLImageElement;
  if (partImage) {
    const clonedImage = partImage.cloneNode(true) as HTMLImageElement;
    clonedImage.style.maxWidth = '400px';
    clonedImage.style.maxHeight = '300px';
    clonedImage.style.objectFit = 'contain';
    clonedImage.style.border = '2px solid #d1d5db';
    clonedImage.style.borderRadius = '8px';
    partSection.appendChild(clonedImage);
  }
  
  coverContainer.appendChild(partSection);
  document.body.appendChild(coverContainer);

  const canvas = await window.html2canvas(coverContainer, {
    scale: 1.5,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    width: 800,
    height: 1100
  });

  document.body.removeChild(coverContainer);
  return canvas.toDataURL('image/png');
}

async function createSummaryPage(): Promise<string> {
  const summaryContainer = document.createElement('div');
  summaryContainer.className = 'pdf-summary-page';
  summaryContainer.style.width = '800px';
  summaryContainer.style.height = '1100px';
  summaryContainer.style.position = 'absolute';
  summaryContainer.style.top = '-9999px';
  summaryContainer.style.background = 'white';
  summaryContainer.style.padding = '40px';
  
  // Add title
  const title = document.createElement('h1');
  title.textContent = 'Analysis Summary';
  title.style.fontSize = '28px';
  title.style.fontWeight = 'bold';
  title.style.marginBottom = '30px';
  title.style.color = '#1f2937';
  title.style.textAlign = 'center';
  summaryContainer.appendChild(title);

  // Clone and add summary section
  const summarySection = document.querySelector('[data-testid="container-summary"]') as HTMLElement;
  if (summarySection) {
    const clonedSummary = summarySection.cloneNode(true) as HTMLElement;
    clonedSummary.style.fontSize = '14px';
    summaryContainer.appendChild(clonedSummary);
  }

  document.body.appendChild(summaryContainer);

  const canvas = await window.html2canvas(summaryContainer, {
    scale: 1.5,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    width: 800,
    height: 1100
  });

  document.body.removeChild(summaryContainer);
  return canvas.toDataURL('image/png');
}

async function createCharacteristicPage(characteristicId: string): Promise<string | null> {
  const characteristicElement = document.querySelector(`[data-testid="text-chart-title-${characteristicId}"]`)?.closest('.bg-white') as HTMLElement;
  
  if (!characteristicElement) {
    return null;
  }

  const pageContainer = document.createElement('div');
  pageContainer.className = 'pdf-characteristic-page';
  pageContainer.style.width = '800px';
  pageContainer.style.height = '1100px';
  pageContainer.style.position = 'absolute';
  pageContainer.style.top = '-9999px';
  pageContainer.style.background = 'white';
  pageContainer.style.padding = '20px';

  // Clone the characteristic content
  const clonedCharacteristic = characteristicElement.cloneNode(true) as HTMLElement;
  
  // Find and replace chart canvases with their rendered images
  const originalChartCanvases = characteristicElement.querySelectorAll('canvas');
  const clonedChartCanvases = clonedCharacteristic.querySelectorAll('canvas');
  
  for (let i = 0; i < originalChartCanvases.length && i < clonedChartCanvases.length; i++) {
    const originalCanvas = originalChartCanvases[i] as HTMLCanvasElement;
    const clonedCanvas = clonedChartCanvases[i] as HTMLCanvasElement;
    
    try {
      // Get the chart data URL from the original canvas
      const dataURL = originalCanvas.toDataURL('image/png');
      
      // Create an image element to replace the canvas
      const img = document.createElement('img');
      img.src = dataURL;
      img.style.width = '100%';
      img.style.height = originalCanvas.style.height || '250px';
      img.style.maxWidth = '100%';
      img.style.display = 'block';
      
      // Replace the cloned canvas with the image
      clonedCanvas.parentNode?.replaceChild(img, clonedCanvas);
    } catch (error) {
      console.warn('Failed to convert canvas to image:', error);
    }
  }
  
  // Adjust chart container sizes for better fit on page
  const chartContainers = clonedCharacteristic.querySelectorAll('.chart-container');
  chartContainers.forEach(container => {
    (container as HTMLElement).style.height = '250px';
    (container as HTMLElement).style.marginBottom = '20px';
  });

  // Adjust text sizes for better PDF rendering
  clonedCharacteristic.style.fontSize = '12px';
  
  const textElements = clonedCharacteristic.querySelectorAll('h3, .text-lg');
  textElements.forEach(el => {
    (el as HTMLElement).style.fontSize = '16px';
    (el as HTMLElement).style.marginBottom = '15px';
  });

  // Adjust grid layouts for single page
  const gridElements = clonedCharacteristic.querySelectorAll('.grid');
  gridElements.forEach(el => {
    (el as HTMLElement).style.gridTemplateColumns = 'repeat(3, minmax(0, 1fr))';
    (el as HTMLElement).style.gap = '8px';
  });

  pageContainer.appendChild(clonedCharacteristic);
  document.body.appendChild(pageContainer);

  // Wait for images to load
  const images = pageContainer.querySelectorAll('img');
  await Promise.all(Array.from(images).map(img => {
    return new Promise<void>((resolve) => {
      if (img.complete) {
        resolve();
      } else {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      }
    });
  }));

  const canvas = await window.html2canvas(pageContainer, {
    scale: 1.5,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    width: 800,
    height: 1100,
    ignoreElements: (element) => {
      // Ignore any remaining canvas elements
      return element.tagName === 'CANVAS';
    }
  });

  document.body.removeChild(pageContainer);
  return canvas.toDataURL('image/png');
}

async function updatePrintOnlyContent(): Promise<void> {
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