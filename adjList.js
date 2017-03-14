/*
adjQuiz - Quiz Latin Adjectives

Written in 2005 by Mike Wilson, cmikewilson@gmail.com

To the extent possible under law, the author(s) have dedicated all
copyright and related and neighboring rights to this software to the
public domain worldwide. This software is distributed without any
warranty.

You should have received a copy of the CC0 Public Domain Dedication
along with this software. If not, see
<http://creativecommons.org/publicdomain/zero/1.0/>.
*/

var SP=[0,1], SG=[0], PL=[1];
var D1=1, D3=3;
AdjectiveEndings = [];

function adjName (a) { return a[0]; }
function adjEnds (a) { return a[1]; }
function adjDecl (a) { return a[2]; }
function adjType (a) { return a[3]; }
function adjSP   (a) { return a[4]; }
function adjBase (a) { return a[5]; }
function adjCap  (a) { return a[6]; }

Adjectives = [
["magnus",    "-a -um", D1, 1, SP, "magn",    1],
["parvus",    "-a -um", D1, 1, SP, "parv",    1],
["Graecus",   "-a -um", D1, 1, SP, "Graec",   1],
["R_om_anus", "-a -um", D1, 1, SP, "R_om_an", 1],
["Latinus",   "-a -um", D1, 1, SP, "Latin",   1],
["mult_i",    "-ae -a", D1, 1, PL, "mult",    1],
["pauc_i",    "-ae -a", D1, 1, PL, "pauc",    1],
["_unus",     "-a -um", D1, 1, SG, "_un",     1],
["duo",       "-ae -o", D1, 2, PL, "du",      1],
["tr_es",     "tria",   D1, 3, PL, "tr",      1],
["pr_imus",   "-a -um", D1, 1, SP, "pr_im",   1],
["secundus",  "-a -um", D1, 1, SP, "secund",  1],
["tertius",   "-a -um", D1, 1, SP, "terti",   1],
["ant_iquus", "-a -um", D1, 1, SP, "ant_iqu", 2],
["novus",     "-a -um", D1, 1, SP, "nov",     2],
["c_eteri",   "-ae -a", D1, 1, PL, "c_eter",  2],
["meus",      "-a -um", D1, 1, SP, "me",      2],
["tuus",      "-a -um", D1, 1, SP, "tu",      2],
["laetus",    "-a -um", D1, 1, SP, "laet",    3],
["_ir_atus",  "-a -um", D1, 1, SP, "_ir_at",  3],
["probus",    "-a -um", D1, 1, SP, "prob",    3],
["improbus",  "-a -um", D1, 1, SP, "improb",  3],
["vacuus",    "-a -um", D1, 1, SP, "vacu",    4],
["bonus",     "-a -um", D1, 1, SP, "bon",     4],
["n_ullus",   "-a -um", D1, 1, SP, "n_ull",   4],
["suus",      "-a -um", D1, 1, SP, "su",      4]
];

function adjListInit () {
    AdjectiveEndings[1] = [
    ["us", "um", "_i", "_o", "_o", "_i",  "_os", "_orum", "_is", "_is"],
    ["a",  "am", "ae", "ae", "_a", "ae",  "_as", "_arum", "_is", "_is"],
    ["um", "um", "_i", "_o", "_o", "a",   "a",   "_orum", "_is", "_is"]
    ];
    AdjectiveEndings[2] = [
    ["", "", "", "", "", "o",  "_os", "_orum", "_is", "_is"],
    ["", "", "", "", "", "ae", "_as", "_arum", "_is", "_is"],
    ["", "", "", "", "", "o",  "a",   "_orum", "_is", "_is"]
    ];
    AdjectiveEndings[3] = [
    ["",   "",   "",   "",   "",   "_es", "_es", "_es",   "_es", "_es"],
    ["",   "",   "",   "",   "",   "_es", "_es", "_es",   "_es", "_es"],
    ["",   "",   "",   "",   "",   "ia",  "ia",  "ia",    "ia",  "ia"]
    ];
    return;
}
