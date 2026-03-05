import { File } from 'expo-file-system';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx-js-style';
import { getDb } from '@/database/database';
import type { AttendanceStatus } from '@/database/database';

const STATUS_SHORT_MAP: Record<AttendanceStatus, string> = {
  present: 'P',
  late: 'R',
  injured: 'I',
  absent_justified: 'AG',
  absent_unjustified: 'AI',
  sick: 'M',
};

const STATUS_FULL_MAP: Record<AttendanceStatus, string> = {
  present: 'Presente',
  late: 'Ritardo',
  injured: 'Infortunio',
  absent_justified: 'Assente Giustificato',
  absent_unjustified: 'Assente Ingiustificato',
  sick: 'Malato',
};

function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9_\-]/g, '_')
    .replace(/_+/g, '_')
    .trim();
}

/* ========== MONTH ATTENDANCE XLSX ========== */

export async function exportMonthAttendanceXLSX(
  teamName: string,
  year: number,
  month: number,
  players: Array<{ id: number; name: string; number: string; position: string }>,
  attendances: Array<{ player_id: number; date: string; status: AttendanceStatus }>
): Promise<void> {
  const daysInMonth = new Date(year, month, 0).getDate();

  const playerAttendanceMap = new Map<number, Map<number, AttendanceStatus>>();
  players.forEach((p) => {
    playerAttendanceMap.set(p.id, new Map());
  });

  attendances.forEach((att) => {
    const day = parseInt(att.date.split('-')[2], 10);
    const playerMap = playerAttendanceMap.get(att.player_id);
    if (playerMap) {
      playerMap.set(day, att.status);
    }
  });

  // Prepare sheet data
  const monthName = new Date(year, month - 1).toLocaleString('it-IT', { month: 'long' });
  const titleRow = [`${teamName} - ${monthName} ${year}`];
  const headerRow = ['Nome', 'Ruolo'];
  for (let d = 1; d <= daysInMonth; d++) {
    headerRow.push(String(d));
  }

  const dataRows: any[] = [titleRow, [], headerRow];

  players.forEach((player) => {
    const row: any[] = [player.name, player.position];
    const playerMap = playerAttendanceMap.get(player.id);
    for (let d = 1; d <= daysInMonth; d++) {
      const status = playerMap?.get(d);
      row.push(status ? STATUS_SHORT_MAP[status] : '');
    }
    dataRows.push(row);
  });

  // Create workbook
  const ws = XLSX.utils.aoa_to_sheet(dataRows);

  // Apply styles
  const titleCellStyle = {
    font: { bold: true, size: 14 },
    alignment: { horizontal: 'center', vertical: 'center' },
  };

  const headerCellStyle = {
    font: { bold: true, color: { rgb: 'FFFFFFFF' } },
    fill: { fgColor: { rgb: 'FF4472C4' } },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: {
      top: { style: 'thin', color: { rgb: 'FF000000' } },
      bottom: { style: 'thin', color: { rgb: 'FF000000' } },
      left: { style: 'thin', color: { rgb: 'FF000000' } },
      right: { style: 'thin', color: { rgb: 'FF000000' } },
    },
  };

  const cellBorderStyle = {
    border: {
      top: { style: 'thin', color: { rgb: 'FFD3D3D3' } },
      bottom: { style: 'thin', color: { rgb: 'FFD3D3D3' } },
      left: { style: 'thin', color: { rgb: 'FFD3D3D3' } },
      right: { style: 'thin', color: { rgb: 'FFD3D3D3' } },
    },
    alignment: { horizontal: 'center', vertical: 'center' },
  };

  // Apply styles to cells
  ws['A1']!.s = titleCellStyle;
  ws.merge_cells = [{ s: { r: 0, c: 0 }, e: { r: 0, c: daysInMonth + 1 } }];

  // Header row
  for (let col = 0; col <= daysInMonth + 1; col++) {
    const cellRef = XLSX.utils.encode_col(col) + '3';
    if (ws[cellRef]) {
      ws[cellRef].s = headerCellStyle;
    }
  }

  // Data cells with borders
  for (let row = 3; row < dataRows.length; row++) {
    for (let col = 0; col <= daysInMonth + 1; col++) {
      const cellRef = XLSX.utils.encode_col(col) + (row + 1);
      if (ws[cellRef]) {
        ws[cellRef].s = cellBorderStyle;
      }
    }
  }

  // Set column widths
  const colWidths = [{ wch: 20 }, { wch: 15 }];
  for (let d = 0; d < daysInMonth; d++) {
    colWidths.push({ wch: 8 });
  }
  ws['!cols'] = colWidths;

  // Add legend at bottom
  const legendStartRow = dataRows.length + 2;
  ws[`A${legendStartRow}`] = { v: 'Legenda:', s: { font: { bold: true } } };
  const legendRows = [
    ['P', 'Presente'],
    ['R', 'Ritardo'],
    ['I', 'Infortunio'],
    ['AG', 'Assente Giustificato'],
    ['AI', 'Assente Ingiustificato'],
    ['M', 'Malato'],
  ];

  legendRows.forEach((leg, idx) => {
    ws[`A${legendStartRow + 1 + idx}`] = { v: leg[0], s: { alignment: { horizontal: 'center' } } };
    ws[`B${legendStartRow + 1 + idx}`] = { v: leg[1] };
  });

  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Presenze');

  // Generate file
  const sanitizedTeamName = sanitizeFilename(teamName || 'Squadra');
  const filename = `Presenze_${sanitizedTeamName}_${monthName}_${year}.xlsx`;
  const fileUri = `${FileSystem.documentDirectory}${filename}`;

  try {
    // Write XLSX
    const xlsxBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const xlsxBytes = new Uint8Array(xlsxBuffer);
    const file = new File(fileUri);

    // Write buffer directly (expo-file-system v19+ accepts TypedArray)
    await file.write(xlsxBytes);

    // Share
    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      // Add small delay to ensure file is fully written
      await new Promise(resolve => setTimeout(resolve, 500));
      
      try {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          dialogTitle: 'Esporta presenze mensili',
          UTI: 'com.microsoft.excel.xlsx',
        });
      } catch (shareError) {
        console.log('Share cancelled or failed, file saved at:', fileUri);
      }
    } else {
      console.log('Sharing not available. File saved at:', fileUri);
    }
  } catch (error) {
    console.error('Error creating or sharing XLSX file:', error);
    throw error;
  }
}

