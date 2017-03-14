/*
conjQuiz - Quiz Latin Conjugations

Written in 2005 by Mike Wilson, cmikewilson@gmail.com

To the extent possible under law, the author(s) have dedicated all
copyright and related and neighboring rights to this software to the
public domain worldwide. This software is distributed without any
warranty.

You should have received a copy of the CC0 Public Domain Dedication
along with this software. If not, see
<http://creativecommons.org/publicdomain/zero/1.0/>.
*/

/*
Word selection from Hans Orberg's "Lingua Latina Per Se Illustrata",
copyright 1991, 2003.
Wheelock too, with Wheelock's verb layout.
*/

/*
+ fill out Cesse
+ handle "ausus sum"
+ add passive infinitive
+ strangeness: "inquit", "licet", "oportet"
  C1: _ar_i; C2: _er_i; C3: _i; C4: _ir_i;
+ Instead of choosing separately for tense, manner, voice;
  select one of PresIndAct, ImpIndAct, FutIndAct, ...
+ Add Tense All/None button
+ add Participle: LL 14; more like adjectives
+ Deponent Verbs: LL 16
+ use enums
*/

var FIRST=0, SECOND=1, THIRD=2;
var SG=0, PL=1;
var PRESENT=0, FUTURE=1, IMPERFECT=2, PERFECT=3, FUTUREPERFECT=4, PLUPERFECT=5;
var INDICATIVE=0, IMPERATIVE=1 /* SUBJUNCTIVE=2? */;
var ACTIVE=0, PASSIVE=1;
var PRESENTSTEM=0, PERFECTSTEM=1;
var C1="C1", C2="C2", C3A="C3A", C3B="C3B", C4="C4",
    Cesse="Cesse", Cposse="Cposse", Cire="Cire", Cdare="Cdare",
    Cferre="Cferre", C_esse="C_esse", Cvelle="Cvelle";


function wordPresIndAct  (word) { return word[0]; }
function wordPresIndInf  (word) { return word[1]; }
function wordPresPerAct  (word) { return word[2]; }
function wordPasPart     (word) { return word[3]; }
function wordPresentStem (word) { return word[4]; }
function wordPerfectStem (word) { return word[5]; }
function wordConj        (word) { return word[6]; }
function wordCap         (word) { return word[7]; }
function wordCh          (word) { return word[8]; }


