// src/utils/csvUtils.js

export function generateCSV(leads, serviceNames, bankNames) {
    const headers = ['Sl No', 'Name', 'Service', 'Bank Chosen', 'Date', 'Amount', 'Status'];
  
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
  
    const rows = leads.map((lead, index) => {
      const name = lead.customerDetails?.fullname || 'N/A';
      const service = serviceNames[lead.serviceId] || lead.serviceId || '';
      const bankChosen = bankNames[lead.bankId] || lead.bankId || '';
      const date = lead.submissionDate
        ? lead.submissionDate.toDate().toLocaleDateString()
        : '';
      const amount = lead.amount || '';
      const status = lead.status || '';
  
      return [
        escapeCSVField(index + 1),
        escapeCSVField(name),
        escapeCSVField(service),
        escapeCSVField(bankChosen),
        escapeCSVField(date),
        escapeCSVField(amount),
        escapeCSVField(status),
      ];
    });
  
    const csvContent = [headers, ...rows].map((e) => e.join(',')).join('\n');
  
    return csvContent;
  }
  