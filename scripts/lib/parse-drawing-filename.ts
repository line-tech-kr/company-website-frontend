// Parsers for the manufacturer's CAD drawing filenames in ../Data/Catalog 2D, 3D/.
//
// Folder names:   M3030VA, MD30M, M3200VA(M2200VA)
// DWG filenames:  <MODEL>.DWG, <MODEL> Ass'y.DWG, <MODEL> ASS'Y..DWG, <MODEL>C Ass'y.DWG
// STEP filenames: <MODEL>(<FITTING>).STEP   where <FITTING> is e.g. 1^4SW, 3^8VCR, 1SW
//                 The '^' char encodes '/' (Windows-safe form for fractional sizes).

export type ParsedFolder = {
  /** Primary model code (drawing record's first models[] entry). */
  primaryModel: string;
  /** Additional model codes covered by this folder, e.g. M3200VA(M2200VA) → ['M2200VA']. */
  aliasModels: string[];
};

export type ParsedFitting = {
  /** Display label, e.g. '1/4" SW'. */
  label: string;
  /** Numeric size in inches, used for ascending sort. */
  sortKey: number;
  /** Original raw token from the filename, e.g. '1^4SW'. */
  raw: string;
};

const FITTING_RE = /^(\d+)(?:\^(\d+))?(SW|VCR)$/;
const STEP_NAME_RE = /^(.+?)\((.+?)\)\.(?:step|stp)$/i;
const DWG_NAME_RE = /^(.+?)(?:\s+ass'?y\.?)?\.dwg$/i;
const FOLDER_ALIAS_RE = /^([^()]+)\(([^()]+)\)$/;

export function parseFolderName(folder: string): ParsedFolder {
  const m = folder.match(FOLDER_ALIAS_RE);
  if (m) {
    return {
      primaryModel: m[1].trim(),
      aliasModels: m[2]
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
  }
  return { primaryModel: folder.trim(), aliasModels: [] };
}

export function parseFitting(raw: string): ParsedFitting | null {
  const m = raw.match(FITTING_RE);
  if (!m) return null;
  const numerator = Number(m[1]);
  const denominator = m[2] ? Number(m[2]) : 1;
  const kind = m[3];
  if (
    !Number.isFinite(numerator) ||
    !Number.isFinite(denominator) ||
    denominator === 0
  ) {
    return null;
  }
  const sortKey = numerator / denominator;
  const sizeLabel = m[2] ? `${numerator}/${denominator}` : `${numerator}`;
  return { label: `${sizeLabel}" ${kind}`, sortKey, raw };
}

export type ParsedStepFile = {
  basename: string;
  model: string;
  fitting: ParsedFitting;
};

/**
 * Parse a STEP filename into its model prefix + fitting.
 * Returns null if the filename doesn't match the (FITTING).STEP pattern.
 */
export function parseStepFilename(basename: string): ParsedStepFile | null {
  const m = basename.match(STEP_NAME_RE);
  if (!m) return null;
  const fitting = parseFitting(m[2]);
  if (!fitting) return null;
  return { basename, model: m[1].trim(), fitting };
}

export type ParsedDwgFile = {
  basename: string;
  model: string;
};

/**
 * Parse a DWG filename. Accepts:
 *   M3030VA.DWG, M3030VA Ass'y.DWG, M3200VA ASS'Y..DWG, EX1000C Ass'y.DWG
 */
export function parseDwgFilename(basename: string): ParsedDwgFile | null {
  const m = basename.match(DWG_NAME_RE);
  if (!m) return null;
  return { basename, model: m[1].trim() };
}

/** Backwards-compatible boolean form. */
export function isDwgFilename(basename: string): boolean {
  return DWG_NAME_RE.test(basename);
}