// PresIndAct PresIndInf PresPerAct PasPart Present-stem Perfect-stem conj LL W
var OrigWords = [

  ["accipi_o", "accipere", "acc_ep_i", "acceptum",
   "accip", "acc_ep", C3B, 8, 99],
  ["acurr_o", "acurrere", "acucurr_i", "acursum",
   "acurr", "acucurr", C3A, 9, 99],
  ["affer_o", "afferre", "attul_i", "adl_atum",
   "affer", "attul", Cferre, 14, 99],
  ["adsum", "adesse", "adfu_i", "adfut_urum", "ad", "adfu", Cesse, 11, 99],
  ["adiuv_o", "adiuv_are", "adi_uv_i", "adi_utum",
   "adiuv", "adi_uv", C1, 99, 4],
  ["aegr_ot_o", "aegr_ot_are", "aegr_ot_av_i", "aegr_ot_atum",
   "aegr_ot", "aegr_ot_av", C1, 11, 99],
  ["ag_o", "agere", "_eg_i", "_actum", "ag", "_eg", C3A, 99, 8],
  ["al_o", "alere", "alu_i", "altum", "al", "alu", C3A, 99, 13],
  ["ambul_o", "ambul_are", "ambul_av_i", "ambul_atum",
   "ambul", "ambul_av", C1, 6, 99],
  ["_amitt_o", "_amittere", "_am_is_i", "_amissum",
   "_amitt", "_am_is", C3A, 99, 12],
  ["am_o", "am_are", "am_av_i", "am_atum", "am", "am_av", C1, 5, 1],
  ["appell_o", "appell_are", "appell_av_i", "appell_atum",
   "appell", "appell_av", C1, 16, 99],
  ["aperi_o", "aper_ire", "aperu_i", "apertum", "aper", "aperu", C4, 7, 99],
  ["app_on_o", "app_onere", "app_osui", "appositum",
   "app_on", "app_osu", C3A, 11, 99],
  ["arcess_o", "arcessere", "arcess_iv_i", "arcess_itum",
   "arcess", "arcess_iv", C3A, 11, 99],
  ["aspici_o", "aspicere", "aspex_i", "aspectum",
   "aspic", "aspex", C3B, 8, 99],
  ["aude_o", "aud_ere", "ausus sum", "", "aud", "ausus sum?", C2, 10, 7],
  ["audi_o", "aud_ire", "aud_iv_i", "aud_itum", "aud", "aud_iv", C4, 3, 10],

  ["b_al_o", "b_al_are", "b_al_av_i", "b_al_atum",
   "b_al", "b_al_av", C1, 9, 99],
  ["bib_o", "bibere", "bib_i", "", "bib", "bib", C3A, 9, 99],
  ["cad_o", "cadere", "cecid_i", "c_as_urum", "cad", "cecid", C3A, 10, 12],
  ["can_o", "canere", "cecin_i", "cantum", "can", "cecin", C3A, 10, 99],
  ["cant_o", "cant_are", "cant_av_i", "cant_atum",
   "cant", "cant_av", C1, 3, 99],
  ["capi_o", "capere", "c_ep_i", "captum", "cap", "c_ep", C3B, 10, 10],
  ["carp_o", "carpere", "carps_i", "carptum", "carp", "carps", C3A, 5, 99],
  ["c_en_o", "c_en_are", "c_en_av_i", "c_en_atum",
   "c_en", "c_en_av", C1, 99, 5],
  ["cern_o", "cernere", "cr_ev_i", "cr_etum", "cern", "cr_ev", C3A, 16, 99],
  ["cl_am_o", "cl_am_are", "cl_am_av_i", "cl_am_atum",
   "cl_am", "cl_am_av", C1, 8, 99],
  ["claud_o", "claudere", "claus_i", "clausum", "claud", "claus", C3A, 7, 99],
  ["c_ogit_o", "c_ogit_are", "c_ogit_av_i", "c_ogit_atum",
   "c_ogit", "c_ogitav", C1, 17, 1],
  ["comput_o", "comput_are", "comput_av_i", "comput_atum",
   "comput", "comput_av", C1, 17, 99],
  ["c_onscend_o", "c_onscendere", "c_onscend_i", "c_onscensum",
   "c_onscend", "c_onscend", C3A, 16, 99],
  ["conserv_o", "conserv_are", "conserv_av_i", "conserv_atum",
   "conserv", "conserv_av", C1, 99, 1],
  ["c_ons_id_o", "c_ons_idere", "c_ons_is_ed_i", "c_ons_isessum",
   "c_ons_id", "c_ons_is_ed", C3A, 15, 99],
  ["c_onsist_o", "c_onsistere", "c_onsistit_i", "",
   "c_onsist", "c_onsistit", C3A, 8, 99],
  ["c_onst_o", "c_onst_are", "c_onst_av_i", "c_onst_atum",
   "c_onst", "c_onst_av", C1, 8, 99],
  ["c_onveni_o", "c_onven_ire", "c_onv_en_i", "c_onventum",
   "c_onven", "c_onv_en", C4, 8, 99],
  ["cre_o", "cre_are", "cre_av_i", "cre_atum", "cre", "cre_av", C1, 99, 12],
  ["cub_o", "cub_are", "cub_av_i", "cub_atum", "cub", "cub_av", C1, 14, 99],
  ["culp_o", "culp_are", "culp_av_i", "culp_atum",
   "culp", "culp_av", C1, 99, 5],
  ["curr_o", "currere", "cucurr_i", "cursum", "curr", "cucurr", C3A, 7, 99],

  ["d_ebe_o", "d_eb_ere", "d_ebu_i", "d_ebitum", "d_eb", "d_ebu", C2, 99, 1],
  ["d_elect_o", "d_elect_are", "d_elect_av_i", "d_elect_atum",
   "d_elect", "d_elect_av", C1, 5, 99],
  ["d_em_onstr_o", "d_em_onstr_are", "d_em_onstr_av_i", "d_em_onstr_atum",
   "d_em_onstr", "d_em_onstr_av", C1, 17, 8],
  ["d_ep_on_o", "d_ep_onere", "d_eposu_i", "d_epositum",
   "d_epon", "d_eposu", C3A, 16, 99],
  ["d_esin_o", "d_esinere", "d_esins_iv_i", "d_esinsitum",
   "d_esin", "d_esins_iv", C3A, 15, 99],
  ["d_eterg_o", "d_etergere", "d_eters_i", "d_etersum",
   "d_eterg", "d_eters", C3A, 11, 99],
  ["d_ic_o", "d_icere", "d_ix_i", "dictum", "d_ic", "d_ix", C3A, 11, 10],
  ["d_ilig_o", "d_iligere", "d_il_ex_i", "d_il_ectum",
   "d_ilig", "d_il_ex", C3A, 99, 13],
  ["disc_ed_o", "disc_edere", "disc_edcess_i?", "disc_edcessum?",
   "disc_ed", "disc_edcess?", C3A, 4, 99],
  ["disc_o", "discere", "didic_i", "", "disc", "didic", C3A, 17, 8],
  ["d_o", "dare", "ded_i", "datum", "d", "de", Cdare, 7, 1],
  ["doce_o", "doc_ere", "docu_i", "doctum", "doc", "docu", C2, 17, 8],
  ["dole_o", "dol_ere", "dolu_i", "dolit_urum", "dol", "dolu", C2, 11, 99],
  ["dormi_o", "dorm_ire", "dorm_iv_i", "dorm_itum",
   "dorm", "dorm_iv", C4, 3, 99],
  ["d_uc_o", "d_ucere", "d_ux_i", "ductum", "d_uc", "d_ux", C3A, 9, 8],

  ["ed_o", "_esse" /*or edere*/, "_ed_i", "_esum", "", "", C_esse, 9, 99],
  ["em_o", "emere", "_em_i", "_emptum", "em", "_em", C3A, 8, 99],
  ["e_o", "_ire", "i_i" /*or _iv_i*/, "itum", "", "", Cire, 6, 99],
  ["err_o", "err_are", "err_av_i", "err_atum", "err", "err_av", C1, 9, 1],
  ["excit_o", "excit_are", "excit_av_i", "excit_atum",
   "excit", "excit_av", C1, 14, 99],
  ["excl_am_o", "excl_am_are", "excl_am_av_i", "excl_am_atum",
   "excl_am", "excl_am_av", C1, 15, 99],
  ["expect_o", "expect_are", "expect_av_i", "expect_atum",
   "expect", "expect_av", C1, 7, 99],

  ["faci_o", "facere", "f_ec_i", "factum", "fac", "f_ec", C3B, 10, 10],
  ["fer_o", "ferre", "tul_i", "l_atum", "fer", "tul", Cferre, 12, 99],
  ["f_i_o", "fier_i", "factus sum?", "", "f", "factus sum?", C3A, 16, 99],
  ["fl_o", "fl_are", "fl_av_i", "fl_atum", "fl", "fl_av", C3A, 16, 99],
  ["flu_o", "fluere", "fl_ux_i", "fl_uxum", "flu", "fl_ux", C3A, 11, 99],
  ["fr_ig_o", "fr_ig_ere", "fr_ix_i", "frictum", "fr_ig", "fr_ix", C2, 14, 99],
  ["fugi_o", "fugere", "f_ug_i", "fugit_urum", "fug", "f_ug", C3B, 99, 10],

  ["gaude_o", "gaud_ere", "g_av_isus sum", "",
   "gaud", "g_av_isus ?", C2, 11, 99],
  ["ger_o", "gerere", "gess_i", "gestum", "ger", "gess", C3A, 14, 8],
  ["gubern_o", "gubern_are", "gubern_av_i", "gubern_atum",
   "gubern", "gubern_av", C3A, 16, 99],
  ["habe_o", "hab_ere", "habu_i", "habitum", "hab", "habu", C2, 99, 3],
  ["hauri_o", "haur_ire", "haus_i", "haustum", "haur", "haus", C4, 16, 99],
  ["horre_o", "horr_ere", "?", "?", "horr", "?", C2, 11, 99],

  ["iaci_o", "iacere", "i_ec_i", "iactum", "iac", "i_ec", C3B, 9, 99],
  ["iact_o", "iact_are", "iact_av_i", "iact_atum",
   "iact", "iact_av", C1, 16, 99],
  ["ill_ustr_o", "ill_ustr_are", "ill_ustr_av_i", "ill_ustr_atum",
   "ill_ustr", "ill_ustr_av", C1, 13, 99],
  ["imper_o", "imper_are", "imper_av_i", "imper_atum",
   "imper", "imper_av", C1, 4, 99],
  ["imple_o", "impl_ere", "impl_ev_i", "impl_etum",
   "impl", "impl_ev", C2, 16, 99],
  ["imp_on_o", "imp_onere", "imp_osui", "impositum",
   "imp_on", "imp_osu", C3A, 9, 99],
  ["incipi_o", "incipere", "incipic_ep_i", "incipiceptum",
   "incip", "incipic_ep", C3B, 13, 99],
  ["indu_o", "induere", "indu_i", "ind_utum", "indu", "indu", C3A, 14, 99],
  ["_influ_o", "_influere", "_infl_ux_i", "_infl_uxum",
   "_influ", "_infl_ux", C3A, 16, 99],
  ["intelleg_o", "intellegere", "intell_ex_i", "intell_ectum",
   "intelleg", "intell_ex", C3A, 99, 11],
  ["interpell_o", "interpell_are", "interpell_av_i", "interpell_atum",
   "interpell", "interpell_av", C1, 17, 99],
  ["intersum", "interesse", "interfu_i", "interfut_urum",
   "inter", "interfu", Cesse, 16, 99],
  ["interrog_o", "interrog_are", "interrog_av_i", "interrog_atum",
   "interrog", "interrog_av", C1, 3, 99],
  ["intr_o", "intr_are", "intr_av_i", "intr_atum",
   "intr", "intr_av", C1, 6, 99],
  ["inveni_o", "inven_ire", "inv_en_i", "inventum",
   "inven", "inv_en", C4, 3, 10],
  ["invoc_o", "invoc_are", "invoc_av_i", "invoc_atum",
   "invoc", "invoc_av", C1, 16, 99],
  ["iube_o", "iub_ere", "iuss_i", "iussum", "iub", "iuss", C2, 11, 99],
  ["iung_o", "iungere", "i_unx_i", "i_unctum",
   "iung", "i_unx", C3A, 99, 13],
  ["iuv_o", "iuv_are", "i_uv_i", "i_utum", "iuv", "i_uv", C1, 99, 4],

  ["lacrim_o", "lacrim_are", "lacrim_av_i", "lacrim_atum",
   "lacrim", "lacrim_av", C1, 7, 99],
  ["l_atr_o", "l_atr_are", "l_atr_av_i", "l_atr_atum",
   "l_atr", "l_atr_av", C1, 9, 99],
  ["laud_o", "laud_are", "laud_av_i", "laud_atum",
   "laud", "laud_av", C1, 17, 1],
  ["lav_o", "lav_are", "lav_av_i", "lav_atum", "lav", "lav_av", C1, 14, 99],
  ["l_uce_o", "l_ucere", "l_ux_i", "?", "l_uc", "l_ux", C3A, 9, 99],
  ["l_ud_o", "l_udere", "l_us_i", "l_usum", "l_ud", "l_us", C3A, 10, 99],

  ["mane_o", "man_ere", "m_ans_i", "m_ansum", "man", "m_ans", C2, 99, 5],
  ["merg_o", "mergere", "mers_i", "mersum", "merg", "mers", C3A, 14, 99],
  ["mitt_o", "mittere", "m_is_i", "missum", "mitt", "m_is", C3A, 99, 11],
  ["mone_o", "mon_ere", "monu_i", "monitum", "mon", "monu", C2, 99, 1],
  ["m_onstr_o", "m_onstr_are", "m_onstr_av_i", "m_onstr_atum",
   "m_onstr", "m_onstr_av", C1, 8, 99],
  ["move_o", "mov_ere", "m_ov_i", "m_otum", "mov", "m_ov", C2, 10, 99],

  ["nat_o", "nat_are", "nat_av_i", "nat_atum", "nat", "nat_av", C1, 10, 99],
  ["n_avig_o", "n_avig_are", "n_avig_av_i", "n_avig_atum",
   "n_avig", "n_avig_av", C3A, 16, 99],
  ["nec_o", "nec_are", "nec_av_i", "nec_atum", "nec", "nec_av", C1, 99, 7],
  ["n_omin_o", "n_omin_are", "n_omin_av_i", "n_omin_atum",
   "n_omin", "n_omin_av", C1, 13, 99],
  ["numer_o", "numer_are", "numer_av_i", "numer_atum",
   "numer", "numer_av", C1, 4, 99],

  ["occid_o", "occidere", "occicidi", "occic_asum",
   "occid", "occicid", C3A, 16, 99],
  ["occult_o", "occult_are", "occult_av_i", "occult_atum",
   "occult", "occult_av", C1, 10, 99],
  ["operi_o", "oper_ire", "operu_i", "opertum", "operi", "operu", C4, 13, 99],
  ["_orn_o", "_orn_are", "_orn_av_i", "_orn_atum",
   "_orn", "_orn_av", C1, 8, 99],
  ["ostend_o", "ostendere", "ostend_i", "ostentum",
   "ostend", "ostend", C3A, 8, 99],

  ["palpit_o", "palpit_are", "palpit_av_i", "palpit_atum",
   "palpit", "palpit_av", C1, 11, 99],
  ["p_are_o", "p_ar_ere", "p_aru_i", "", "p_ar", "p_aru", C2, 4, 99],
  ["pari_o", "parere", "peper_i", "partum", "par", "peper", C3B, 10, 99],
  ["pet_o", "petere", "pet_iv_i", "pet_itum", "pet", "pet_iv", C3A, 9, 99],
  ["pl_or_o", "pl_or_are", "pl_or_av_i", "pl_or_atum", 
   "pl_or", "pl_or_av", C1, 3, 99],
  ["p_on_o", "p_onere", "p_osui", "positum", "p_on", "p_osu", C3A, 4, 99],
  ["port_o", "port_are", "port_av_i", "port_atum",
   "port", "port_av", C1, 6, 99],
  ["posc_o", "poscere", "poposc_i", "", "posc", "poposc", C3A, 14, 99],
  ["possum", "posse", "potu_i", "", "", "", Cposse, 1, 6],
  ["pr_om_o", "pr_omere", "promps_i", "promptum",
   "pr_om", "pr_omps", C3A, 17, 99],
  ["puls_o", "puls_are", "puls_av_i", "puls_atum",
   "puls", "puls_av", C1, 3, 99],
  ["p_uni_o", "p_un_ire", "p_un_iv_i", "p_un_itum",
   "p_un", "p_un_iv", C4, 15, 99],
  ["put_o", "put_are", "put_av_i", "put_atum", "put", "put_av", C1, 11, 99],
  ["quaer_o", "quaerere", "quaes_iv_i", "quaesitum",
   "quaer", "quaes_iv", C3A, 9, 99],

  ["recit_o", "recit_are", "recit_av_i", "recit_atum",
   "recit", "recit_av", C1, 15, 99],
  ["redd_o", "reddere", "reddid_i", "redditum", "redd", "reddid", C3A, 15, 99],
  ["rede_o", "red_ire", "redi_i" /*or red_iv_i*/, "reditum",
   "red", "red", Cire, 15, 99],
  ["relinqu_o", "relinquere", "rel_iqu_i", "relictum",
   "relinqu", "rel_iqu", C3A, 9, 99],
  ["remane_o", "reman_ere", "rem_ans_i", "rem_ansum",
   "reman", "rem_ans", C2, 99, 5],
  ["reperi_o", "reper_ire", "repper_i", "repertum",
   "reper", "repper", C4, 9, 99],
  ["rep_on_o", "rep_onere", "rep_osui", "repositum",
   "rep_on", "rep_osu", C3A, 17, 99],
  ["reprehend_o", "reprehendere", "reprehend_i", "reprehensum",
   "reprehend", "reprehend", C3A, 17, 99],
  ["responde_o", "respond_ere", "respond_i", "resp_onsum",
   "respond", "respond", C2, 3, 99],
  ["reveni_o", "reven_ire", "rev_en_i", "reventum",
   "reven", "rev_en", C4, 11, 99],
  ["r_ide_o", "r_id_ere", "r_is_i", "r_isum", "r_id", "r_is", C2, 3, 99],

  ["s_an_o", "s_an_are", "s_an_av_i", "s_an_atum",
   "s_an", "s_an_av", C1, 11, 99],
  ["sati_o", "sati_are", "sati_av_i", "sati_atum",
   "sati", "sati_av", C1, 99, 3],
  ["salve_o", "salv_ere", "", "", "salv", "?", C2, 99, 1],
  ["sci_o", "sc_ire", "sc_iv_i", "sc_itum", "sc", "sc_iv", C4, 17, 99],
  ["scr_ib_o", "scr_ibere", "scr_ips_i", "scr_iptum",
   "scr_ib", "scr_ips", C3A, 99, 8],
  ["sede_o", "sed_ere", "s_ed_i", "sessum", "sed", "s_ed", C2, 11, 99],
  ["senti_o", "sent_ire", "s_ens_i", "s_ensum", "sent", "s_ens", C4, 11, 99],
  ["serv_o", "serv_are", "serv_av_i", "serv_atum",
   "serv", "serv_av", C1, 16, 1],
  ["sole_o", "sol_ere", "solitus sum", "", "sol", "solitus sum?", C2, 14, 99],
  ["spect_o", "spect_are", "spect_av_i", "spect_atum",
   "spect", "spect_av", C1, 11, 99],
  ["sp_ir_o", "sp_ir_are", "sp_ir_av_i", "sp_ir_atum",
   "sp_ir", "sp_ir_av", C1, 10, 99],
  ["st_o", "st_are", "stet_i", "statum", "st", "stet", C1, 11, 13],
  ["sum", "esse", "fu_i", "fut_urum", "", "fu", Cesse, 1, 4],
  ["s_um_o", "s_umere", "s_umps_i", "s_umptum", "s_um", "s_umps", C3A, 4, 99],
  ["super_o", "super_are", "super_av_i", "super_atum",
   "super", "super_av", C1, 99, 5],
  ["surg_o", "surgere", "surr_ex_i", "surr_ectum",
   "surg", "surr_ex", C3A, 14, 99],
  ["sustine_o", "sustin_ere", "sustinu_i", "sustintentum",
   "susten", "sustinu", C2, 10, 99],

  ["tang_o", "tangere", "tetig_i", "t_actum", "tang", "tetig", C3A, 11, 99],
  ["tace_o", "tac_ere", "tacu_i", "tacitum", "tac", "tacu", C2, 4, 99],
  ["tene_o", "tenere", "tetend_i", "tentum", "ten", "tetend", C3A, 7, 99],
  ["terg_o", "tergere", "ters_i", "tersum", "terg", "ters", C3A, 7, 99],
  ["terre_o", "terr_ere", "terreu_i", "territum", "terr", "terreu", C2, 99, 1],
  ["time_o", "tim_ere", "timu_i", "", "tim", "timu", C2, 6, 99],
  ["toler_o", "toler_are", "toler_av_i", "toler_atum",
   "toler", "toler_av", C1, 99, 6],
  ["toll_o", "tollere", "sustul_i", "subl_atum",
   "toll", "sustul", C3A, 17, 99],
  ["trah_o", "trahere", "tr_ax_i", "tractum", "trah", "tr_ax", C3A, 99, 8],
  ["turb_o", "turb_are", "turb_av_i", "turb_atum",
   "turb", "turb_av", C1, 16, 99],

  ["ulul_o", "ulul_are", "ulul_av_i", "ulul_atum",
   "ulul", "ulul_av", C1, 9, 99],
  ["vale_o", "val_ere", "valu_i", "valit_urum", "val", "valu", C2, 14, 1],
  ["veh_o", "vehere", "vex_i", "vectum", "veh", "vex", C3A, 6, 99],
  ["v_end_o", "v_endere", "v_endid_i", "v_enditum",
   "v_end", "v_endid", C3A, 8, 99],
  ["veni_o", "ven_ire", "v_en_i", "ventum", "ven", "v_en", C4, 3, 10],
  ["verber_o", "verber_are", "verber_av_i", "verber_atum",
   "verber", "verber_av", C1, 3, 99],
  ["vert_o", "vertere", "vert_i", "versum", "vert", "vert", C3A, 7, 99],
  ["vesti_o", "vest_ire", "vest_iv_i", "vest_itum",
   "vest", "vest_iv", C4, 14, 99],
  ["vide_o", "vid_ere", "v_id_i", "v_isum", "vid", "v_id", C2, 3, 1],
  ["vigil_o", "vigil_are", "vigil_av_i", "vigil_atum",
   "vigil", "vigil_av", C1, 14, 99],
  ["vinc_o", "vincere", "v_ic_i", "victum", "vinc", "v_ic", C3A, 99, 8],
  ["v_iv_o", "v_ivere", "v_ix_i", "v_ictum", "v_iv", "v_ix", C3A, 10, 10],
  ["voc_o", "voc_are", "voc_av_i", "voc_atum", "voc", "voc_av", C1, 3, 1],
  ["vol_o", "vol_are", "vol_av_i", "vol_atum", "vol", "vol_av", C1, 10, 99],
  ["vol_o", "velle", "volu_i", "", "", "", Cvelle, 13, 99]

];


