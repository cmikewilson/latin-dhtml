/*
declQuiz - Quiz Latin Declensions

Written in 2005 by Mike Wilson, cmikewilson@gmail.com

To the extent possible under law, the author(s) have dedicated all
copyright and related and neighboring rights to this software to the
public domain worldwide. This software is distributed without any
warranty.

You should have received a copy of the CC0 Public Domain Dedication
along with this software. If not, see
<http://creativecommons.org/publicdomain/zero/1.0/>.
*/

// Words are from Hans Orberg's "Lingua Latina Per Se Illustrata",
// copyright 1991, 2003.

// EXPORT:
//   OrigWords, DeclensionEndingsPrep, M, F, N, MF, SP, SG, PL
//   wordNom, wordGenEnd, wordGender, wordBase, wordDecl, wordSP, wordCap

/*
- I need to find some official way of verifying the 3rd declension,
  genitive plurals.  I picked "um" or "ium" based on whether Orberg
  explicitly states which, or how commonly they appeared in Google searches.
  Often, both are used. Maybe they vary by period, or both are acceptable.
? Alphabetize words in OrigWords?
- Should probably convert the arrays to objects: {property: value, ...}
*/

function wordNom (w)     { return w[0]; }
function wordGenEnd (w)  { return w[1]; }
function wordGender (w)  { return w[2]; }
function wordDecl (w)    { return w[3]; }
function wordDeclOpt (w) { return w[4]; }
function wordBase (w)    { return w[5]; }
function wordSP (w)      { return w[6]; }
function wordCap (w)     { return w[7]; }

var M="m", F="f", N="n", MF="mf";
var SP="sp", SG="sg", PL="pl";

/*
  nom|genend|gender|decl type|decl opt|effective base|quantity|chapter
  DECL TYPEs are indices into the DeclensionEndings table.
  Words are declined by looking up endings in that table.
  Some words like "frons frontis" buck that trend with a stubborn nominative.
  The DECL OPT field circumvents the table by using the NOM field
  rather than deriving the nominative.  DECL OPT = 1 means use the NOM
  in the nominative, DECL OPT = 2 means use NOM for both nom and acc.
*/

