import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ProposalData {
  advisor: {
    name: string;
    arn: string;
    experience: number;
    email: string;
    phone: string;
    aum: number;
  };
  client: {
    name: string;
    email: string;
    phone: string;
    riskProfile: string;
    investmentGoal: string;
  };
  selectedFunds: Array<{
    name: string;
    category: string;
    returns3Y: number;
    riskLevel: string;
    expenseRatio?: number;
    minInvestment?: number;
  }>;
  advisorNote: string;
  proposalDate: string;
}

/**
 * Generate a professional investment proposal PDF with enhanced design
 * Includes: branding, advisor info, educational content, portfolio visualization
 */
export function generateProposalPDF(data: ProposalData): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  let yPosition = 15;

  // ══════════════════════════════════════════════════
  // SECTION 1: PROFESSIONAL HEADER WITH BRANDING
  // ══════════════════════════════════════════════════

  // Blue header bar
  doc.setFillColor(41, 128, 185); // Professional blue
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Investment Proposal', pageWidth / 2, 20, { align: 'center' });

  // Subtitle
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Prepared on: ${data.proposalDate}`, pageWidth / 2, 30, { align: 'center' });

  // ══════════════════════════════════════════════════
  // SECTION 2: ADVISOR CREDENTIALS (PROFESSIONAL CARD)
  // ══════════════════════════════════════════════════

  yPosition = 50;

  // Advisor card with border
  doc.setDrawColor(41, 128, 185);
  doc.setLineWidth(0.5);
  doc.roundedRect(10, yPosition, pageWidth - 20, 35, 3, 3, 'S');

  // Card background
  doc.setFillColor(248, 249, 250);
  doc.roundedRect(10, yPosition, pageWidth - 20, 35, 3, 3, 'F');

  yPosition += 8;

  // Advisor name (prominent)
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Prepared By:', 15, yPosition);
  doc.setFontSize(16);
  doc.text(data.advisor.name, 15, yPosition + 7);

  // Credentials in two columns
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`ARN: ${data.advisor.arn}`, 15, yPosition + 14);
  doc.text(`Experience: ${data.advisor.experience} years`, 15, yPosition + 19);
  doc.text(`Email: ${data.advisor.email}`, 15, yPosition + 24);

  // RIGHT COLUMN: AUM and Phone
  doc.text(`AUM: ₹${formatIndianCurrency(data.advisor.aum)}`, pageWidth - 80, yPosition + 14);
  doc.text(`Phone: ${data.advisor.phone}`, pageWidth - 80, yPosition + 19);

  // ══════════════════════════════════════════════════
  // SECTION 3: CLIENT INFORMATION
  // ══════════════════════════════════════════════════

  yPosition += 45;

  doc.setFillColor(41, 128, 185);
  doc.rect(10, yPosition, 4, 20, 'F'); // Left accent bar

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Prepared For:', 18, yPosition + 7);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Client: ${data.client.name}`, 18, yPosition + 14);
  doc.text(`Risk Profile: ${data.client.riskProfile}`, pageWidth / 2 + 10, yPosition + 14);
  doc.text(`Investment Goal: ${data.client.investmentGoal}`, 18, yPosition + 20);

  // ══════════════════════════════════════════════════
  // SECTION 4: ADVISOR'S RECOMMENDATION (HIGHLIGHTED)
  // ══════════════════════════════════════════════════

  if (data.advisorNote) {
    yPosition += 30;

    doc.setFillColor(254, 243, 199); // Light yellow background
    doc.roundedRect(10, yPosition, pageWidth - 20, 25, 3, 3, 'F');

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('💡 Advisor\'s Recommendation:', 15, yPosition + 8);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const noteLines = doc.splitTextToSize(data.advisorNote, pageWidth - 30);
    doc.text(noteLines, 15, yPosition + 15);

    yPosition += 30;
  }

  // ══════════════════════════════════════════════════
  // SECTION 5: RECOMMENDED FUNDS TABLE (PROFESSIONAL)
  // ══════════════════════════════════════════════════

  yPosition += 5;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Recommended Mutual Funds', 15, yPosition);

  yPosition += 5;

  autoTable(doc, {
    startY: yPosition,
    head: [['Fund Name', 'Category', '3Y Returns', 'Risk', 'Expense Ratio', 'Min. Investment']],
    body: data.selectedFunds.map(fund => [
      fund.name,
      fund.category,
      `${fund.returns3Y}%`,
      fund.riskLevel,
      `${fund.expenseRatio || 1.2}%`,
      `₹${formatIndianCurrency(fund.minInvestment || 5000)}`,
    ]),
    theme: 'striped',
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 9,
      cellPadding: 4,
    },
    bodyStyles: {
      fontSize: 8,
      cellPadding: 3,
    },
    alternateRowStyles: {
      fillColor: [248, 249, 250],
    },
    columnStyles: {
      0: { cellWidth: 55 }, // Fund name (wider)
      1: { cellWidth: 30 },
      2: { cellWidth: 20, halign: 'right' },
      3: { cellWidth: 20, halign: 'center' },
      4: { cellWidth: 25, halign: 'right' },
      5: { cellWidth: 30, halign: 'right' },
    },
  });

  // ══════════════════════════════════════════════════
  // SECTION 6: PORTFOLIO ALLOCATION VISUALIZATION
  // ══════════════════════════════════════════════════

  const finalY = (doc as any).lastAutoTable.finalY + 10;

  // Calculate allocation percentages
  const allocation = calculateAllocation(data.selectedFunds);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Recommended Portfolio Allocation', 15, finalY);

  // Draw allocation legend
  const chartY = finalY + 8;
  const colors = [
    [76, 175, 80],   // Green for Equity
    [33, 150, 243],  // Blue for Debt
    [255, 152, 0],   // Orange for Hybrid
  ];

  let legendY = chartY;
  let colorIndex = 0;

  const allocationEntries = [
    { name: 'Equity Funds', value: allocation.equity },
    { name: 'Debt Funds', value: allocation.debt },
    { name: 'Hybrid Funds', value: allocation.hybrid },
  ];

  allocationEntries.forEach(item => {
    if (item.value > 0) {
      // Color box
      doc.setFillColor(colors[colorIndex][0], colors[colorIndex][1], colors[colorIndex][2]);
      doc.rect(15, legendY, 5, 5, 'F');

      // Text
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`${item.name}: ${item.value}%`, 23, legendY + 4);

      legendY += 8;
      colorIndex++;
    }
  });

  // ══════════════════════════════════════════════════
  // SECTION 7: EDUCATIONAL CONTENT FOR BEGINNERS
  // ══════════════════════════════════════════════════

  const educationY = legendY + 10;

  doc.setFillColor(232, 245, 233); // Light green background
  doc.roundedRect(10, educationY, pageWidth - 20, 45, 3, 3, 'F');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('📚 Understanding Your Investment', 15, educationY + 7);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');

  const educationalContent = [
    '• Mutual Funds: Pool money from multiple investors to invest in stocks, bonds, or other assets.',
    '• Risk Profile: Indicates how much market fluctuation you can handle. Growth = Higher risk, higher returns.',
    '• 3Y Returns: Past performance over 3 years. Not guaranteed for future, but indicates fund quality.',
    '• Expense Ratio: Annual fee charged by the fund. Lower is better (typically 0.5% - 2%).',
    '• Diversification: Spreading investments across multiple funds reduces risk.',
    '• SIP (Systematic Investment Plan): Invest small amounts regularly instead of a lump sum.',
  ];

  let contentY = educationY + 14;
  educationalContent.forEach(line => {
    doc.text(line, 15, contentY, { maxWidth: pageWidth - 30 });
    contentY += 5;
  });

  // ══════════════════════════════════════════════════
  // SECTION 8: NEXT STEPS & CALL TO ACTION
  // ══════════════════════════════════════════════════

  const nextStepsY = contentY + 8;

  doc.setFillColor(227, 242, 253); // Light blue background
  doc.roundedRect(10, nextStepsY, pageWidth - 20, 25, 3, 3, 'F');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('📞 Next Steps:', 15, nextStepsY + 7);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('1. Review the recommended funds and their details', 15, nextStepsY + 13);
  doc.text('2. Share any questions or concerns with your advisor', 15, nextStepsY + 18);
  doc.text(`3. Contact ${data.advisor.name} at ${data.advisor.phone} to proceed with investment`, 15, nextStepsY + 23);

  // ══════════════════════════════════════════════════
  // SECTION 9: FOOTER - DISCLAIMER (MANDATORY)
  // ══════════════════════════════════════════════════

  const disclaimerY = pageHeight - 25;

  doc.setFontSize(7);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 100, 100);

  const disclaimer = 'Disclaimer: Mutual fund investments are subject to market risks. Please read all scheme-related documents carefully before investing. Past performance is not indicative of future returns. The information provided is for educational purposes only and should not be construed as investment advice.';
  const disclaimerLines = doc.splitTextToSize(disclaimer, pageWidth - 20);
  doc.text(disclaimerLines, 10, disclaimerY);

  // Footer line
  doc.setDrawColor(200, 200, 200);
  doc.line(10, disclaimerY - 3, pageWidth - 10, disclaimerY - 3);

  // ══════════════════════════════════════════════════
  // SAVE PDF
  // ══════════════════════════════════════════════════

  const fileName = `Investment_Proposal_${data.client.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}

// ══════════════════════════════════════════════════
// HELPER FUNCTIONS
// ══════════════════════════════════════════════════

/**
 * Format number to Indian currency (₹5,60,080 instead of ₹560080)
 */
function formatIndianCurrency(amount: number): string {
  return amount.toLocaleString('en-IN');
}

/**
 * Calculate portfolio allocation percentages by fund category
 */
function calculateAllocation(funds: any[]): { equity: number; debt: number; hybrid: number } {
  const total = funds.length;
  if (total === 0) return { equity: 0, debt: 0, hybrid: 0 };

  const equity = funds.filter(f => f.category.toLowerCase().includes('equity')).length;
  const debt = funds.filter(f => f.category.toLowerCase().includes('debt') || f.category.toLowerCase().includes('gilt')).length;
  const hybrid = funds.filter(f => f.category.toLowerCase().includes('hybrid') || f.category.toLowerCase().includes('balanced')).length;

  return {
    equity: Math.round((equity / total) * 100),
    debt: Math.round((debt / total) * 100),
    hybrid: Math.round((hybrid / total) * 100),
  };
}