var AllPersons = [FIRST, SECOND, THIRD];
var AllNumbers = [SG, PL];
var AllTenses = [PRESENT, FUTURE, IMPERFECT, PERFECT, FUTUREPERFECT,
                 PLUPERFECT];
var AllManners = [INDICATIVE, IMPERATIVE /*,SUBJUNCTIVE*/];
var AllVoices = [ACTIVE, PASSIVE];
var AllConjs = [C1, C2, C3A, C3B, C4, Cesse, Cposse, Cire, Cferre,
	        Cdare, C_esse, Cvelle];

function conjTitle  (conj) { return conj[0]; }
function conjTense  (conj) { return conj[1]; }
function conjManner (conj) { return conj[2]; }
function conjVoice  (conj) { return conj[3]; }
function conjStem   (conj) { return conj[4]; }

var AllowedTMVs = [
  ["PresIndAct", PRESENT,       INDICATIVE, ACTIVE,  PRESENTSTEM],
  ["PresImpAct", PRESENT,       IMPERATIVE, ACTIVE,  PRESENTSTEM],
  ["FutIndAct",  FUTURE,        INDICATIVE, ACTIVE,  PRESENTSTEM],
  ["ImpIndAct",  IMPERFECT,     INDICATIVE, ACTIVE,  PRESENTSTEM],
  ["PerIndAct",  PERFECT,       INDICATIVE, ACTIVE,  PERFECTSTEM],
  ["PpIndAct",   PLUPERFECT,    INDICATIVE, ACTIVE,  PERFECTSTEM],
  ["FpIndAct",   FUTUREPERFECT, INDICATIVE, ACTIVE,  PERFECTSTEM],
  ["PresIndPas", PRESENT,       INDICATIVE, PASSIVE, PRESENTSTEM],
];

