import { jsPDF } from 'jspdf';
import { PTICEvent } from '../types';

export function generateEventSchedulePdf(event: PTICEvent) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Colors
  const primaryNavy = [16, 38, 64]; // #102640
  const brandTeal = [19, 94, 105]; // #135E69
  const accentLight = [238, 244, 248];
  const textDark = [30, 41, 59];
  const textMuted = [100, 116, 139];

  // Header Background Banner
  doc.setFillColor(brandTeal[0], brandTeal[1], brandTeal[2]);
  doc.rect(0, 0, pageWidth, 42, 'F');

  // PTIC Emblem Badge
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(14, 10, 24, 22, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(brandTeal[0], brandTeal[1], brandTeal[2]);
  doc.text('PTIC', 26, 21, { align: 'center' });
  doc.setFontSize(6.5);
  doc.text('COUNCIL', 26, 26, { align: 'center' });

  // Organization & Document Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('POULTRY TECHNOLOGY & INNOVATION COUNCIL', 43, 19);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('OFFICIAL SUMMIT SCHEDULE & TECHNICAL AGENDA', 43, 27);

  doc.setFontSize(7.5);
  doc.text('Certified Document · Apex Council Event Secretariat', 43, 33);

  // Subheader Info Card
  doc.setFillColor(accentLight[0], accentLight[1], accentLight[2]);
  doc.roundedRect(14, 48, pageWidth - 28, 30, 2, 2, 'F');
  doc.setDrawColor(200, 215, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(14, 48, pageWidth - 28, 30, 2, 2, 'S');

  // Event Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  const splitTitle = doc.splitTextToSize(event.title, pageWidth - 36);
  doc.text(splitTitle, 20, 56);

  // Metadata Row
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(`Date: ${event.date || 'October 2026'}`, 20, 66);
  doc.text(`Time: ${event.timeRange || '09:00 AM – 05:30 PM IST'}`, 80, 66);
  doc.text(`Mode: ${event.mode || 'In-Person Summit'}`, 148, 66);

  doc.text(`Venue: ${event.venueAddress || event.location || 'Codissia Trade Fair Complex, Coimbatore'}`, 20, 72);

  // Day Section Banner
  let currentY = 86;
  doc.setFillColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.roundedRect(14, currentY, pageWidth - 28, 8, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('DAY 1 · TECHNICAL SESSIONS & KEYNOTE PAPERS', 20, currentY + 5.5);

  currentY += 13;

  // Table Header
  doc.setFillColor(brandTeal[0], brandTeal[1], brandTeal[2]);
  doc.rect(14, currentY, pageWidth - 28, 7.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('TIME', 20, currentY + 5);
  doc.text('SESSION / TOPIC', 54, currentY + 5);
  doc.text('SPEAKER / FACILITATOR', 140, currentY + 5);

  currentY += 7.5;

  // Agenda Items
  const agendaList = event.agendaItems && event.agendaItems.length > 0 ? event.agendaItems : [
    { time: '09:00 AM - 09:45 AM', topic: 'Delegate Registration & Council Member Networking', speaker: 'Council Secretariat' },
    { time: '09:45 AM - 10:30 AM', topic: 'Inaugural Address: Future of Commercial Poultry in Tamil Nadu', speaker: 'Council President & Guest Ministers' },
    { time: '10:30 AM - 11:45 AM', topic: 'Automated Tunnel Ventilation & Heat Stress Mitigation for 38°C+', speaker: 'Dr. Arun Kumar, VetCare Services' },
    { time: '11:45 AM - 12:45 PM', topic: 'IoT Ambient Sensors, Acoustic Flock Monitoring & AI Telemetry', speaker: 'Priya Subramaniam, AgriTech Solutions' },
    { time: '12:45 PM - 01:45 PM', topic: 'Networking Lunch & Exhibition Hall Pavilions Open', speaker: 'Exhibitors & Industry Partners' },
    { time: '01:45 PM - 03:00 PM', topic: 'Alternative Feed Proteins & Microbial Gut Health Optimization', speaker: 'Dr. Meenakshi Sundaram, TANUVAS' },
    { time: '03:00 PM - 04:15 PM', topic: 'Biosecurity Protocols, Vaccination Compliance & Water Sanitation', speaker: 'Avian Pathologist Panel' },
    { time: '04:15 PM - 05:00 PM', topic: 'Panel Discussion: Contract Farming Integrations & Margin Protection', speaker: 'Commercial Integrators Forum' },
    { time: '05:00 PM - 05:30 PM', topic: 'Closing Remarks & Official Summit Certificates Distribution', speaker: 'PTIC Executive Committee' },
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);

  agendaList.forEach((item, index) => {
    // Check page overflow
    if (currentY > pageHeight - 30) {
      doc.addPage();
      currentY = 20;

      // Repeat Table Header
      doc.setFillColor(brandTeal[0], brandTeal[1], brandTeal[2]);
      doc.rect(14, currentY, pageWidth - 28, 7.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text('TIME', 20, currentY + 5);
      doc.text('SESSION / TOPIC', 54, currentY + 5);
      doc.text('SPEAKER / FACILITATOR', 140, currentY + 5);
      currentY += 7.5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
    }

    const rowHeight = 11;
    // Alternating row background
    if (index % 2 === 0) {
      doc.setFillColor(250, 252, 254);
      doc.rect(14, currentY, pageWidth - 28, rowHeight, 'F');
    }

    // Border
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.rect(14, currentY, pageWidth - 28, rowHeight, 'S');

    // Time
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(brandTeal[0], brandTeal[1], brandTeal[2]);
    doc.text(item.time, 20, currentY + 6.5);

    // Topic
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    const splitTopic = doc.splitTextToSize(item.topic, 82);
    doc.text(splitTopic, 54, currentY + 4.5);

    // Speaker
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    const splitSpeaker = doc.splitTextToSize(item.speaker || 'Council Expert', 50);
    doc.text(splitSpeaker, 140, currentY + 5);

    currentY += rowHeight;
  });

  // Footer notes & watermark
  const footerY = Math.min(currentY + 12, pageHeight - 22);
  doc.setDrawColor(brandTeal[0], brandTeal[1], brandTeal[2]);
  doc.setLineWidth(0.5);
  doc.line(14, footerY, pageWidth - 14, footerY);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('Note: Sessions are subject to minor timing adjustments. Delegates must present their PTIC Pass at Hall Entry.', 14, footerY + 5);
  doc.text('Official PTIC Portal: https://ptic-council.org/ · Generated via PTIC Member Platform', 14, footerY + 9);

  doc.setFont('helvetica', 'bold');
  doc.text(`Page 1 of 1`, pageWidth - 14, footerY + 5, { align: 'right' });

  // Save the PDF
  const filename = `${event.title.replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '_')}_Schedule.pdf`;
  doc.save(filename);
}
