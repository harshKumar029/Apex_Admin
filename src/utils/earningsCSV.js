// src/utils/earningsCSV.js

export function generateEarningsCSV(earningsHistory) {
    const headers = ['Earning ID', 'Amount', 'Date', 'Type', 'Status', 'Lead ID'];
  
    function escapeCSVField(field) {
      if (field == null) {
        return '';
      }
      const fieldString = String(field);
      if (fieldString.includes(',') || fieldString.includes('"') || fieldString.includes('\n')) {
        // Escape double quotes by replacing " with ""
        const escapedField = fieldString.replace(/"/g, '""');
        return `"${escapedField}"`;
      } else {
        return fieldString;
      }
    }
  
    const rows = earningsHistory.map((earning) => {
      const amount = earning.amount || '';
      const date = earning.date
        ? earning.date.toDate().toLocaleDateString()
        : '';
      const type = earning.type || '';
      const status = earning.status || '';
      const leadId = earning.leadId || '';
  
      return [
        escapeCSVField(earning.id),
        escapeCSVField(amount),
        escapeCSVField(date),
        escapeCSVField(type),
        escapeCSVField(status),
        escapeCSVField(leadId),
      ];
    });
  
    const csvContent = [headers, ...rows].map((e) => e.join(',')).join('\n');
  
    return csvContent;
  }
  