var ending = [];

for (var c in AllConjs) {
    var conj = AllConjs[c];
    ending[conj] = [];
    for (var t in AllTenses) {
        var tense = AllTenses[t];
        ending[conj][tense] = [];
        for (var m in AllManners) {
	    var manner = AllManners[m];
            ending[conj][tense][manner] = [];
  	    for (var v in AllVoices)
	        var voice = AllVoices[v];
	        ending[conj][tense][manner][voice] = [];
	}
    }
}


ending[C1][PRESENT][INDICATIVE][ACTIVE] =
 [["_o", "_as", "at"],["_amus", "_atis", "ant"]];
ending[C1][FUTURE][INDICATIVE][ACTIVE] =
 [["_ab_o", "_abis", "_abit"], ["_abimus", "_abitis", "_abunt"]];
ending[C1][IMPERFECT][INDICATIVE][ACTIVE] =
 [["_abam", "_ab_as", "_abat"], ["_ab_amus", "_ab_atis", "_abant"]];
ending[C1][PRESENT][IMPERATIVE][ACTIVE] =
 [["_a", "_a", "_a"], ["_ate", "_ate", "_ate"]];
ending[C1][PERFECT][INDICATIVE][ACTIVE] =
 [["_i", "ist_i", "it"], ["imus", "istis", "_erunt"]];
