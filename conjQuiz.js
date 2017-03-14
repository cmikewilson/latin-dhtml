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

var Word;
var TargetPerson, TargetNumber, TargetConj;
var Filter = [];
var Words = [];
var AllLLCapitula = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,
		     21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,99];
var AllWLChapters = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,
                     21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,
                     36,37,38,39,40,99];
var ImplementedLLCapitula = [];
var ImplementedWLChapters = [];

var ti, tf, t=0;    /* for occasional profiling */


function wordFilter (wordsIn) {
    /* remove any words not in a selected chapter */
    var wordsOut = [];
    for (var w in wordsIn) {
	var word = wordsIn[w];
	var cap = wordCap(word);
        var ch = wordCh(word);
	if ((setMember(Filter["Capitula"],cap))
            || (setMember(Filter["Chapters"],ch)))
	    wordsOut.push(word);
    }
    return wordsOut;
}

function compareAnswer () {
    /* Compute the correct answer and compare it with yours. */
    var stemId = conjStem(TargetConj);
    var stem;
    if (stemId === PRESENTSTEM)
        stem = wordPresentStem(Word);
    else stem = wordPerfectStem(Word);
    var t = conjTense(TargetConj);
    var m = conjManner(TargetConj);
    var v = conjVoice(TargetConj);
    var c = wordConj(Word);
    var end = ending[c][t][m][v][TargetNumber][TargetPerson];
    var answer = new String(stem + end);
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
    askWord();
    return false;
}

function askWord () {
    /* remove ID from previous TD; pick next word; add to table */
    /* ID must be unique, so it must be removed from the last TD
       before it can be included in the new TD.
       Also remove onKeypress action from old INPUT.
    */
    var input = document.getElementById("input")
    if (input) {
        input.removeAttribute("onKeypress");
        input.removeAttribute("id");
    }
    var result = document.getElementById("result")
    if (result)
        result.removeAttribute("id");
    if (Words.length == 0)
        Words = randomize(wordFilter(OrigWords));
    if ((Words.length > 0)
        && ((Filter["Capitula"].length + Filter["Chapters"].length) > 0)
        && (Filter["Persons"].length > 0) && (Filter["Numbers"].length > 0)
        && (Filter["Tenses"].length > 0)  && (Filter["Manners"].length > 0)
        && (Filter["Voices"].length > 0)) {
        Word = Words.pop();
        TargetPerson = randomChoose(Filter["Persons"]);
        TargetNumber = randomChoose(Filter["Numbers"]);
        var TMVs = randomize(copyArray(AllowedTMVs));
        TargetConj = null;
        for (var tmv in TMVs) {
            var tc = TMVs[tmv];
            var t = conjTense(tc);
            if (setMember(Filter["Tenses"], t)) {
                var m = conjManner(tc);
                if (setMember(Filter["Manners"], m)) {
                    var v = conjVoice(tc);
                    if (setMember(Filter["Voices"], v)) {
                        TargetConj = tc;
                        break;
                    }
                }
            }
        }
        if (TargetConj !== null) {
            addNewRow(Word, TargetPerson, TargetNumber, TargetConj);
            if (window.scrollBy)    /* scroll down -- not standard */
                window.scrollBy(0,100);
            var input = document.getElementById("input")
            input.select();
    	    input.focus();
        }
    }
    return;
}