/* ========== TEAM ROSTER XLSX ========== */

export async function exportTeamRosterXLSX(
  teamName: string,
  players: Array<{
    id: number;
    name: string;
    number: string;
    position: string;
  }>
): Promise<void> {
  // Prepare sheet data
  const headerRow = ['Numero', 'Nome', 'Ruolo'];

  // Sort players by position then name (same as in UI)
  const POSITION_ORDER: Record<string, number> = {
    portiere: 0,
    difensore: 1,
    centrocampista: 2,
    attaccante: 3,
  };

  const sortedPlayers = [...players].sort((a, b) => {
    const posA = POSITION_ORDER[a.position?.toLowerCase()] ?? 99;
    const posB = POSITION_ORDER[b.position?.toLowerCase()] ?? 99;
    if (posA !== posB) return posA - posB;
    return a.name.localeCompare(b.name, 'it', { sensitivity: 'base' });
  });

  const dataRows: any[] = [
    [`Rosa - ${teamName}`],
    [],
    headerRow,
    ...sortedPlayers.map((p) => [p.number, p.name, p.position]),
  ];

  const ws = XLSX.utils.aoa_to_sheet(dataRows);

  // Title style
  const titleCellStyle = {
    font: { bold: true, size: 14 },
    alignment: { horizontal: 'center', vertical: 'center' },
  };

  // Header style
  const headerCellStyle = {
    font: { bold: true, color: { rgb: 'FFFFFFFF' } },
    fill: { fgColor: { rgb: 'FF4472C4' } },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: {
      top: { style: 'thin', color: { rgb: 'FF000000' } },
      bottom: { style: 'thin', color: { rgb: 'FF000000' } },
      left: { style: 'thin', color: { rgb: 'FF000000' } },
      right: { style: 'thin', color: { rgb: 'FF000000' } },
    },
  };

  const cellBorderStyle = {
    border: {
      top: { style: 'thin', color: { rgb: 'FFD3D3D3' } },
      bottom: { style: 'thin', color: { rgb: 'FFD3D3D3' } },
      left: { style: 'thin', color: { rgb: 'FFD3D3D3' } },
      right: { style: 'thin', color: { rgb: 'FFD3D3D3' } },
    },
    alignment: { horizontal: 'center', vertical: 'center' },
  };

  // Apply title style
  ws['A1']!.s = titleCellStyle;
  ws.merge_cells = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }];

  // Header row
  for (let col = 0; col < 3; col++) {
    const cellRef = XLSX.utils.encode_col(col) + '3';
    if (ws[cellRef]) {
      ws[cellRef].s = headerCellStyle;
    }
  }

  // Data cells
  for (let row = 3; row < dataRows.length; row++) {
    for (let col = 0; col < 3; col++) {
      const cellRef = XLSX.utils.encode_col(col) + (row + 1);
      if (ws[cellRef]) {
        ws[cellRef].s = cellBorderStyle;
      }
    }
  }

  // Column widths
  ws['!cols'] = [{ wch: 12 }, { wch: 25 }, { wch: 18 }];

  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Rosa');

  // Generate file
  const sanitizedTeamName = sanitizeFilename(teamName || 'Squadra');
  const filename = `Rosa_${sanitizedTeamName}.xlsx`;
  const fileUri = `${FileSystem.documentDirectory}${filename}`;

  try {
    // Write XLSX
    const xlsxBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const xlsxBytes = new Uint8Array(xlsxBuffer);
    const file = new File(fileUri);

    // Write buffer directly (expo-file-system v19+ accepts TypedArray)
    await file.write(xlsxBytes);

    // Share
    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      // Add small delay to ensure file is fully written
      await new Promise(resolve => setTimeout(resolve, 500));
      
      try {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          dialogTitle: 'Esporta rosa squadra',
          UTI: 'com.microsoft.excel.xlsx',
        });
      } catch (shareError) {
        console.log('Share cancelled or failed, file saved at:', fileUri);
      }
    } else {
      console.log('Sharing not available. File saved at:', fileUri);
    }
  } catch (error) {
    console.error('Error creating or sharing XLSX file:', error);
    throw error;
  }
}