ending[C1][PLUPERFECT][INDICATIVE][ACTIVE] =
 [["eram", "er_as", "erat"], ["er_amus", "er_atis", "erant"]];
ending[C1][FUTUREPERFECT][INDICATIVE][ACTIVE] =
 [["er_o", "eris", "erit"], ["erimus", "eritis", "erint"]];
ending[C1][PRESENT][INDICATIVE][PASSIVE] =
 [["or", "_aris", "_atur"], ["_amur", "_amin_i", "_antur"]];

ending[C2][PRESENT][INDICATIVE][ACTIVE] =
 [["e_o", "_es", "et"], ["_emus", "_etis", "ent"]];
ending[C2][FUTURE][INDICATIVE][ACTIVE] = 
 [["_eb_o", "_ebis", "_ebit"], ["_ebimus", "_ebitis", "_ebunt"]];
ending[C2][IMPERFECT][INDICATIVE][ACTIVE] = 
 [["_ebam", "_eb_as", "_eb_at"], ["_eb_amus", "_eb_atis", "_ebant"]];
ending[C2][PRESENT][IMPERATIVE][ACTIVE] =
 [["_e", "_e", "_e"], ["_ete", "_ete", "_ete"]];
ending[C2][PERFECT][INDICATIVE][ACTIVE] =
 [["u_i", "uist_i", "uit"], ["uimus", "uistis", "u_erunt"]];