var OrigWords = [
["_insula",    "-ae", F, "1a", 0,    "_insul", SP, 1],
["pr_ovincia", "-ae", F, "1a", 0, "pr_ovinci", SP, 1],
["littera",    "-ae", F, "1a", 0,    "litter", SP, 1],
["syllaba",    "-ae", F, "1a", 0,    "syllab", SP, 1],
["grammatica", "-ae", F, "1a", 0, "grammatic", SP, 1],
["fluvius",    "-_i", M, "2m", 0,     "fluvi", SP, 1],
["_oceanus",   "-_i", M, "2m", 0,    "_ocean", SP, 1],
["numerus",    "-_i", M, "2m", 0,     "numer", SP, 1],
["oppidum",    "-_i", N, "2n", 0,     "oppid", SP, 1],
["imperium",   "-_i", N, "2n", 0,    "imperi", SP, 1],
["voc_abulum", "-_i", N, "2n", 0,  "voc_abul", SP, 1],
["capitulum",  "-_i", N, "2n", 0,   "capitul", SP, 1],
["exemplum",   "-_i", N, "2n", 0,    "exempl", SP, 1],
["p_ensum",    "-_i", N, "2n", 0,     "p_ens", SP, 1],

["f_emina",     "-ae",    F, "1a", 0,    "f_emin", SP, 2],
["puella",      "-ae",    F, "1a", 0,     "puell", SP, 2],
["familia",     "-ae",    F, "1a", 0,    "famili", SP, 2],
["f_ilia",      "-ae",    F, "1b", 0,     "f_ili", SP, 2],
["ancilla",     "-ae",    F, "1a", 0,    "ancill", SP, 2],
["domina",      "-ae",    F, "1a", 0,     "domin", SP, 2],
["p_agina",     "-ae",    F, "1a", 0,    "p_agin", SP, 2],
["vir",         "-_i",    M, "2m", 1,       "vir", SP, 2],
["puer",        "-_i",    M, "2m", 1,      "puer", SP, 2],
["f_ilius",     "-_i",    M, "2m", 0,     "f_ili", SP, 2],
["l_iber_i",    "-_orum", M, "2m", 0,    "l_iber", PL, 2],
["servus",      "-_i",    M, "2m", 0,      "serv", SP, 2],
["dominus",     "-_i",    M, "2m", 0,     "domin", SP, 2],
["liber",       "-br_i",  M, "2m", 1,      "libr", SP, 2],
["titulus",     "-_i",    M, "2m", 0,     "titul", SP, 2],
["mascul_inum", "-_i",    N, "2n", 0, "mascul_in", SP, 2],
["f_emin_inum", "-_i",    N, "2n", 0, "f_emin_in", SP, 2],
["neutrum",     "-_i",    N, "2n", 0,     "neutr", SP, 2],
["pater",       "-tris",  M, "3b", 1,      "patr", SP, 2],
["m_ater",      "-tris",  F, "3b", 1,      "matr", SP, 2],

["scaena",         "-ae", F, "1a", 0, "scaen",        SP, 3],
["pers_ona",       "-ae", F, "1a", 0, "pers_on",      SP, 3],
["mamma",          "-ae", F, "1a", 0, "mamm",         SP, 3],
["n_omin_at_ivus", "-_i", M, "2m", 0, "n_omin_at_iv", SP, 3],
["acc_us_at_ivus", "-_i", N, "2n", 0, "acc_us_at_iv", SP, 3],
["verbum",         "-_i", N, "2n", 0, "verb",         SP, 3],

["sacculus",       "-_i", M, "2m", 0, "saccul",       SP, 4],
["pec_unia",       "-ae", F, "1a", 0, "pec_uni",      SP, 4],
["nummus",         "-_i", M, "2m", 0, "numm",         SP, 4],
["m_ensa",         "-ae", F, "1a", 0, "m_ens",        SP, 4],
["baculum",        "-_i", N, "2n", 0, "bacul",        SP, 4],
["voc_at_ivus",    "-_i", M, "2m", 0, "voc_at_iv",    SP, 4],
["imper_at_ivus",  "-_i", M, "2m", 0, "imper_at_iv",  SP, 4],
["ind_ic_at_ivus", "-_i", M, "2m", 0, "ind_ic_at_iv", SP, 4],

["v_illa",      "-ae", F, "1a", 0, "v_ill",     SP, 5],
["hortus",      "-_i", M, "2m", 0, "hort",      SP, 5],
["rosa",        "-ae", F, "1a", 0, "ros",       SP, 5],
["l_ilium",     "-_i", N, "2n", 0, "l_ili",     SP, 5],
["n_asus",      "-_i", M, "2m", 0, "n_as",      SP, 5],
["_ostium",     "-_i", N, "2n", 0, "_osti",     SP, 5],
["fenestra",    "-ae", F, "1a", 0, "fenestr",   SP, 5],
["_atrium",     "-_i", N, "2n", 0, "_atri",     SP, 5],
["impluvium",   "-_i", N, "2n", 0, "impluvi",   SP, 5],
["aqua",        "-ae", F, "1a", 0, "aqu",       SP, 5],
["perist_ylum", "-_i", N, "2n", 0, "perist_yl", SP, 5],
["cubiculum",   "-_i", N, "2n", 0, "cubicul",   SP, 5],
["abl_at_ivus", "-_i", M, "2m", 0, "abl_at_iv", SP, 5],

["via",         "-ae", F, "1a", 0, "vi",        SP, 6],
["m_urus",      "-_i", M, "2m", 0, "m_ur",      SP, 6],
["porta",       "-ae", F, "1a", 0, "port",      SP, 6],
["lect_ica",    "-ae", F, "1a", 0, "lect_ic",   SP, 6],
["saccus",      "-_i", M, "2m", 0, "sacc",      SP, 6],
["umerus",      "-_i", M, "2m", 0, "umer",      SP, 6],
["am_icus",     "-_i", M, "2m", 0, "am_ic",     SP, 6],
["inim_icus",   "-_i", M, "2m", 0, "inim_ic",   SP, 6],
["equus",       "-_i", M, "2m", 0, "equ",       SP, 6],
["am_ica",      "-ae", F, "1a", 0, "am_ic",     SP, 6],
["loc_at_ivus", "-_i", M, "2m", 0, "loc_at_iv", SP, 6],

["oculus",     "-_i", M, "2m", 0, "ocul",     SP, 7],
["lacrima",    "-ae", F, "1a", 0, "lacrim",   SP, 7],
["speculum",   "-_i", N, "2n", 0, "specul",   SP, 7],
["_osti_arus", "-_i", M, "2m", 0, "_osti_ar", SP, 7],
["m_alum",     "-_i", N, "2n", 0, "m_al",     SP, 7],
["pirum",      "-_i", N, "2n", 0, "pir",      SP, 7],
["_osculum",   "-_i", N, "2n", 0, "_oscul",   SP, 7],
["dat_ivus",   "-_i", M, "2m", 0, "dat_iv",   SP, 7],

["taberna",      "-ae",   F, "1a", 0, "tabern",     SP, 8],
["gemma",        "-ae",   F, "1a", 0, "gemm",       SP, 8],
["margar_ita",   "-ae",   F, "1a", 0, "margar_it",  SP, 8],
["tabern_arius", "-_i",   M, "2m", 0, "tabern_ari", SP, 8],
["_orn_amentum", "-_i",   N, "2n", 0, "_orn_ament", SP, 8],
["_anulus",      "-_i",   M, "2m", 0, "_anul",      SP, 8],
["l_inea",       "-ae",   F, "1a", 0, "l_ine",      SP, 8],
["digitus",      "-_i",   M, "2m", 0, "digit",      SP, 8],
["collum",       "-_i",   N, "2n", 0, "coll",       SP, 8],
["pretium",      "-_i",   N, "2n", 0, "preti",      SP, 8],
["s_estertius",  "-_i",   M, "2m", 0, "s_esterti",  SP, 8],
["pr_on_omen",   "-inis", N, "3c", 2, "pr_on_omin", SP, 8],

["campus",     "-_i",     M,   "2m", 0, "camp",     SP, 9],
["p_astor",    "-_oris",  M,   "3b", 1, "p_ast_or", SP, 9],
["canis",      "-is",     MF,  "3b", 0, "can",      SP, 9],
["ovis",       "-is",     F,   "3a", 0, "ov",       SP, 9],
["cibus",      "-_i",     M,   "2m", 0, "cib",      SP, 9],
["herba",      "-ae",     F,   "1a", 0, "herb",     SP, 9],
["r_ivus",     "-_i",     M,   "2m", 0, "r_iv",     SP, 9],
["p_anis",     "-is",     F,   "3a", 0, "p_an",     SP, 9],
["m_ons",      "montis",  M,   "3a", 1, "mont",     SP, 9],
["vallis",     "-is",     F,   "3a", 0, "vall",     SP, 9],
["collis",     "-is",     M,   "3a", 0, "coll",     SP, 9],
["arbor",      "-oris",   F,   "3b", 1, "arb_or",   SP, 9],
["silva",      "-ae",     F,   "1a", 0, "silv",     SP, 9],
["lupus",      "-_i",     M,   "2m", 0, "lup",      SP, 9],
["s_ol",       "-is",     M,   "3b", 1, "s_ol",     SP, 9],
["caelum",     "-_i",     N,   "2n", 0, "cael",     SP, 9],
["terra",      "-ae",     F,   "1a", 0, "terr",     SP, 9],
["n_ub_es",    "-is",     F,   "3a", 1, "n_ub",     SP, 9],
["umbra",      "-ae",     F,   "1a", 0, "umbr",     SP, 9],
["vest_igium", "-_i",     N,   "2n", 0, "vest_igi", SP, 9],
["timor",      "-_oris",  M,   "3b", 1, "tim_or",   SP, 9],
["d_ens",      "dentis",  M,   "3a", 1, "dent",     SP, 9],
["cl_amor",    "-_oris",  M,   "3b", 1, "cl_am_or", SP, 9],
["modus",      "-_i",     M,   "2m", 0, "mod",      SP, 9],
["d_eclin_ati_o", "-_onis", F, "3b", 1, "d_eclin_ati_on", SP, 9],

["asinus",    "-_i",     M, "2m", 0, "asin",    SP, 10],
["le_o",      "-_onis",  M, "3b", 1, "le_on",   SP, 10],
["b_estia",   "-ae",     F, "1a", 0, "b_esti",  SP, 10],
["hom_o",     "-inis",   M, "3b", 1, "homin",   SP, 10],
["fera",      "-ae",     F, "1a", 0, "fer",     SP, 10],
["avis",      "-is",     F, "3a", 0, "av",      SP, 10],
["piscis",    "-is",     M, "3a", 0, "pisc",    SP, 10],
["aquila",    "-ae",     F, "1a", 0, "aquil",   SP, 10],
["_ala",      "-ae",     F, "1a", 0, "_al",     SP, 10],
["p_es",      "pedis",   M, "3b", 1, "ped",     SP, 10],
["cauda",     "-ae",     F, "1a", 0, "caud",    SP, 10],
["petasus",   "-_i",     M, "2m", 0, "petas",   SP, 10],
["merc_ator", "-_oris",  M, "3b", 1, "merc_at_or", SP, 10],
["n_untius",  "-_i",     M, "2m", 0, "n_unti",  SP, 10],
["anima",     "-ae",     F, "1a", 0, "anim",    SP, 10],
["pulm_o",    "-_onis",  M, "3b", 1, "pulm_on", SP, 10],
["n_idus",    "-_i",     M, "2m", 0, "n_id",    SP, 10],
["r_amus",    "-_i",     M, "2m", 0, "r_am",    SP, 10],
["folium",    "-_i",     N, "2n", 0, "foli",    SP, 10],
["_ovum",     "-_i",     N, "2n", 0, "_ov",     SP, 10],
["pullus",    "-_i",     M, "2m", 0, "pull",    SP, 10],
["pila",      "-ae",     F, "1a", 0, "pil",     SP, 10],
["v_ox",      "v_ocis",  F, "3b", 1, "v_oc",    SP, 10],
["lectus",    "-_i",     M, "2m", 0, "lect",    SP, 10],
["mare",      "-is",     N, "3d", 0, "mar",     SP, 10],
["fl_umen",   "-inis",   N, "3c", 2, "fl_umin", SP, 10],
["animal",    "-_alis",  N, "3d", 2, "anim_al", SP, 10],
["_inf_in_it_ivus", "-_i", M, "2m", 0, "_inf_in_it_iv", SP, 10],
/* WEIRD
["_a_er",     "-eris",   M, "3*", 0, "_a",     SP, 10],
["deus",      "-_i",     M, "2*", 0, "",       SP, 10],
*/

["corpus",    "-oris", N, "3c", 2, "corpor",  SP, 11],
["membrum",     "-_i", N, "2n", 0, "membr",   SP, 11],
["bracchium",   "-_i", N, "2n", 0, "bracchi", SP, 11],
["cr_us",    "-_uris", N, "3c", 2, "cr_ur",   SP, 11],
["manus",      "-_us", F, "4a", 0, "man",     SP, 11],
["caput",   "capitis", N, "3c", 2, "capit",   SP, 11],
["auris",       "-is", F, "3a", 0, "aur",     SP, 11],
["_os",      "-_oris", N, "3c", 2, "_or",     SP, 11],
["capillus",    "-_i", M, "2m", 0, "capill",  SP, 11],
["fr_ons",  "frontis", F, "3a", 1, "front",   SP, 11],
["gena",        "-ae", F, "1a", 0, "gen",     SP, 11],
["cerebrum",    "-_i", N, "2n", 0, "cerebr",  SP, 11],
["labrum",      "-_i", N, "2n", 0, "labr",    SP, 11],
["lingua",      "-ae", F, "1a", 0, "lingu",   SP, 11],
["pectus",    "-oris", N, "3c", 2, "pector",  SP, 11],
["cor",      "cordis", N, "3c", 2, "cord",    SP, 11],
["sanguis",   "-inis", M, "3b", 1, "sanguin", SP, 11],
["v_ena",       "-ae", F, "1a", 0, "ven",     SP, 11],
["color",    "-_oris", M, "3b", 1, "col_or",  SP, 11],
["iecur",     "-oris", N, "3c", 2, "iecor",   SP, 11],
["venter",    "-tris", M, "3a", 1, "ventr",   SP, 11],
["viscera",     "-um", N, "3c", 0, "viscer",  PL, 11],
["medicus",     "-_i", M, "2m", 0, "medic",   SP, 11],
["p_oculum",    "-_i", N, "2n", 0, "p_ocul",  SP, 11],
["culter",    "-tr_i", M, "2m", 1, "cultr",   SP, 11],

["fr_ater",    "-tris", M, "3b", 1, "fr_atr",     SP, 12],
["soror",     "-_oris", F, "3b", 1, "sor_or",     SP, 12],
["n_omen",     "-inis", N, "3c", 2, "n_omin",     SP, 12],
["praen_omen", "-inis", N, "3c", 2, "praen_omin", SP, 12],
["cogn_omen",  "-inis", N, "3c", 2, "cogn_omin",  SP, 12],
["avunculus",    "-_i", M, "2m", 0, "avuncul",    SP, 12],
["m_iles",     "-itis", M, "3b", 1, "m_ilit",     SP, 12],
["gladius",      "-_i", M, "2m", 0, "gladi",      SP, 12],
["p_ilum",       "-_i", N, "2n", 0, "p_il",       SP, 12],
["sc_utum",      "-_i", N, "2n", 0, "sc_ut",      SP, 12],
["hasta",        "-ae", F, "1a", 0, "hast",       SP, 12],
["pugnus",       "-_i", M, "2m", 0, "pugn",       SP, 12],
["arma",      "-_orum", N, "2n", 0, "arm",        PL, 12],
["pedes",      "-itis", M, "3b", 1, "pedit",      SP, 12],
["eques",      "-itis", M, "3b", 1, "equit",      SP, 12],
["pars",      "partis", F, "3a", 1, "part",       SP, 12],
["patria",       "-ae", F, "1a", 0, "patri",      SP, 12],
["hostis",       "-is", M, "3a", 0, "host",       SP, 12],
["bellum",       "-_i", N, "2n", 0, "bell",       SP, 12],
["exercitus",   "-_us", M, "4a", 0, "exercit",    SP, 12],
["dux",        "ducis", M, "3b", 1, "duc",        SP, 12],
["sagitta",      "-ae", F, "1a", 0, "sagitt",     SP, 12],
["arcus",       "-_us", M, "4a", 0, "arc",        SP, 12],
["Hisp_an_i", "-_orum", M, "2m", 0, "Hisp_an",    PL, 12],
["Gall_i",    "-_orum", M, "2m", 0, "Gall",       PL, 12],
["castra",    "-_orum", N, "2n", 0, "castr",      PL, 12],
["passus",      "-_us", M, "4a", 0, "pass",       SP, 12],
["fossa",        "-ae", F, "1a", 0, "foss",       SP, 12],
["v_allum",      "-_i", N, "2n", 0, "v_all",      SP, 12],
["equit_atus",  "-_us", M, "4a", 0, "equit_at",   SP, 12],
["impetus",     "-_us", M, "4a", 0, "impet",      SP, 12],
["metus",       "-_us", M, "4a", 0, "met",        SP, 12],
["versus",      "-_us", M, "4a", 0, "vers",       SP, 12],
["f_inis",       "-is", M, "3a", 0, "f_in",       SP, 12],
["adiect_ivum",  "-_i", N, "2n", 0, "adiect_iv",  SP, 12],
["compar_at_ivus", "-_i", M, "2m", 0, "compar_at_iv", SP, 12],

["annus",        "-_i", M, "2m", 0, "ann",        SP, 13],
["m_ensis",      "-is", M, "3a", 0, "m_ens",      SP, 13],
["I_anu_arius",  "-_i", M, "2m", 0, "I_anu_ari",  SP, 13],
["Febru_arius",  "-_i", M, "2m", 0, "Febru_ari",  SP, 13],
["M_artius",     "-_i", M, "2m", 0, "M_arti",     SP, 13],
["Apr_ilis",     "-is", M, "3a", 0, "Apr_il",     SP, 13],
["M_aius",       "-_i", M, "2m", 0, "M_ai",       SP, 13],
["I_unius",      "-_i", M, "2m", 0, "I_uni",	  SP, 13],
["I_ulius",      "-_i", M, "2m", 0, "I_uli",	  SP, 13],
["Augustus",     "-_i", M, "2m", 0, "August",	  SP, 13],
["September",  "-bris", M, "3a", 1, "Septembr",   SP, 13],
["Oct_ober",   "-bris", M, "3a", 1, "Oct_obr",    SP, 13],
["November",   "-bris", M, "3a", 1, "Novembr",    SP, 13],
["December",   "-bris", M, "3a", 1, "Decembr",    SP, 13],
["di_es",      "-_e_i", M, "5a", 0, "di",	  SP, 13],
["saeculum",     "-_i", N, "2n", 0, "saecul",	  SP, 13],
["tempus",     "-oris", N, "3c", 2, "tempor",	  SP, 13],
["I_anus",       "-_i", M, "2m", 0, "I_an",	  SP, 13],
["M_ars",      "-rtis", M, "3a", 1, "M_art",	  SP, 13],
["faci_es",    "-_e_i", F, "5a", 0, "faci",	  SP, 13],
["m_ane",     "indecl", N, "0a", 0, "m_ane",	  SP, 13],
["vesper",     "-er_i", M, "2m", 1, "vesper",	  SP, 13],
["nox",       "noctis", F, "3a", 1, "noct",	  SP, 13],
["initium",      "-_i", N, "2n", 0, "initi",	  SP, 13],
["h_ora",        "-ae", F, "1a", 0, "h_or",	  SP, 13],
["mer_idi_es", "-_e_i", M, "5a", 0, "mer_idi",    SP, 13],
["kalend_arium", "-_i", N, "2n", 0, "kalend_ari", SP, 13],
["l_una",        "-ae", F, "1a", 0, "l_un",       SP, 13],
["st_ella",      "-ae", F, "1a", 0, "st_ell",	  SP, 13],
["l_ux",       "lucis", F, "3b", 1, "luc", 	  SP, 13],
["f_orma",       "-ae", F, "1a", 0, "f_orm",      SP, 13],
["kalendae",  "-_arum", F, "1a", 0, "kalend",     PL, 13],
["_id_us",      "-uum", F, "4a", 0, "_id",        PL, 13],
["n_onae",    "-_arum", F, "1a", 0, "n_on",       PL, 13],
["aequinoctium", "-_i", N, "2n", 0, "aequinocti", SP, 13],
["aest_as",   "-_atis", F, "3b", 1, "aestat",	  SP, 13],
["hiems",     "hiemis", F, "3b", 1, "hiem",	  SP, 13],
["v_er",      "v_eris", N, "3c", 2, "v_er",	  SP, 13],
["autumnus",     "-_i", M, "2m", 0, "autumn",	  SP, 13],
["imber",      "-bris", M, "3a", 1, "imbr",	  SP, 13],
["nix",        "nivis", F, "3a", 1, "niv",	  SP, 13],
["lacus",       "-_us", M, "4a", 0, "lac",	  SP, 13],
["glaci_es",   "-_e_i", F, "5a", 0, "glaci",	  SP, 13],
["urbs",       "urbis", F, "3a", 1, "urb",        SP, 13],

["gallus",       "-_i", M, "2m", 0, "gall",       SP, 14],
["vest_imentum", "-_i", N, "2n", 0, "vest_iment", SP, 14],
["tunica",       "-ae", F, "1a", 0, "tunic",	  SP, 14],
["toga",	 "-ae", F, "1a", 0, "tog", 	  SP, 14],
["calceus",	 "-_i", M, "2m", 0, "calce",      SP, 14],
["parent_es",	 "-um", M, "3b", 0, "parent",     PL, 14],
["tabula",	 "-ae", F, "1a", 0, "tabul",      SP, 14],
["stilus",	 "-_i", M, "2m", 0, "stil",	  SP, 14],
["r_egula",	 "-ae", F, "1a", 0, "r_egul",	  SP, 14],
["r_es",        "re_i", F, "5b", 0, "r",	  SP, 14],
["participium",  "-_i", N, "2n", 0, "participi",  SP, 14],

["magister", "-tr_i", M, "2m", 1, "magistr",  SP, 15],
["discipulus", "-_i", M, "2m", 0, "discipul", SP, 15],
["l_udus",     "-_i", M, "2m", 0, "l_ud",     SP, 15],
["virga",      "-ae", F, "1a", 0, "virg",     SP, 15],
["sella",      "-ae", F, "1a", 0, "sell",     SP, 15],
["i_anua",     "-ae", F, "1a", 0, "i_anu",    SP, 15],
["tergum",     "-_i", N, "2n", 0, "terg",     SP, 15],
["lectulus",   "-_i", M, "2m", 0, "lectul",   SP, 15],
["malum",      "-_i", N, "2n", 0, "mal",      SP, 15],

["tempest_as",   "-_atis", F, "3b", 1, "tempest_at",   SP, 16],
["n_avis",          "-is", F, "3a", 0, "n_av",         SP, 16],
["portus",         "-_us", M, "4a", 0, "port",         SP, 16],
["locus",           "-_i", M, "2m", 0, "loc",          SP, 16],
["_ora",            "-ae", F, "1a", 0, "_or",          SP, 16],
["merx",         "mercis", F, "3a", 1, "merc",         SP, 16],
["nauta",           "-ae", M, "1a", 0, "naut",         SP, 16],
["ventus",	    "-_i", M, "2m", 0, "vent",         SP, 16],
["fl_uctus",	   "-_us", M, "4a", 0, "fl_uct",       SP, 16],
["v_elum",	    "-_i", N, "2n", 0, "v_el",         SP, 16],
["puppis",	    "-is", F, "3e", 0, "pupp",         SP, 16],
["gubern_ator",  "-_oris", M, "3b", 1, "gubern_at_or", SP, 16],
["ori_ens",	 "-entis", M, "3b", 1, "orient",       SP, 16],
["occid_ens",	 "-entis", M, "3a", 1, "occident",     SP, 16],
["septentri_on_es", "-um", M, "3b", 1, "septentri_on", PL, 16],
["dextra",          "-ae", F, "1a", 0, "dextr",        SP, 16],
["sinistra",	    "-ae", F, "1a", 0, "sinistr",      SP, 16],
["fulgur",	  "-uris", N, "3c", 2, "fulgur",       SP, 16],
["tonitrus",	   "-_us", M, "4a", 0, "tonitr",       SP, 16],

["resp_onsum", "-_i",   N, "2n", 0, "resp_ons", SP, 17],
["as",         "assis", M, "3a", 1, "ass",      SP, 17],
["d_en_arius", "-_i",   M, "2m", 0, "d_en_ari", SP, 17]
];

