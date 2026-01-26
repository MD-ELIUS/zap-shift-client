import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateInvoicePDF = (invoiceData) => {
    const doc = new jsPDF();

    // Company Logo/Header
    doc.setFillColor(3, 55, 61); // Secondary Color #03373D
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(202, 235, 102); // Primary Color #CAEB66
    doc.setFontSize(26);
    doc.setFont('helvetica', 'bold');
    doc.text('ZAP SHIFT', 20, 25);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Fast & Reliable Parcel Delivery', 20, 32);

    // Invoice Title
    doc.setTextColor(3, 55, 61);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', 160, 25, { align: 'right' });

    // Invoice Details
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Invoice ID:  #INV-${invoiceData.transactionId.slice(-6)}`, 160, 32, { align: 'right' });
    doc.text(`Date:  ${new Date(invoiceData.date).toLocaleDateString()}`, 160, 37, { align: 'right' });

    // Bill To
    let yPos = 60;
    doc.setFontSize(12);
    doc.setTextColor(3, 55, 61); // Secondary
    doc.setFont('helvetica', 'bold');
    doc.text('Bill To:', 20, yPos);

    yPos += 7;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(invoiceData.customer_name || 'Customer', 20, yPos);
    yPos += 5;
    doc.text(invoiceData.customer_email || '', 20, yPos);

    // Item Table
    yPos += 15;
    doc.autoTable({
        startY: yPos,
        head: [['Description', 'Tracking ID', 'Amount (USD)']],
        body: invoiceData.items.map(item => [
            item.description,
            invoiceData.trackingId,
            `$${item.amount}`
        ]),
        headStyles: {
            fillColor: [3, 55, 61], // Secondary
            textColor: [202, 235, 102], // Primary caption
            fontStyle: 'bold'
        },
        styles: {
            fontSize: 10,
            cellPadding: 5
        },
        alternateRowStyles: {
            fillColor: [240, 240, 240]
        }
    });

    // Total
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(3, 55, 61);
    doc.text(`Total Paid: $${invoiceData.amount}`, 190, finalY, { align: 'right' });

    // Status
    doc.setFontSize(10);
    doc.setTextColor(40, 167, 69); // Green
    doc.text('PAID', 190, finalY + 7, { align: 'right' });

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text('Thank you for choosing Zap Shift for your delivery needs.', 105, 280, { align: 'center' });

    // Save
    doc.save(`Invoice_${invoiceData.transactionId}.pdf`);
};
