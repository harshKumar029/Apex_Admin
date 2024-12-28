// src/utils/agentCsv.js

/**
 * Generates a CSV string for user data.
 * @param {Array} users - array of user objects
 * @returns {string} CSV content
 */
export const generateUserCSV = (users) => {
    // Define CSV headers (customize as needed)
    const headers = ['UserID', 'UniqueID', 'FullName', 'Mobile', 'Email', 'CreatedAt'];
  
    // Build rows
    const rows = users.map((user) => {
      const createdAtStr = user.createdAt?.toDate
        ? user.createdAt.toDate().toLocaleString()
        : '';
      return [
        user.id || '',              // Firestore doc ID
        user.uniqueID || '',
        user.fullname || '',
        user.mobile || '',
        user.email || '',
        createdAtStr
      ];
    });
  
    // Combine into CSV string
    const csvContent = [
      headers.join(','), // header row
      ...rows.map(row => row.join(',')) // data rows
    ].join('\n');
  
    return csvContent;
  };
  