var DeclensionEndingsPrep = [
["0a", ["", "", "", "", ""],    // indeclinable: mane
       ["", "", "", "", ""]],
["1a", [  "a",  "am",    "ae",   "ae",   "_a"],    // puella -ae
       [ "ae", "_as", "_arum",  "_is",  "_is"]],
["1b", [  "a",  "am",    "ae",   "ae",   "_a"],    // filia -ae
       [ "ae", "_as", "_arum",  ["_is", "_abus"],  ["_is", "_abus"]]],
["2m", [ "us",  "um",    "_i",   "_o",   "_o"],    // dominus -_i
       [ "_i", "_os", "_orum",  "_is",  "_is"]],
["2n", [ "um",  "um",    "_i",   "_o",   "_o"],    // oppidum -_i
       [  "a",   "a", "_orum",  "_is",  "_is"]],
["3a", [ "is",  "em",    "is",   "_i",    "e"],    // ovis -is
       ["_es", "_es",   "ium", "ibus", "ibus"]],
["3b", [ "is",  "em",    "is",   "_i",    "e"],    // canis -is
       ["_es", "_es",    "um", "ibus", "ibus"]],
["3c", [   "",    "",    "is",   "_i",    "e"],    // fl_umen -inis
       [  "a",   "a",    "um", "ibus", "ibus"]],
["3d", [  "e",   "e",    "is",   "_i",   "_i"],    // mare -is
       [ "ia",  "ia",   "ium", "ibus", "ibus"]],
["3e", [ "is",  "im",    "is",   "_i",   "_i"],    // puppis -is
       ["_es", "_es",   "ium", "ibus", "ibus"]],
["4a", [ "us",  "um",   "_us",  "u_i",   "_u"],    // manus -_us
       ["_us", "_us",   "uum", "ibus", "ibus"]],
["5a", ["_es",  "em",  "_e_i",  "_e_i",    "_e"],  // di_es -_e_i
       ["_es", "_es", "_erum", "_ebus", "_ebus"]],
["5b", ["_es",  "em",   "e_i",   "e_i",    "_e"],  // r_es re_i
       ["_es", "_es", "_erum", "_ebus", "_ebus"]]
];

// homo hominum
