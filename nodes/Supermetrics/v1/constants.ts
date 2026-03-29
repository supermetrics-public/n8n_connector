import { version } from '../../../package.json';

export const USER_AGENT = 'sm-n8n-node/'+version;

/* Currently allowing only data sources that
    1. Have an account list
    2. Have date range selection
    3. Don't have a report type selection
    4. Don't have important data source specific settings
 */
export const ALLOWED_DATA_SOURCE_IDS = new Set(["AC", "ADA", "ADF", "ADM", "ADR", "ASA", "ASC", "AW", "BW", "CELTR", "CLKFY", "CM", "CRI", "DBM", "DFA", "DFP", "DFS", "FA", "FAN", "FB", "FBBM", "GAAE", "GAWA", "GMB",
    "GONG", "GSCC2", "GW", "HS", "IAS", "IGI", "KLAV", "LAZAD", "LIA", "LINEA", "LIP", "MARK", "MC", "MELT", "MFSC", "MGO", "MIX", "MOLOC", "OBA", "OPT", "PIA", "PIWIK",
    "PLAUS", "QA", "RDA", "SCM", "SF", "SFMC", "SFP", "SFPS", "SHP", "SPA", "STAC", "TA", "TIK", "TTD", "VDSP", "WOO", "XING", "YAD", "YAM", "YDA", "YG", "YT", "ZEMA"]);
export const CACHE_DEFAULT_TTL_SECONDS = 3600;
export const DEBUG_MODE = false;
