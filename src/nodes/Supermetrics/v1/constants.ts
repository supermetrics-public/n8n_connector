/* Currently allowing only data sources that
    1. Have an account list
    2. Have date range selection
    3. Don't have a report type selection
    4. Don't have important data source specific settings
 */
export const ALLOWED_DATA_SOURCE_IDS = new Set(["AC", "ADA", "ADF", "ADM", "ADR", "ASA", "ASC", "AW", "BW", "CRI", "DBM", "DFA", "DFP", "DFS", "FA", "FAN", "FB", "GAWA", "GMB", "GW", "HS", "IGI", "KLAV", "LIA", "LIP", "MARK", "MC", "MFSC", "MGO", "OBA", "OPT", "PIA", "QA", "SCM", "SF", "SFMC", "SFP", "SFPS", "SHP", "STAC", "TA", "TEST", "TIK", "TTD", "VDSP", "WOO", "YAD", "YAM", "YG", "YT"]);
export const CACHE_DEFAULT_TTL_SECONDS = 3600;
export const DEBUG_MODE = true;
