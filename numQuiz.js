/*
numQuiz - Quizzing Latin Numbers

Written in 2005 by Mike Wilson, cmikewilson@gmail.com

To the extent possible under law, the author(s) have dedicated all
copyright and related and neighboring rights to this software to the
public domain worldwide. This software is distributed without any
warranty.

You should have received a copy of the CC0 Public Domain Dedication
along with this software. If not, see
<http://creativecommons.org/publicdomain/zero/1.0/>.
*/

var CARDINAL=0, ORDINAL=1;
var Type, From, To, Number, Answer;

function compareAnswer () {
    /* Compute the correct answer and compare it with yours. */
    var answer = Answer;
    var entered = document.getElementById("input").value;
    var msg;
    var tdr = document.getElementById("result");
    if (macronsComparable(answer.toLowerCase()) == entered.toLowerCase()) {
        msg = "Correct: " + macronsPrintable(answer);
	tdr.className = "correct";
    }
    else {
        msg = "Incorrect: " + macronsPrintable(answer);
	tdr.className = "incorrect";
    }
    tdr.appendChild(document.createTextNode(msg));
    askNumber();
    return false;
}

function translateNumber (n) {
    /* returns word for number n */
    /* returns "" if n==0  */
    var trans;
    if (Type == CARDINAL) {
        var onesNames = ["", "_unus", "duo", "tr_es", "quattuor", "qu_inque",
                         "sex", "septem", "oct_o", "novem"];
        var teensNames = ["decem", "_undecim", "duodecim", "tr_edecim",
                          "quattuordecim", "qu_indecim", "s_edecim",
                          "septendecim"];
        var tensNames = ["", "decem", "v_igint_i", "tr_igint_a",
                         "quadr_agint_a", "qu_inqu_agint_a", "sex_agint_a",
                         "septu_agint_a", "oct_ogint_a", "n_on_agint_a"];
        var hundredsNames = ["", "centum", "ducent_i", "trecent_i",
                             "quadringent_i", "qu_ingent_i", "sescent_i",
                             "septingent_i", "octingent_i", "n_ongent_i"];
	/* 1-9 */
        if (n < 10)
            trans = onesNames[n];
	/* 10-17 */
	else if (n < 18) {
            var ones = n%10;
            trans = teensNames[ones];
        }
	/* 18-97 */
        else if (n < 98) {
	    var tens = Math.floor(n/10);
            var tensT = tensNames[tens];
	    var tensP = tens + 1;
            var tensPT = tensNames[tensP];
	    var ones = n%10;
            if (ones == 0) trans = tensT;
            else if (ones == 8) trans = "duod_e" + tensPT;
	    else if (ones == 9) trans = "_und_e" + tensPT;
	    else {
		var onesT = onesNames[ones];
		trans = tensT + " " + onesT;
	    }
        }
        /* 98-99 */
        else if (n < 100) {
            if (n == 98)
                trans = "duod_ecentum";
            else
                trans = "_und_ecentum";
        }
	/* 100-997 */
        else if (n < 998) {
	    var hundreds = Math.floor(n/100);
	    var hundredsT = hundredsNames[hundreds];
	    var tens = Math.floor((n%100)/10);
	    var ones = (n%100)%10;

            if ((tens==9) && ((ones==8) || (ones==9))) {
                var hundredsP = hundreds + 1;
                var hundredsPT = hundredsNames[hundredsP];
                if (ones == 8)
                    trans = "duod_e" + hundredsPT;
                else
                    trans = "_und_e" + hundredsPT;
            }
            else
                if ((tens==0) && (ones==0))
                    trans = hundredsT;
                else
                    trans = hundredsT + " " + translateNumber(tens*10+ones);
        }
/*
milia
*/
        else
            trans = "out of range";
    }
    /* ordinals */
    else {
        var onesNames = ["", "pr_imus", "secundus", "tertius", "qu_artus",
                         "qu_intus", "sextus", "septimus", "oct_avus",
                         "n_onus"];
        var teensNames = ["decimus", "_undecimus", "duodecimus",
                          "tertius decimus", "qu_artus decimus",
                          "qu_intus decimus", "sextus decimus",
                          "septimus decimus"];
        var tensNames = ["", "", "v_ic_esimus", "tr_ic_esimus",
                         "quadr_ag_esimus", "qu_inqu_ag_esimus",
                         "sex_ag_esimus", "septu_ag_esimus",
                         "oct_og_esimus", "n_on_ag_esimus"];
        var hundredsNames = ["", "cent_esimus", "ducent_esimus",
                             "trecent_esimus", "quadringent_esimus",
                             "qu_ingent_esimus", "sescent_esimus",
                             "septingent_esimus", "octingent_esimus",
                             "n_ongent_esimus"];

	/* 1st-9th */
        if (n < 10)
            trans = onesNames[n];
	/* 10th-17th */
	else if (n < 18) {
            var ones = n%10;
            trans = teensNames[ones];
        }
	/* 18th-97th */
        else if (n < 98) {
	    var tens = Math.floor(n/10);
            var tensT = tensNames[tens];
	    var tensP = tens + 1;
            var tensPT = tensNames[tensP];
	    var ones = n%10;
            if (ones == 0) trans = tensT;
            else if (ones == 8) trans = "duod_e" + tensPT;
	    else if (ones == 9) trans = "_und_e" + tensPT;
	    else {
		var onesT = onesNames[ones];
		trans = tensT + " " + onesT;
	    }
        }
        /* 98th-99th */
        else if (n < 100) {
            if (n == 98)
                trans = "duod_ecent_esimus";
            else
                trans = "_und_ecent_esimus";
        }
	/* 100th-997th */
        else if (n < 998) {
	    var hundreds = Math.floor(n/100);
	    var hundredsT = hundredsNames[hundreds];
	    var tens = Math.floor((n%100)/10);
	    var ones = (n%100)%10;

            if ((tens==9) && ((ones==8) || (ones==9))) {
                var hundredsP = hundreds + 1;
                var hundredsPT = hundredsNames[hundredsP];
                if (ones == 8)
                    trans = "duod_e" + hundredsPT;
                else
                    trans = "_und_e" + hundredsPT;
            }
            else
                if ((tens==0) && (ones==0))
                    trans = hundredsT;
                else
                    trans = hundredsT + " " + translateNumber(tens*10+ones);
        }
/*
        if (n == 1000) trans = "m_ill_esimus";
        if (n == 2000) trans = "bis m_ill_esimus";
*/
        else
            trans = "out of range";
    }
    return trans;
}