ending[C2][PLUPERFECT][INDICATIVE][ACTIVE] =
 [["ueram", "uer_as", "uerat"], ["uer_amus", "uer_atis", "uerant"]];
ending[C2][FUTUREPERFECT][INDICATIVE][ACTIVE] =
 [["uer_o", "ueris", "uerit"], ["uerimus", "ueritis", "uerint"]];
ending[C2][PRESENT][INDICATIVE][PASSIVE] =
 [["eor", "_eris", "_etur"], ["_emur", "_emin_i", "entur"]];

ending[C3A][PRESENT][INDICATIVE][ACTIVE] =
 [["_o", "is", "it"], ["imus", "itis", "unt"]];
ending[C3A][FUTURE][INDICATIVE][ACTIVE] =
 [["am", "_es", "et"], ["_emus", "_etis", "_ent"]];
ending[C3A][IMPERFECT][INDICATIVE][ACTIVE] =
 [["_ebam", "_eb_as", "_ebat"], ["_eb_amus", "_eb_atis", "_ebant"]];
ending[C3A][PRESENT][IMPERATIVE][ACTIVE] =
 [["e", "e", "e"], ["ite", "ite", "ite"]];
ending[C3A][PERFECT][INDICATIVE][ACTIVE] =
 [["_i", "ist_i", "it"], ["imus", "istis", "_erunt"]];
ending[C3A][PLUPERFECT][INDICATIVE][ACTIVE] =
 [["eram", "er_as", "erat"], ["er_amus", "er_atis", "erant"]];
ending[C3A][FUTUREPERFECT][INDICATIVE][ACTIVE] =
 [["er_o", "eris", "erit"], ["erimus", "eritis", "erint"]];
ending[C3A][PRESENT][INDICATIVE][PASSIVE] =
 [["or", "eris", "itur"], ["imur", "imin_i", "untur"]];

ending[C3B][PRESENT][INDICATIVE][ACTIVE] =
 [["i_o", "is", "it"], ["imus", "itis", "iunt"]];
ending[C3B][FUTURE][INDICATIVE][ACTIVE] =
 [["iam", "i_es", "iet"], ["i_emus", "i_etis", "ient"]];
ending[C3B][IMPERFECT][INDICATIVE][ACTIVE] =
 [["i_ebam", "i_eb_as", "i_ebat"], ["i_eb_amus", "i_eb_atis", "i_ebant"]];
ending[C3B][PRESENT][IMPERATIVE][ACTIVE] =
 [["e", "e", "e"], ["ite", "ite", "ite"]];
ending[C3B][PERFECT][INDICATIVE][ACTIVE] =
 [["_i", "ist_i", "it"], ["imus", "istis", "_erunt"]];
