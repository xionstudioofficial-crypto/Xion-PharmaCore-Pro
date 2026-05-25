import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generatePharmacyReport = () => {
    const doc = new jsPDF();

    // Pharmacy Header Branding (Dark teal: #09352F)
    doc.setFillColor(9, 53, 47);
    doc.rect(0, 0, 210, 38, 'F');
    
    // Header Logo/Text in White
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('PharmaPlus', 14, 20);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(167, 209, 41); // Accent Lime: #A7D129
    doc.text('Pharmacy Management & Analytics Report', 14, 28);
    
    // Date metadata
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 196, 20, { align: 'right' });

    // Back to primary text colors
    doc.setTextColor(33, 33, 33);

    // Sales Overview Table
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Sales Overview & Recent Transactions', 14, 48);
    
    autoTable(doc, {
        startY: 53,
        head: [['Medicine Name', 'Quantity Sold', 'Amount', 'Transaction Date']],
        body: [
            ['Amoxicillin 500mg', '12', '$144.00', '2026-05-25'],
            ['Ibuprofen 400mg', '25', '$125.00', '2026-05-25'],
            ['Paracetamol 500mg', '30', '$90.00', '2026-05-24'],
            ['Atorvastatin 20mg', '8', '$240.00', '2026-05-24'],
        ],
        theme: 'striped',
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: { fillColor: [9, 53, 47] },
    });

    const inventoryY = (doc as any).lastAutoTable?.finalY || 105;

    // Inventory & Stock Summary Table
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Inventory & Stock Alerts', 14, inventoryY + 12);
    
    autoTable(doc, {
        startY: inventoryY + 16,
        head: [['Medicine Name', 'Stock Status', 'In-stock Quantity', 'Urgent Action Required']],
        body: [
            ['Lisinopril 10mg', 'Low Stock Alert', '12', 'Reorder Immediately'],
            ['Metformin 850mg', 'Out of stock', '0', 'Urgent Purchase Reorder'],
            ['Amoxicillin 500mg', 'Adequate', '150', 'None'],
            ['Atorvastatin 20mg', 'Adequate', '85', 'None'],
        ],
        theme: 'striped',
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: { fillColor: [9, 53, 47] },
    });

    const profitY = (doc as any).lastAutoTable?.finalY || 175;

    // Profit & Financial Performance Table
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Profit & Revenue Analysis', 14, profitY + 12);
    
    autoTable(doc, {
        startY: profitY + 16,
        head: [['Reporting Period', 'Gross Sales', 'Cost of Goods Sold', 'Net Profit Margin']],
        body: [
            ['Today (May 25)', '$269.00', '$110.00', '$159.00 (59.1%)'],
            ['Yesterday (May 24)', '$330.00', '$140.00', '$190.00 (57.5%)'],
            ['This Month (May 2026)', '$5,420.00', '$2,100.00', '$3,320.00 (61.3%)'],
        ],
        theme: 'striped',
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: { fillColor: [9, 53, 47] },
    });

    doc.save('pharmacy-management-report.pdf');
};
