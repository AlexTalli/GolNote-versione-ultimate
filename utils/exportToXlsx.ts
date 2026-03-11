import { File } from 'expo-file-system';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx-js-style';
import { teamsDB, playersDB, finesDB } from '@/database/database';
import type { AttendanceStatus } from '@/database/database';

const STATUS_SHORT_MAP: Record<AttendanceStatus, string> = {
  present: 'P',
  late: 'R',
  injured: 'I',
  absent_justified: 'AG',
  absent_unjustified: 'AI',
  sick: 'M',
  malato: 'M',
  riposo: 'R',
};

const STATUS_FULL_MAP: Record<AttendanceStatus, string> = {
  present: 'Presente',
  late: 'Ritardo',
  injured: 'Infortunio',
  absent_justified: 'Assente Giustificato',
  absent_unjustified: 'Assente Ingiustificato',
  sick: 'Malato',
  malato: 'Malato',
  riposo: 'Riposo',
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
  players: Array<{ id: number; name: string; surname?: string | null; number?: string; position?: string }>,
  attendances: Array<{ player_id: number; date: string; status: AttendanceStatus }>
): Promise<void> {
  const daysInMonth = new Date(year, month, 0).getDate();

  const parsePlayerName = (player: { name: string; surname?: string | null }) => {
    const explicitSurname = player.surname?.trim();
    if (explicitSurname) {
      return {
        surname: explicitSurname,
        name: player.name?.trim() || '',
      };
    }

    const raw = (player.name || '').trim();
    const parts = raw.split(' ').filter(Boolean);
    if (parts.length > 1) {
      return {
        surname: parts[parts.length - 1],
        name: parts.slice(0, -1).join(' '),
      };
    }

    return { surname: '', name: raw };
  };

  const sortedPlayers = [...players].sort((a, b) => {
    const aParsed = parsePlayerName(a);
    const bParsed = parsePlayerName(b);

    const bySurname = aParsed.surname.localeCompare(bParsed.surname, 'it', { sensitivity: 'base' });
    if (bySurname !== 0) return bySurname;
    return aParsed.name.localeCompare(bParsed.name, 'it', { sensitivity: 'base' });
  });

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
  const headerRow = ['Cognome', 'Nome'];
  for (let d = 1; d <= daysInMonth; d++) {
    headerRow.push(String(d));
  }

  const recapColumns: AttendanceStatus[] = [
    'present',
    'late',
    'absent_justified',
    'absent_unjustified',
    'injured',
    'sick',
  ];
  recapColumns.forEach((status) => headerRow.push(STATUS_SHORT_MAP[status]));

  const dataRows: any[] = [titleRow, [], headerRow];

  sortedPlayers.forEach((player) => {
    const parsed = parsePlayerName(player);
    const row: any[] = [parsed.surname, parsed.name];
    const playerMap = playerAttendanceMap.get(player.id);

    const recapCount: Record<AttendanceStatus, number> = {
      present: 0,
      late: 0,
      injured: 0,
      absent_justified: 0,
      absent_unjustified: 0,
      sick: 0,
      malato: 0,
      riposo: 0,
    };

    for (let d = 1; d <= daysInMonth; d++) {
      const status = playerMap?.get(d);
      row.push(status ? STATUS_SHORT_MAP[status] : '');
      if (status) recapCount[status] += 1;
    }

    recapColumns.forEach((status) => row.push(recapCount[status]));
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
  ws.merge_cells = [{ s: { r: 0, c: 0 }, e: { r: 0, c: daysInMonth + 1 + recapColumns.length } }];

  // Header row
  for (let col = 0; col <= daysInMonth + 1 + recapColumns.length; col++) {
    const cellRef = XLSX.utils.encode_col(col) + '3';
    if (ws[cellRef]) {
      ws[cellRef].s = headerCellStyle;
    }
  }

  // Data cells with borders
  for (let row = 3; row < dataRows.length; row++) {
    for (let col = 0; col <= daysInMonth + 1 + recapColumns.length; col++) {
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
  recapColumns.forEach(() => colWidths.push({ wch: 6 }));
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
  ownerId: string,
  teamId?: number,
  teamName?: string
): Promise<void> {
  console.log('[exportMisterFinesXLSX] Start - ownerId:', ownerId, 'teamId:', teamId);

  let teams;
  if (typeof teamId === 'number' && teamId > 0) {
    // Esporta solo multe di questo team
    const team = await teamsDB.getById(teamId);
    teams = team ? [team] : [];
  } else {
    // Esporta multe di tutte le squadre del mister
    teams = await teamsDB.getAllByOwner(ownerId);
  }

  console.log('[exportMisterFinesXLSX] Teams found:', teams.length);

  // Raccogliamo tutte le multe con i dati dei giocatori
  const allFines = [];
  for (const team of teams) {
    const teamFines = await finesDB.getByTeam(team.id);
    allFines.push(...teamFines);
  }

  console.log('[exportMisterFinesXLSX] Total fines:', allFines.length);

  // Ordina per team, poi per cognome giocatore, poi per data creazione multa
  allFines.sort((a, b) => {
    const teamCompare = (a.team_name || '').localeCompare(b.team_name || '', 'it', { sensitivity: 'base' });
    if (teamCompare !== 0) return teamCompare;

    const playerCompare = (a.player_name || '').localeCompare(b.player_name || '', 'it', { sensitivity: 'base' });
    if (playerCompare !== 0) return playerCompare;

    return (b.created_at || '').localeCompare(a.created_at || '');
  });

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

  const formatPlayerName = (name?: string | null, surname?: string | null) => {
    const cleanName = (name || '').trim();
    const cleanSurname = (surname || '').trim();

    if (cleanSurname) return `${cleanSurname}, ${cleanName}`;

    const parts = cleanName.split(' ').filter(Boolean);
    if (parts.length > 1) {
      const extractedSurname = parts[parts.length - 1];
      const extractedName = parts.slice(0, -1).join(' ');
      return `${extractedSurname}, ${extractedName}`;
    }

    return cleanName;
  };

  const headerRow = [
    'Squadra',
    'Giocatore',
    'Tipo multa',
    'Importo (€)',
    'Data scadenza',
    'Pagata',
    'Data pagamento',
    'Creata il',
  ];

  const dataRows: any[] = [headerRow];

  allFines.forEach((fine) => {
    dataRows.push([
      fine.team_name || '',
      fine.player_name || '',
      fine.type || '',
      fine.amount,
      formatDate(fine.due_date),
      fine.is_paid ? 'Sì' : 'No',
      formatDateTime(fine.paid_at),
      formatDateTime(fine.created_at),
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
        ws[cellRef].s = col === 3 ? amountCellStyle : cellBorderStyle;
      }
    }
  }

  // Column widths
  ws['!cols'] = [
    { wch: 20 },
    { wch: 30 },
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