ending[C3B][PLUPERFECT][INDICATIVE][ACTIVE] =
 [["eram", "er_as", "erat"], ["er_amus", "er_atis", "erant"]];
ending[C3B][FUTUREPERFECT][INDICATIVE][ACTIVE] =
 [["er_o", "eris", "erit"], ["erimus", "eritis", "erint"]];
ending[C3B][PRESENT][INDICATIVE][PASSIVE] =
 [["ior", "eris", "itur"], ["imur", "imin_i", "iuntur"]];

ending[C4][PRESENT][INDICATIVE][ACTIVE] =
 [["i_o", "_is", "it"], ["_imus", "_itis", "iunt"]];
ending[C4][FUTURE][INDICATIVE][ACTIVE] =
 [["iam", "i_es", "iet"], ["i_emus", "i_etis", "ient"]];
ending[C4][IMPERFECT][INDICATIVE][ACTIVE] =
 [["i_ebam", "i_eb_as", "i_ebat"], ["i_emus", "i_eb_atis", "_ebant"]];
ending[C4][PRESENT][IMPERATIVE][ACTIVE] =
 [["_i", "_i", "_i"], ["_ite", "_ite", "_ite"]];
ending[C4][PERFECT][INDICATIVE][ACTIVE] =
 [["_iv_i", "_ivist_i", "_ivit"], ["_ivimus", "_ivistis", "_iv_erunt"]];
ending[C4][PLUPERFECT][INDICATIVE][ACTIVE] =
 [["_iveram", "_iver_as", "_iverat"],["_iver_amus", "_iver_atis", "_iverant"]];
ending[C4][FUTUREPERFECT][INDICATIVE][ACTIVE] =
 [["_iver_o", "_iveris", "_iverit"], ["_iverimus", "_iveritis", "_iverint"]];
ending[C4][PRESENT][INDICATIVE][PASSIVE] =
 [["ior", "_iris", "_itur"], ["_imur", "_imin_i", "_iuntur"]];

ending[Cesse][PRESENT][INDICATIVE][ACTIVE] =
 [["sum", "es", "est"], ["sumus", "estis", "sunt"]];
ending[Cesse][FUTURE][INDICATIVE][ACTIVE] =
 [["er_o", "eris", "erit"], ["erimus", "eritis", "erunt"]];
ending[Cesse][IMPERFECT][INDICATIVE][ACTIVE] =
 [["eram", "er_as", "erat"], ["er_amus", "er_atis", "erant"]];
ending[Cesse][PRESENT][IMPERATIVE][ACTIVE] =
 [["es", "es", "es"], ["este", "este", "este"]];
ending[Cesse][PERFECT][INDICATIVE][ACTIVE] =
 [["_i", "ist_i", "it"], ["imus", "istis", "_erunt"]];
ending[Cesse][PLUPERFECT][INDICATIVE][ACTIVE] =
 [["eram", "er_as", "erat"], ["er_amus", "er_atis", "erant"]];
ending[Cesse][FUTUREPERFECT][INDICATIVE][ACTIVE] =
 [["er_o", "eris", "erit"], ["erimus", "eritis", "erint"]];
ending[Cesse][PRESENT][INDICATIVE][PASSIVE] =
 [["--", "--", "--"], ["--", "--", "--"]];

ending[Cposse][PRESENT][INDICATIVE][ACTIVE] =
 [["possum", "potes", "potest"], ["possumus", "potestis", "possunt"]];
ending[Cposse][FUTURE][INDICATIVE][ACTIVE] =
 [["poter_o", "poteris", "poterit"], ["poterimus", "poteritis", "poterunt"]];
ending[Cposse][IMPERFECT][INDICATIVE][ACTIVE] =
 [["poteram", "poter_as", "poterat"],["poter_amus", "poter_atis", "poterant"]];
ending[Cposse][PRESENT][IMPERATIVE][ACTIVE] =
 [["potes", "potes", "potes"], ["poteste", "poteste", "poteste"]];
ending[Cposse][PERFECT][INDICATIVE][ACTIVE] =
 [["potu_i", "potuist_i", "potuit"], ["potuimus", "potuistis", "potu_erunt"]];
ending[Cposse][PLUPERFECT][INDICATIVE][ACTIVE] =
 [["potueram", "potuer_as", "potuerat"],
  ["potuer_amus", "potuer_atis", "potuerant"]];
ending[Cposse][FUTUREPERFECT][INDICATIVE][ACTIVE] =
 [["potuer_o", "potueris", "potuerit"],
  ["potuerimus", "potueritis", "potuerint"]];
ending[Cposse][PRESENT][INDICATIVE][PASSIVE] =
 [["--", "--", "--"], ["--", "--", "--"]];

ending[Cire][PRESENT][INDICATIVE][ACTIVE] =
 [["e_o", "_is", "it"], ["_imus", "_itis", "eunt"]];
ending[Cire][FUTURE][INDICATIVE][ACTIVE] =
 [["_ib_o", "_ibis", "_ibit"], ["_ibimus", "_ibitis", "_ibunt"]];
ending[Cire][IMPERFECT][INDICATIVE][ACTIVE] =
 [["_ibam", "_ib_as", "_ibat"], ["_ib_amus", "_ib_atis", "_ibant"]];
ending[Cire][PRESENT][IMPERATIVE][ACTIVE] =
 [["_i", "_i", "_i"], ["_ite", "_ite", "_ite"]];
ending[Cire][PERFECT][INDICATIVE][ACTIVE] =
 [["i_i", "_ist_i", "iit"], ["iimus", "_istis", "i_erunt"]];