/* ========== MISTER FINES XLSX ========== */

export async function exportMisterFinesXLSX(
  ownerId: number,
  teamId?: number,
  teamName?: string
): Promise<void> {
  console.log('[exportMisterFinesXLSX] Start - ownerId:', ownerId, 'teamId:', teamId);
  
  const db = await getDb();
  console.log('[exportMisterFinesXLSX] DB acquired');

  const params: any[] = [ownerId];
  let extraTeamFilter = '';

  if (typeof teamId === 'number' && teamId > 0) {
    extraTeamFilter = ' AND t.id = ?';
    params.push(teamId);
  }

  console.log('[exportMisterFinesXLSX] Querying DB with params:', params);
  
  const rows = await db.getAllAsync<{
    id: number;
    player_id: number;
    type: string;
    amount: number;
    description?: string | null;
    due_date: string;
    is_paid: 0 | 1;
    paid_at?: string | null;
    created_at: string;
    player_name?: string | null;
    player_number?: string | null;
    team_name?: string | null;
  }>(
    `
    SELECT f.*,
           p.name   AS player_name,
           p.number AS player_number,
           t.name   AS team_name
    FROM fines f
    JOIN players p ON f.player_id = p.id
    JOIN teams   t ON p.team_id = t.id
    WHERE t.owner_user_id = ?${extraTeamFilter}
    ORDER BY f.created_at DESC;
    `,
    params
  );
  
  console.log('[exportMisterFinesXLSX] Query returned', rows.length, 'rows');

  const formatDate = (isoLike: string | null | undefined) => {
    if (!isoLike) return '';
    const d = new Date(isoLike);
    if (isNaN(d.getTime())) return '';
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const formatDateTime = (isoLike: string | null | undefined) => {
    if (!isoLike) return '';
    const d = new Date(isoLike);
    if (isNaN(d.getTime())) return '';
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
  };

  const headerRow = [
    'Squadra',
    'Giocatore',
    'Numero',
    'Tipo multa',
    'Importo (€)',
    'Data scadenza',
    'Pagata',
    'Data pagamento',
    'Creata il',
  ];

  const dataRows: any[] = [headerRow];

  rows.forEach((r: any) => {
    dataRows.push([
      r.team_name || '',
      r.player_name || '',
      r.player_number || '',
      r.type || '',
      r.amount,
      formatDate(r.due_date),
      r.is_paid ? 'Sì' : 'No',
      formatDateTime(r.paid_at),
      formatDateTime(r.created_at),
    ]);
  });

  console.log('[exportMisterFinesXLSX] Building worksheet with', dataRows.length, 'total rows');
  
  const ws = XLSX.utils.aoa_to_sheet(dataRows);
  console.log('[exportMisterFinesXLSX] Worksheet created');

  const headerCellStyle = {
    font: { bold: true, color: { rgb: 'FFFFFFFF' } },
    fill: { fgColor: { rgb: 'FF4472C4' } },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: {
      top: { style: 'thin', color: { rgb: 'FF000000' } },
      bottom: { style: 'thin', color: { rgb: 'FF000000' } },
      left: { style: 'thin', color: { rgb: 'FF000000' } },
      right: { style: 'thin', color: { rgb: 'FF000000' } },
    },
  };

  const cellBorderStyle = {
    border: {
      top: { style: 'thin', color: { rgb: 'FFD3D3D3' } },
      bottom: { style: 'thin', color: { rgb: 'FFD3D3D3' } },
      left: { style: 'thin', color: { rgb: 'FFD3D3D3' } },
      right: { style: 'thin', color: { rgb: 'FFD3D3D3' } },
    },
    alignment: { horizontal: 'left', vertical: 'center' },
  };

  const amountCellStyle = {
    ...cellBorderStyle,
    alignment: { horizontal: 'right', vertical: 'center' },
    numFmt: '€ #,##0.00',
  };

  // Apply header style
  for (let col = 0; col < headerRow.length; col++) {
    const cellRef = XLSX.utils.encode_col(col) + '1';
    if (ws[cellRef]) {
      ws[cellRef].s = headerCellStyle;
    }
  }

  // Apply data cell styles
  for (let row = 1; row < dataRows.length; row++) {
    for (let col = 0; col < headerRow.length; col++) {
      const cellRef = XLSX.utils.encode_col(col) + (row + 1);
      if (ws[cellRef]) {
        ws[cellRef].s = col === 4 ? amountCellStyle : cellBorderStyle;
      }
    }
  }

  // Column widths
  ws['!cols'] = [
    { wch: 20 },
    { wch: 25 },
    { wch: 10 },
    { wch: 18 },
    { wch: 12 },
    { wch: 15 },
    { wch: 8 },
    { wch: 18 },
    { wch: 18 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Multe');
  console.log('[exportMisterFinesXLSX] Workbook created');

  const sanitizedTeamName = sanitizeFilename(teamName || 'Squadra');
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const datePart = `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()}`;

  const filename = teamId
    ? `Multe_${sanitizedTeamName}_${datePart}.xlsx`
    : `Multe_TutteLeSquadre_${datePart}.xlsx`;

  const fileUri = `${FileSystem.documentDirectory}${filename}`;
  console.log('[exportMisterFinesXLSX] File path:', fileUri);

  try {
    console.log('[exportMisterFinesXLSX] Writing XLSX to buffer...');
    const xlsxBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    console.log('[exportMisterFinesXLSX] Buffer created, size:', xlsxBuffer.byteLength || xlsxBuffer.length);
    
    const xlsxBytes = new Uint8Array(xlsxBuffer);
    console.log('[exportMisterFinesXLSX] Uint8Array created');
    
    const file = new File(fileUri);
    console.log('[exportMisterFinesXLSX] File object created');

    // Write buffer directly (expo-file-system v19+ accepts TypedArray)
    console.log('[exportMisterFinesXLSX] Writing to file...');
    await file.write(xlsxBytes);
    console.log('[exportMisterFinesXLSX] File written successfully');

    const canShare = await Sharing.isAvailableAsync();
    console.log('[exportMisterFinesXLSX] Sharing available:', canShare);
    
    if (canShare) {
      console.log('[exportMisterFinesXLSX] Opening share sheet...');
      // Add small delay to ensure file is fully written
      await new Promise(resolve => setTimeout(resolve, 500));
      
      try {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          dialogTitle: 'Esporta multe',
          UTI: 'com.microsoft.excel.xlsx',
        });
        console.log('[exportMisterFinesXLSX] Share sheet completed');
      } catch (shareError) {
        console.log('[exportMisterFinesXLSX] Share cancelled or failed, file saved at:', fileUri);
      }
    } else {
      console.log('Sharing not available. File saved at:', fileUri);
    }
  } catch (error) {
    console.error('[exportMisterFinesXLSX] Error creating or sharing fines XLSX:', error);
    throw error;
  }
  
  console.log('[exportMisterFinesXLSX] Export completed');
}
