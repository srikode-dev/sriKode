// Comprehensive ISO 3166-1 Alpha-2, Numeric, and Name mapping for Global Analytics
export const COUNTRIES = {
  US: { name: "United States", numeric: "840", geoName: "United States of America", flag: "🇺🇸", continent: "North America" },
  IN: { name: "India", numeric: "356", geoName: "India", flag: "🇮🇳", continent: "Asia" },
  GB: { name: "United Kingdom", numeric: "826", geoName: "United Kingdom", flag: "🇬🇧", continent: "Europe" },
  DE: { name: "Germany", numeric: "276", geoName: "Germany", flag: "🇩🇪", continent: "Europe" },
  CA: { name: "Canada", numeric: "124", geoName: "Canada", flag: "🇨🇦", continent: "North America" },
  AU: { name: "Australia", numeric: "036", altNumeric: "36", geoName: "Australia", flag: "🇦🇺", continent: "Oceania" },
  FR: { name: "France", numeric: "250", geoName: "France", flag: "🇫🇷", continent: "Europe" },
  JP: { name: "Japan", numeric: "392", geoName: "Japan", flag: "🇯🇵", continent: "Asia" },
  BR: { name: "Brazil", numeric: "076", altNumeric: "76", geoName: "Brazil", flag: "🇧🇷", continent: "South America" },
  SG: { name: "Singapore", numeric: "702", geoName: "Singapore", flag: "🇸🇬", continent: "Asia" },
  NL: { name: "Netherlands", numeric: "528", geoName: "Netherlands", flag: "🇳🇱", continent: "Europe" },
  ES: { name: "Spain", numeric: "724", geoName: "Spain", flag: "🇪🇸", continent: "Europe" },
  IT: { name: "Italy", numeric: "380", geoName: "Italy", flag: "🇮🇹", continent: "Europe" },
  SE: { name: "Sweden", numeric: "752", geoName: "Sweden", flag: "🇸🇪", continent: "Europe" },
  CH: { name: "Switzerland", numeric: "756", geoName: "Switzerland", flag: "🇨🇭", continent: "Europe" },
  PL: { name: "Poland", numeric: "616", geoName: "Poland", flag: "🇵🇱", continent: "Europe" },
  RU: { name: "Russia", numeric: "643", geoName: "Russia", flag: "🇷🇺", continent: "Europe" },
  KR: { name: "South Korea", numeric: "410", geoName: "South Korea", flag: "🇰🇷", continent: "Asia" },
  CN: { name: "China", numeric: "156", geoName: "China", flag: "🇨🇳", continent: "Asia" },
  ID: { name: "Indonesia", numeric: "360", geoName: "Indonesia", flag: "🇮🇩", continent: "Asia" },
  VN: { name: "Vietnam", numeric: "704", geoName: "Vietnam", flag: "🇻🇳", continent: "Asia" },
  PH: { name: "Philippines", numeric: "608", geoName: "Philippines", flag: "🇵🇭", continent: "Asia" },
  PK: { name: "Pakistan", numeric: "586", geoName: "Pakistan", flag: "🇵🇰", continent: "Asia" },
  BD: { name: "Bangladesh", numeric: "050", altNumeric: "50", geoName: "Bangladesh", flag: "🇧🇩", continent: "Asia" },
  MX: { name: "Mexico", numeric: "484", geoName: "Mexico", flag: "🇲🇽", continent: "North America" },
  AR: { name: "Argentina", numeric: "032", altNumeric: "32", geoName: "Argentina", flag: "🇦🇷", continent: "South America" },
  CO: { name: "Colombia", numeric: "170", geoName: "Colombia", flag: "🇨🇴", continent: "South America" },
  ZA: { name: "South Africa", numeric: "710", geoName: "South Africa", flag: "🇿🇦", continent: "Africa" },
  NG: { name: "Nigeria", numeric: "566", geoName: "Nigeria", flag: "🇳🇬", continent: "Africa" },
  EG: { name: "Egypt", numeric: "818", geoName: "Egypt", flag: "🇪🇬", continent: "Africa" },
  KE: { name: "Kenya", numeric: "404", geoName: "Kenya", flag: "🇰🇪", continent: "Africa" },
  AE: { name: "United Arab Emirates", numeric: "784", geoName: "United Arab Emirates", flag: "🇦🇪", continent: "Middle East" },
  SA: { name: "Saudi Arabia", numeric: "682", geoName: "Saudi Arabia", flag: "🇸🇦", continent: "Middle East" },
  IL: { name: "Israel", numeric: "376", geoName: "Israel", flag: "🇮🇱", continent: "Middle East" },
  TR: { name: "Turkey", numeric: "792", geoName: "Turkey", flag: "🇹🇷", continent: "Europe" },
  NZ: { name: "New Zealand", numeric: "554", geoName: "New Zealand", flag: "🇳🇿", continent: "Oceania" },
  IE: { name: "Ireland", numeric: "372", geoName: "Ireland", flag: "🇮🇪", continent: "Europe" },
  BE: { name: "Belgium", numeric: "056", altNumeric: "56", geoName: "Belgium", flag: "🇧🇪", continent: "Europe" },
  AT: { name: "Austria", numeric: "040", altNumeric: "40", geoName: "Austria", flag: "🇦🇹", continent: "Europe" },
  NO: { name: "Norway", numeric: "578", geoName: "Norway", flag: "🇳🇴", continent: "Europe" },
  DK: { name: "Denmark", numeric: "208", geoName: "Denmark", flag: "🇩🇰", continent: "Europe" },
  FI: { name: "Finland", numeric: "246", geoName: "Finland", flag: "🇫🇮", continent: "Europe" },
  PT: { name: "Portugal", numeric: "620", geoName: "Portugal", flag: "🇵🇹", continent: "Europe" },
  CZ: { name: "Czech Republic", numeric: "203", geoName: "Czechia", flag: "🇨🇿", continent: "Europe" },
  RO: { name: "Romania", numeric: "642", geoName: "Romania", flag: "🇷🇴", continent: "Europe" },
  UA: { name: "Ukraine", numeric: "804", geoName: "Ukraine", flag: "🇺🇦", continent: "Europe" },
  TH: { name: "Thailand", numeric: "764", geoName: "Thailand", flag: "🇹🇭", continent: "Asia" },
  MY: { name: "Malaysia", numeric: "458", geoName: "Malaysia", flag: "🇲🇾", continent: "Asia" },
  TW: { name: "Taiwan", numeric: "158", geoName: "Taiwan", flag: "🇹🇼", continent: "Asia" },
};