ending[Cire][PLUPERFECT][INDICATIVE][ACTIVE] =
 [["ieram", "ier_as", "ierat"], ["ier_amus", "ier_atis", "ierant"]];
ending[Cire][FUTUREPERFECT][INDICATIVE][ACTIVE] =
 [["ier_o", "ieris", "ierit"], ["ierimus", "ieritis", "ierint"]];
ending[Cire][PRESENT][INDICATIVE][PASSIVE] =
 [["--", "--", "--"], ["--", "--", "--"]];

ending[Cferre][PRESENT][INDICATIVE][ACTIVE] =
 [["_o", "s", "t"], ["imus", "tis", "unt"]];
ending[Cferre][FUTURE][INDICATIVE][ACTIVE] =
 [["am", "_es", "et"], ["_emus", "_etis", "_ent"]];
ending[Cferre][IMPERFECT][INDICATIVE][ACTIVE] =
 [["_ebam", "_eb_as", "_ebat"], ["_eb_amus", "_eb_atis", "_ebant"]];
ending[Cferre][PRESENT][IMPERATIVE][ACTIVE] =
 [["e", "e", "e"], ["ite", "ite", "ite"]];
ending[Cferre][PERFECT][INDICATIVE][ACTIVE] =
 [["_i", "ist_i", "it"], ["imus", "istis", "_erunt"]];
ending[Cferre][PLUPERFECT][INDICATIVE][ACTIVE] =
 [["eram", "er_as", "erat"], ["er_amus", "er_atis", "erant"]];
ending[Cferre][FUTUREPERFECT][INDICATIVE][ACTIVE] =
 [["er_o", "eris", "erit"], ["erimus", "eritis", "erint"]];
ending[Cferre][PRESENT][INDICATIVE][PASSIVE] =
 [["or", "ris", "tur"], ["imur", "imin_i", "untur"]];

ending[Cdare][PRESENT][INDICATIVE][ACTIVE] =
 [["_o", "_as", "at"], ["_amus", "_atis", "ant"]];
ending[Cdare][FUTURE][INDICATIVE][ACTIVE] =
 [["_ab_o", "_abis", "_abit"], ["_abimus", "_abitis", "_abunt"]];
ending[Cdare][IMPERFECT][INDICATIVE][ACTIVE] =
 [["_abam", "_ab_as", "_abat"], ["_ab_amus", "_ab_atis", "_abant"]];
ending[Cdare][PRESENT][IMPERATIVE][ACTIVE] =
 [["_a", "_a", "_a"], ["ate", "ate", "ate"]];
ending[Cdare][PERFECT][INDICATIVE][ACTIVE] =
 [["_i", "ist_i", "it"], ["imus", "istis", "_erunt"]];
ending[Cdare][PLUPERFECT][INDICATIVE][ACTIVE] =
 [["eram", "er_as", "erat"], ["er_amus", "er_atis", "erant"]];
ending[Cdare][FUTUREPERFECT][INDICATIVE][ACTIVE] =
 [["er_o", "eris", "erit"], ["erimus", "eritis", "erint"]];
ending[Cdare][PRESENT][INDICATIVE][PASSIVE] =
 [["or", "_aris", "_atur"], ["_amur", "_amin_i", "_antur"]];

ending[C_esse][PRESENT][INDICATIVE][ACTIVE] =
 [["?", "?", "_est"], ["?", "?", "?"]];
ending[C_esse][FUTURE][INDICATIVE][ACTIVE] =
 [["?", "?", "?"], ["?", "?", "?"]];
ending[C_esse][IMPERFECT][INDICATIVE][ACTIVE] =
 [["?", "?", "?"], ["?", "?", "?"]];
ending[C_esse][PRESENT][IMPERATIVE][ACTIVE] =
 [["?", "?", "?"], ["?", "?", "?"]];
ending[C_esse][PERFECT][INDICATIVE][ACTIVE] =
 [["?", "?", "?"], ["?", "?", "?"]];
ending[C_esse][PLUPERFECT][INDICATIVE][ACTIVE] =
 [["?", "?", "?"], ["?", "?", "?"]];
ending[C_esse][FUTUREPERFECT][INDICATIVE][ACTIVE] =
 [["?", "?", "?"], ["?", "?", "?"]];
ending[C_esse][PRESENT][INDICATIVE][PASSIVE] =
 [["?", "?", "?"], ["?", "?", "?"]];

ending[Cvelle][PRESENT][INDICATIVE][ACTIVE] =
 [["vol_o", "vis", "vult"], ["volimus", "vultis", "volunt"]];
ending[Cvelle][FUTURE][INDICATIVE][ACTIVE] =
 [["volam", "voles", "volet"], ["volemus", "voletis", "volent"]];
ending[Cvelle][IMPERFECT][INDICATIVE][ACTIVE] =
 [["volebam", "volebas", "volebat"], ["volebamus", "volebatis", "volebant"]];
ending[Cvelle][PRESENT][IMPERATIVE][ACTIVE] =
 [["", "", ""], ["", "", ""]];
ending[Cvelle][PERFECT][INDICATIVE][ACTIVE] =
 [["?", "?", "?"], ["?", "?", "?"]];
ending[Cvelle][PLUPERFECT][INDICATIVE][ACTIVE] =
 [["?", "?", "?"], ["?", "?", "?"]];
ending[Cvelle][FUTUREPERFECT][INDICATIVE][ACTIVE] =
 [["?", "?", "?"], ["?", "?", "?"]];
ending[Cvelle][PRESENT][INDICATIVE][PASSIVE] =
 [["?", "?", "?"], ["?", "?", "?"]];
