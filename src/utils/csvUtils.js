// src/utils/csvUtils.js

/**
 * Generate CSV string from an array of lead objects.
 * You can customize the columns/fields as per your requirement.
 *
 * @param {Array} leads - Array of lead objects
 * @returns {string} - CSV formatted string
 */
export function generateCSV(leads) {
  if (!leads || leads.length === 0) {
    return '';
  }

  // Define which fields you want in the CSV
  // For example: id, userId, customerDetails.fullname, status, bankId, serviceId, submissionDate, etc.
  const headers = [
    'Lead ID',
    'User ID',
    'Customer Name',
    'Mobile',
    'Email',
    'Bank ID',
    'Service ID',
    'Status',
    'Submission Date',
    'Earning Amount',
  ];

  // Create CSV rows
  const rows = leads.map((lead) => {
    // Safely get subfields (e.g. customerDetails might be undefined)
    const customerName = lead.customerDetails?.fullname || '';
    const customerMobile = lead.customerDetails?.mobile || '';
    const customerEmail = lead.customerDetails?.email || '';
    const submissionTime = lead.submissionDate?.toDate
      ? lead.submissionDate.toDate().toISOString()
      : '';
    const earningAmt = lead.earningAmount || 0;

    return [
      lead.id,
      lead.userId || '',
      customerName,
      customerMobile,
      customerEmail,
      lead.bankId || '',
      lead.serviceId || '',
      lead.status || '',
      submissionTime,
      earningAmt,
    ];
  });

  // Convert arrays to CSV lines
  const csvLines = [];
  csvLines.push(headers.join(',')); // header line
  rows.forEach((rowArray) => {
    // Escape any commas or newlines if needed
    const escapedRow = rowArray.map((val) => `"${String(val).replace(/"/g, '""')}"`);
    csvLines.push(escapedRow.join(','));
  });

  // Join all lines
  return csvLines.join('\n');
}