// Build inverted lookups for fast geo map matching
const NUMERIC_TO_CODE = {};
const NAME_TO_CODE = {};

Object.entries(COUNTRIES).forEach(([code, data]) => {
  NUMERIC_TO_CODE[data.numeric] = code;
  if (data.altNumeric) {
    NUMERIC_TO_CODE[data.altNumeric] = code;
  }
  // Remove leading zeros for flexible matching
  const unpadded = String(parseInt(data.numeric, 10));
  NUMERIC_TO_CODE[unpadded] = code;

  NAME_TO_CODE[data.name.toLowerCase()] = code;
  NAME_TO_CODE[data.geoName.toLowerCase()] = code;
  NAME_TO_CODE[code.toLowerCase()] = code;
});

/**
 * Returns country info given an ISO code, full name, or numeric ID
 */
export function getCountryInfo(identifier) {
  if (!identifier) return { name: "Unknown", flag: "🌐", continent: "Other", code: "Unknown" };

  const clean = String(identifier).trim();
  const upper = clean.toUpperCase();

  if (COUNTRIES[upper]) {
    return { ...COUNTRIES[upper], code: upper };
  }

  // Check numeric
  if (NUMERIC_TO_CODE[clean]) {
    const code = NUMERIC_TO_CODE[clean];
    return { ...COUNTRIES[code], code };
  }

  // Check by name
  const lower = clean.toLowerCase();
  if (NAME_TO_CODE[lower]) {
    const code = NAME_TO_CODE[lower];
    return { ...COUNTRIES[code], code };
  }

  // Fallback
  return {
    name: clean === "Unknown" ? "Global / Direct" : clean,
    numeric: null,
    geoName: clean,
    flag: "🌐",
    continent: "Other",
    code: upper
  };
}

/**
 * Matches a react-simple-maps geometry to a country view record
 */
export function findCountryDataByGeo(geo, countryDataMap) {
  if (!geo || !countryDataMap) return null;

  // Try geo.id (e.g., '840' or '356')
  const codeFromId = NUMERIC_TO_CODE[geo.id] || NUMERIC_TO_CODE[String(parseInt(geo.id, 10))];
  if (codeFromId && countryDataMap[codeFromId]) {
    return countryDataMap[codeFromId];
  }

  // Try geo.properties.name
  const name = geo.properties?.name;
  if (name) {
    const codeFromName = NAME_TO_CODE[name.toLowerCase()];
    if (codeFromName && countryDataMap[codeFromName]) {
      return countryDataMap[codeFromName];
    }
  }

  return null;
}