function askNumber () {
    /* remove ID from previous TD; pick next word; add to table */
    /* ID must be unique, so it must be removed from the last TD
       before it can be included in the new TD.
       Also remove onKeypress action from old INPUT.
    */
    Number = From + Math.floor(Math.random() * (To - From))
    Answer = translateNumber(Number);
    var input = document.getElementById("input")
    if (input) {
        input.removeAttribute("onKeypress");
        input.removeAttribute("id");
    }
    var result = document.getElementById("result")
    if (result)
        result.removeAttribute("id");

    addNewRow(Number);
    if (window.scrollBy)    /* scroll down -- not standard */
        window.scrollBy(0,100);
    var input = document.getElementById("input")
    input.select();
    input.focus();
    return;
}

function addNewRow(n) {
    /* Create the row asking for the number. */
    var table = document.getElementById("table");
    var tr = table.insertRow(-1);
    var th = tr.insertCell(-1);    /* This isn't really a TH */
    th.className = "ref";
    th.appendChild(document.createTextNode(n));

    /* the INPUT field */
    var tdi = tr.insertCell(-1);
    var input = document.createElement("input");
    input.id = "input";
    /* avoid NS_ERROR_XPC_JS_THREW_STRING autocomplete bug */
    input.setAttribute("autocomplete", "off");
    input.setAttribute("type", "text");
    input.setAttribute("size", "28");
    input.onkeypress = checkKeypress;
    tdi.appendChild(input);

    /* The result field, where we write "Correct", etc. */
    var tdr = tr.insertCell(-1);
    tdr.id = "result";
    return;
}

function deleteAllTableRows (id) {
    var table = document.getElementById(id);
    var i;
    while (table.rows.length != 0) 
        table.deleteRow(-1);
    return;
}

function showRow (n) {
    /* Place a number into the table */
    var table = document.getElementById("table");
    /* header */
    var tr = table.insertRow(-1);
    tr.className = "dump";
    var th = tr.insertCell(-1);
    th.className = "ref";
    th.appendChild(document.createTextNode(n));
    var td = tr.insertCell(-1);

    /* number */
    var str = macronsPrintable(translateNumber(n));
    td.appendChild(document.createTextNode(str));
    return;
}

/*
Event Handlers
*/

function init () {
    /* read the macron vowels */
    var macronList = document.getElementById("macrons").firstChild.nodeValue;
    macrons_init(macronList);

    /* initialize */
    Type = CARDINAL;
    From = 1;
    To = 999;

    var card = document.getElementById("cardinal");
    card.checked = true;
    var ord = document.getElementById("ordinal");
    ord.checked = false;

    var from = document.getElementById("from");
    from.value = From;
    var to = document.getElementById("to");
    to.value = To;

    return;
}

function chType (el) {
    if (el.id == "cardinal") {
	Type = CARDINAL;
	el.checked = true;
	document.getElementById("ordinal").checked = false;
    }
    else {
	Type = ORDINAL;
	el.checked = true;
	document.getElementById("cardinal").checked = false;
    }
    return;
}

function chFrom (el) {
    From = (1*el.value);
    return;
}

function chTo (el) {
    To = (1*el.value);
    return;
}

function guessNumbers () {
    deleteAllTableRows("table");
    askNumber();
    return;
}

function show () {
    deleteAllTableRows("table");
    for (var i=From ; i<=To ; i++) {
        showRow(i);
    }
    return;
}

function checkKeypress(event) {
    /* Check answer after ENTER keypress */
    if ((event) && (event.keyCode == 13))
        compareAnswer();
    else if ((window.event) && (window.event.keyCode == 13))
        compareAnswer();
    else
        /* ignore */;
    return true;
}