function addNewRow(word, p, n, c) {
    /* Create the row asking for the verb conjugation. */
    var t = conjTense(c);
    var m = conjManner(c);
    var v = conjVoice(c);
    var table = document.getElementById("table");
    var tr = table.insertRow(-1);
    var th = tr.insertCell(-1);    /* This isn't really a TH */
    th.className = "ref";
    var txt = wordPresIndAct(word) + " " + wordPresIndInf(word) + " " +
              wordPresPerAct(word) + " " + wordPasPart(word);
    var str = macronsPrintable(txt);
    th.appendChild(document.createTextNode(str));

    /* Describe what we want. */
    var tdDesc = tr.insertCell(-1);
    tdDesc.className = "targetform";
    var txt = conjTitle(c);
    if (p === FIRST)       txt += " 1";
    else if (p === SECOND) txt += " 2";
    else if (p === THIRD)  txt += " 3";
    if (n === SG) txt += "SG";
    if (n === PL) {
        txt += "PL";
        tdDesc.className += " plural";
    }
    tdDesc.appendChild(document.createTextNode(txt));

    /* the INPUT field */
    var tdi = tr.insertCell(-1);
    var input = document.createElement("input");
    input.id = "input";
    /* avoid NS_ERROR_XPC_JS_THREW_STRING autocomplete bug */
    input.setAttribute("autocomplete", "off");
    input.setAttribute("type", "text");
    input.setAttribute("size", "20");
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

function dumpRow (word) {
    /* Place a conjugated word into the table */
    var table = document.getElementById("table");

    /* word header */
    var tr = table.insertRow(-1);
    tr.className = "dump";
    var th0 = tr.insertCell(-1);
    var th1 = tr.insertCell(-1);
    th1.className = "ref";
    th1.colSpan = "6";
    var txt = wordPresIndAct(word) + " " + wordPresIndInf(word) + " " +
              wordPresPerAct(word) + " " + wordPasPart(word);
    var str = macronsPrintable(txt);
    th1.appendChild(document.createTextNode(str));

    /* each conjugation */
    var presentStem = wordPresentStem(word);
    var perfectStem = wordPerfectStem(word);
    var c = wordConj(word);
    titleStemEndings = [];
    /* find a better way for this ... */
    if (setMember(Filter["Tenses"], PRESENT)
        && setMember(Filter["Manners"], INDICATIVE)
        && setMember(Filter["Voices"], ACTIVE))
        titleStemEndings.push(["PresIndAct", presentStem, ending[c][PRESENT][INDICATIVE][ACTIVE]]);
    if (setMember(Filter["Tenses"], PRESENT)
        && setMember(Filter["Manners"], IMPERATIVE)
        && setMember(Filter["Voices"], ACTIVE))
        titleStemEndings.push(["PresImpAct", presentStem, ending[c][PRESENT][IMPERATIVE][ACTIVE]]);
    if (setMember(Filter["Tenses"], FUTURE)
        && setMember(Filter["Manners"], INDICATIVE)
        && setMember(Filter["Voices"], ACTIVE))
        titleStemEndings.push(["FutIndAct", presentStem, ending[c][FUTURE][INDICATIVE][ACTIVE]]);
    if (setMember(Filter["Tenses"], IMPERFECT)
        && setMember(Filter["Manners"], INDICATIVE)
        && setMember(Filter["Voices"], ACTIVE))
        titleStemEndings.push(["ImpIndAct", presentStem, ending[c][IMPERFECT][INDICATIVE][ACTIVE]]);
    if (setMember(Filter["Tenses"], PERFECT)
        && setMember(Filter["Manners"], INDICATIVE)
        && setMember(Filter["Voices"], ACTIVE))
        titleStemEndings.push(["PerIndAct", perfectStem, ending[c][PERFECT][INDICATIVE][ACTIVE]]);
    if (setMember(Filter["Tenses"], PLUPERFECT)
        && setMember(Filter["Manners"], INDICATIVE)
        && setMember(Filter["Voices"], ACTIVE))
        titleStemEndings.push(["PpIndAct", perfectStem, ending[c][PLUPERFECT][INDICATIVE][ACTIVE]]);
    if (setMember(Filter["Tenses"], FUTUREPERFECT)
        && setMember(Filter["Manners"], INDICATIVE)
        && setMember(Filter["Voices"], ACTIVE))
        titleStemEndings.push(["FpIndAct",  perfectStem, ending[c][FUTUREPERFECT][INDICATIVE][ACTIVE]]);
    if (setMember(Filter["Tenses"], PRESENT)
        && setMember(Filter["Manners"], INDICATIVE)
        && setMember(Filter["Voices"], PASSIVE))
        titleStemEndings.push(["PresIndPas", presentStem, ending[c][PRESENT][INDICATIVE][PASSIVE]]);

    for (tse in titleStemEndings) {
        var title = titleStemEndings[tse][0];
        var stem = titleStemEndings[tse][1];
        var endings = titleStemEndings[tse][2];
        var tr = table.insertRow(-1);
        tr.className = "dump";
        var th = tr.insertCell(-1);
        th.className = "ref";
        th.appendChild(document.createTextNode(title));
        Filter["Numbers"].sort();
        Filter["Persons"].sort();
        for (var n in Filter["Numbers"]) {
            var number = Filter["Numbers"][n];
            for (var p in Filter["Persons"]) {
                var person = Filter["Persons"][p];
                var td = tr.insertCell(-1);
                var end = endings[number][person];
                var w = macronsPrintable(stem+end);
                td.appendChild(document.createTextNode(w));
            }
        }
    }
    return;
}

/*
Event Handlers
*/

function init () {
    /* read the macron vowels */
    var macronList = document.getElementById("macrons").firstChild.nodeValue;
    macrons_init(macronList);

    /* set up default Filter */
    Filter["Capitula"] = [1];
    Filter["Chapters"] = [];
    Filter["Persons"] = copyArray(AllPersons);
    Filter["Numbers"] = copyArray(AllNumbers);
    Filter["Tenses"]  = copyArray(AllTenses);
    Filter["Manners"] = copyArray(AllManners);
    Filter["Voices"]  = copyArray(AllVoices);

    /* figure out which chapters are implemented */
    for (var i in OrigWords) {
	setAdd(ImplementedLLCapitula, wordCap(OrigWords[i]));
        setAdd(ImplementedWLChapters, wordCh(OrigWords[i]));
    }

    /* disable unimplemented chapters */
    var unimplemented = setSubtract(AllLLCapitula, ImplementedLLCapitula);
    for (var i in unimplemented)
        document.getElementById("cap"+unimplemented[i]).disabled = true;
    var unimplemented = setSubtract(AllWLChapters, ImplementedWLChapters);
    for (var i in unimplemented)
        document.getElementById("ch"+unimplemented[i]).disabled = true;

    /* No Subjunctives yet */
    document.getElementById("m2").disabled = true;

    /* uncheck (for reloads), then check chapters, tenses, etc. */
    for (var i in ImplementedLLCapitula)
	document.getElementById("cap"+ImplementedLLCapitula[i]).checked=false;
    for (var i in ImplementedWLChapters)
	document.getElementById("ch"+ImplementedWLChapters[i]).checked=false;

    for (var i in AllPersons)
        document.getElementById("p"+AllPersons[i]).checked = false;
    for (var i in AllNumbers)
        document.getElementById("n"+AllNumbers[i]).checked = false;
    for (var i in AllTenses)
        document.getElementById("t"+AllTenses[i]).checked = false;
    for (var i in AllManners)
        document.getElementById("m"+AllManners[i]).checked = false;
    for (var i in AllVoices)
        document.getElementById("v"+AllVoices[i]).checked = false;

    for (var i in Filter["Capitula"])
	document.getElementById("cap"+Filter["Capitula"][i]).checked = true;
    for (var i in Filter["Chapters"])
	document.getElementById("ch"+Filter["Chapters"][i]).checked = true;
    for (var i in Filter["Persons"])
        document.getElementById("p"+Filter["Persons"][i]).checked = true;
    for (var i in Filter["Numbers"])
        document.getElementById("n"+Filter["Numbers"][i]).checked = true;
    for (var i in Filter["Tenses"])
	document.getElementById("t"+Filter["Tenses"][i]).checked = true;
    for (var i in Filter["Manners"])
	document.getElementById("m"+Filter["Manners"][i]).checked = true;
    for (var i in Filter["Voices"])
	document.getElementById("v"+Filter["Voices"][i]).checked = true;
    return;
}

function chCap (el, cap) {
    /* one of the chapter filter control checkboxes changed */
    if (cap == "all") {
        /* Select all chapters */
	Filter["Capitula"] = copyArray(ImplementedLLCapitula);
        /* check all the boxes */
        for (var i in Filter["Capitula"])
            document.getElementById("cap"+Filter["Capitula"][i]).checked = true;
    }
    else if (cap == "none") {
        /* deselect all chapters */
        Filter["Capitula"] = [];
        /* uncheck all the boxes */
        for (var i in ImplementedLLCapitula)
            document.getElementById("cap"+ImplementedLLCapitula[i]).checked = false;
    }
    else if (el.checked)
        setAdd(Filter["Capitula"], cap);
    else
        setRemove(Filter["Capitula"], cap);
    return true;
}

function chCh (el, ch) {
    /* one of the Wheelock chapter filter control checkboxes changed */
    if (ch == "all") {
        /* Select all chapters */
	Filter["Chapters"] = copyArray(ImplementedWLChapters);
        /* check all the boxes */
        for (var i in Filter["Chapters"])
            document.getElementById("ch"+Filter["Chapters"][i]).checked = true;
    }
    else if (ch == "none") {
        /* deselect all chapters */
        Filter["Chapters"] = [];
        /* uncheck all the boxes */
        for (var i in ImplementedWLChapters)
            document.getElementById("ch"+ImplementedWLChapters[i]).checked = false;
    }
    else if (el.checked)
        setAdd(Filter["Chapters"], ch);
    else
        setRemove(Filter["Chapters"], ch);
    return true;
}

function chPerson (el, person) {
    /* one of the filter control checkboxes changed */
    if (el.checked)
        setAdd(Filter["Persons"], person);
    else
        setRemove(Filter["Persons"], person);
    return true;
}

function chNumber (el, number) {
    /* one of the filter control checkboxes changed */
    if (el.checked)
        setAdd(Filter["Numbers"], number);
    else
        setRemove(Filter["Numbers"], number);
    return true;
}

function chTense (el, tense) {
    /* one of the filter control checkboxes changed */
    if (el.checked)
        setAdd(Filter["Tenses"], tense);
    else
        setRemove(Filter["Tenses"], tense);
    return true;
}

function chManner (el, manner) {
    /* one of the filter control checkboxes changed */
    if (el.checked)
        setAdd(Filter["Manners"], manner);
    else
        setRemove(Filter["Manners"], manner);
    return true;
}

function chVoice (el, voice) {
    /* one of the filter control checkboxes changed */
    if (el.checked)
        setAdd(Filter["Voices"], voice);
    else
        setRemove(Filter["Voices"], voice);
    return true;
}


function guessWords () {
    deleteAllTableRows("table");
    Words = randomize(wordFilter(OrigWords));
    askWord();
    return;
}

function dumpWords () {
    deleteAllTableRows("table");
    Words = wordFilter(OrigWords);
    for (w in Words) {
	var word = Words[w];
        dumpRow(word);
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
