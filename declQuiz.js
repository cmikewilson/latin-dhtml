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

/*
- Would be nice to not re-ask the same thing.
- Can you delete globals?  Seems like I saw in the ECMAScript spec
  that one may not.
? Declension ending init code should go in origWD.js?
...
? Add adjectives here?  (I don't think so.  They should be separate.)
- dumpRow is slow and called repeatedly in dumpWords. (Not important.)
  The logic could be improved with indices, but IO is the slow part.
  macronPrintable is a little slow.
? Looks like string[n] isn't allowed.  Mozilla is fine with it,
  but IE chokes.  Can't find it in the ECMA spec.  Must use .charAt(n); weird.
- Just heard about console.log("foo", arg) for debugging.
*/

// IMPORT from nounList:
//     OrigWords, wordNom, wordGenEnd, wordGender, wordCap,
//     M, F, N, MF, SP, SG, PL
// IMPORT from sets: *
// IMPORT from random: *
// IMPORT from macrons: macrons_init, macronsPrintable, macronsComparable

// the word, whether it's singular or plural, and it's target declension
var Word, TargetSP, TargetForm;
// Filters are the limits on word selection made in the html box
var Filters = [];
// Words are those that made it through the filters
var Words = [];
var AllChapters = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,
		   21,22,23,24,25,26,27,28,29,30,31,32,33,34,35];
var ImplementedChapters = [];
var AllDecls = [1,2,3,4,5,0];
var AllForms = ["nom", "acc", "gen", "dat", "abl"];
var AllGenders = [M, F, N];
var AllQuantities = [SG, PL];
// DeclensionEndings[declension type][sg/pl][nom/.../abl]
var DeclensionEndings = [];

var ti, tf, t=0;    // for occasional profiling


function wordEnding (word, sp, form) {
    // return the declined word ending
    return DeclensionEndings[wordDecl(word)][sp][form];
}

function wordDecline (word, sp, form) {
    // returns a list of declined words
    // (might have alternates: filiis/filiabus)
    var opt = wordDeclOpt(word);
    // wordDeclOpt allows for a couple common variations in the declensions
    // opt=0 standard;  opt=1 nom=base; opt=2 nom=base, acc=base
    if ((opt > 0) && (sp === SG)) {
        if ((opt >= 1) && (form == "nom"))
            return [wordNom(word)];
        if ((opt == 2) && (form == "acc"))
            return [wordNom(word)];
    }
    var ending  = wordEnding(word, sp, form);
    var endings;
    var i;
    var words=[];

    if (isArray(ending))
        endings=ending
    else
        endings=[ending];

    for (i=0 ; i<endings.length ; i++)
        words[words.length] = wordBase(word) + endings[i];
    return words;
}

function pluralisTantum(word) {
    // is the word plural only?
    return (wordSP(word) === PL);
}

function fillDeclensionEndingsArray (dp) {
    // DeclensionEndingsPrep is a table of declension endings.
    // It's in a format that's easy to read and write,
    // but a format like: DeclensionEndings["2a"][SG]["acc"]
    // is better for program use.

    var d, decl, sg, pl, f;
    for (d=0 ; d<DeclensionEndingsPrep.length ; d++) {
        decl = DeclensionEndingsPrep[d][0];
	sg   = DeclensionEndingsPrep[d][1];
	pl   = DeclensionEndingsPrep[d][2];
	DeclensionEndings[decl] = [];
	DeclensionEndings[decl][SG] = [];
	DeclensionEndings[decl][PL] = [];
	for (f=0 ; f<AllForms.length ; f++) {
	    DeclensionEndings[decl][SG][AllForms[f]] = sg[f];
	    DeclensionEndings[decl][PL][AllForms[f]] = pl[f];
	}
    }
    delete DeclensionEndingsPrep;
    return;
}

function wordFilter (a, filters) {
    // remove any words not of the selected chapters and declensions

    var i;
    var b = [];
    for (i=0 ; i<a.length ; i++) {
        var word = a[i];
        var cap = wordCap(word);
        var declN = +(wordDecl(word).charAt(0));
        var gender = wordGender(word);
        if (setMember(filters["caps"], cap))
            if (setMember(filters["decls"], declN)) {
                var genders = gender.split("");
                if (setIntersect(filters["genders"], genders))
		    if (!(pluralisTantum(word)
 			  && !setMember(filters["quantity"], PL)))
    	                b.push(word);
            }
    }
    return b;
}

/*
function copyArray (a) {
    var b = [];
    for (var i in a)
        b.push(a[i]);
    return b;
}
*/

function compareAnswer () {
    // Compute the correct answer and compare it with yours.

    var answers = wordDecline(Word, TargetSP, TargetForm);
    var entered = document.getElementById("input").value;
    var tdResult = document.getElementById("result");
    var flag = 0;
    var msg, i, answer;
    for (i=0 ; i<answers.length ; i++) {
        answer = answers[i];
        if (macronsComparable(answer.toLowerCase()) == entered.toLowerCase()) {
            msg = "Correct: " + macronsPrintable(answer);
	    tdResult.className = "correct";
            flag = 1;
            break;
        }
    }
    if (! flag) {
        msg = "Incorrect: " + macronsPrintable(answer);
	tdResult.className = "incorrect";
    }
    tdResult.appendChild(document.createTextNode(msg));
    askWord();
    return false;
}

function askWord () {
    // remove ID from previous TD; pick next word; add to table
    // ID must be unique, so it must be removed from the last TD
    // before it can be included in the new TD.
    // Also remove onKeypress action from old INPUT.

    var input = document.getElementById("input")
    if (input) {
        input.removeAttribute("onKeypress");
        input.removeAttribute("id");
    }
    var result = document.getElementById("result")
    if (result)
        result.removeAttribute("id");
    if (Words.length == 0)
        Words = randomize(wordFilter(OrigWords, Filters));
    if ((Words.length > 0) && (Filters["quantity"].length > 0)
                           && (Filters["forms"].length > 0)) {
        Word = Words.pop();
        TargetSP = randomChoose(Filters["quantity"]);
        if (pluralisTantum(Word))
            TargetSP = PL;
        TargetForm = randomChoose(Filters["forms"]);
        addNewRow(Word, TargetSP, TargetForm);
        if (window.scrollBy)    /* scroll down -- not standard */
            window.scrollBy(0,100);
        var input = document.getElementById("input")
        input.select();
    	input.focus();
    }
    return;
}

function deleteAllTableRows (id) {
    var table = document.getElementById(id);
    var i;
    while (table.rows.length != 0) 
        table.deleteRow(-1);
    return;
}

function addNewRow (w, q, tf) {
    // Show the sg nominative, sg genitive ending, and gender of the word.

    var table = document.getElementById("table");
    var tr = table.insertRow(-1);
    var th = tr.insertCell(-1);    /* This isn't really a TH */
    th.className = "ref";
    var txt = macronsPrintable(wordNom(w))
      + " " + macronsPrintable(wordGenEnd(w))
      + " " + wordGender(w);
    if (pluralisTantum(w))
	txt = txt + " pl";
    th.appendChild(document.createTextNode(txt));
    /* the target word form and sg/pl. */
    var tdtf = tr.insertCell(-1);
    tdtf.className = "targetform";
    if (q == PL)
        tdtf.className += " plural";
    tdtf.appendChild(document.createTextNode(q+" "+tf+":"));
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

function dumpRow (word, sg, pl) {
    // Add two (or one) rows filled with all the declensions

    var table = document.getElementById("table");
    if (sg) {
        var tr = table.insertRow(-1);
	tr.className = "dump";
	/* header */
	var th = tr.insertCell(-1);
	th.className = "ref";
	var txt = macronsPrintable(wordNom(word))
	          + " " + macronsPrintable(wordGenEnd(word))
		  + " " + wordGender(word);
        th.appendChild(document.createTextNode(txt));
	/* body */
        for (var i in AllForms)
            if (setMember(Filters["forms"], AllForms[i])) {
                var td = tr.insertCell(-1);
                var words = wordDecline(word,SG,AllForms[i]);
                var str = macronsPrintable(words[0]);
                td.appendChild(document.createTextNode(str));
            }
    }
    if (pl) {
        var tr = table.insertRow(-1);
	tr.className = "dump";
	if (!sg) {
	    var th = tr.insertCell(-1);
	    th.className = "ref";
	    var txt = macronsPrintable(wordNom(word))
	              + " " + macronsPrintable(wordGenEnd(word))
		      + " " + wordGender(word);
            if (pluralisTantum(word))
	        txt = txt + " pl";
            th.appendChild(document.createTextNode(txt));
	}
	else
	    tr.insertCell(-1);
        for (var i in AllForms)
            if (setMember(Filters["forms"], AllForms[i])) {
                var td = tr.insertCell(-1);
                var words = wordDecline(word,PL,AllForms[i]);
                var str = macronsPrintable(words[0]);
                td.appendChild(document.createTextNode(str));
            }
    }
    return;
}


// Event Handlers

function init () {
    // read the macron vowels; I don't know how to get them otherwise
    var macronList = document.getElementById("macrons").firstChild.nodeValue;
    macrons_init(macronList);
    fillDeclensionEndingsArray();

    // set up default Filters
    Filters["caps"] = [1];
    Filters["decls"] = copyArray(AllDecls);
    Filters["forms"] = copyArray(AllForms);
    Filters["genders"] = copyArray(AllGenders);
    Filters["quantity"] = copyArray(AllQuantities);

    // figure out which chapters are implemented
    for (var i in OrigWords)
	setAdd(ImplementedChapters, wordCap(OrigWords[i]));

    // disable unimplemented chapters
    var unimplemented = setSubtract(AllChapters, ImplementedChapters);
    for (var i in unimplemented)
        document.getElementById("cap"+unimplemented[i]).disabled = true;

    // uncheck (for reloads), then check chapters, decls, etc.
    for (var i in ImplementedChapters)
	document.getElementById("cap"+ImplementedChapters[i]).checked = false;
    for (var i in AllDecls)
        document.getElementById("d"+AllDecls[i]).checked = false;
    for (var i in AllForms)
        document.getElementById("f"+AllForms[i]).checked = false;
    for (var i in AllGenders)
	document.getElementById("g"+AllGenders[i]).checked = false;
    for (var i in AllQuantities)
	document.getElementById(AllQuantities[i]).checked = false;

    for (var i in Filters["caps"])
	document.getElementById("cap"+Filters["caps"][i]).checked = true;
    for (var i in Filters["decls"])
        document.getElementById("d"+Filters["decls"][i]).checked = true;
    for (var i in Filters["forms"])
        document.getElementById("f"+Filters["forms"][i]).checked = true;
    for (var i in Filters["genders"])
	document.getElementById("g"+Filters["genders"][i]).checked = true;
    for (var i in Filters["quantity"])
	document.getElementById(Filters["quantity"][i]).checked = true;
    return;
}

function chCap (el, cap) {
    // one of the chapter filter control checkboxes changed
    if (cap == "all") {
        // Select all chapters
	Filters["caps"] = copyArray(ImplementedChapters);
        // check all the boxes
        for (var i in Filters["caps"])
            document.getElementById("cap"+Filters["caps"][i]).checked = true;
    }
    else if (cap == "none") {
        // deselect all chapters
        Filters["caps"] = [];
        // uncheck all the boxes
        for (var i in ImplementedChapters)
            document.getElementById("cap"+ImplementedChapters[i]).checked = false;
    }
    else if (el.checked)
        setAdd(Filters["caps"], cap);
    else
        setRemove(Filters["caps"], cap);
    return true;
}

function chDecl (el, decl) {
    // one of the Declension filter control checkboxes changed
    if (decl == "all") {
        /* Select all decls */
	Filters["decls"] = copyArray(AllDecls);
        /* check all the boxes */
        for (var i in Filters["decls"])
            document.getElementById("d"+Filters["decls"][i]).checked = true;
    }
    else if (decl == "none") {
        /* deselect all decls */
        Filters["decls"] = [];
        /* uncheck all the boxes */
        for (var i in AllDecls)
            document.getElementById("d"+AllDecls[i]).checked = false;
    }
    else if (el.checked)
        setAdd(Filters["decls"], decl);
    else
        setRemove(Filters["decls"], decl);
    return true;
}

function chForm (el, form) {
    // one of the Form filter control checkboxes changed
    if (form == "all") {
        Filters["forms"] = copyArray(AllForms);
        for (var i in Filters["forms"])
            document.getElementById("f"+Filters["forms"][i]).checked = true;
    }
    else if (form == "none") {
        Filters["forms"] = [];
	for (var i in AllForms)
	    document.getElementById("f"+AllForms[i]).checked = false;
    }
    else if (el.checked)
        setAdd(Filters["forms"], form);
    else
        setRemove(Filters["forms"], form);
    return true;
}

function chGender (el, gender) {
    if (el.checked)
        setAdd(Filters["genders"], gender);
    else
        setRemove(Filters["genders"], gender);
    return true;
}

function chCount (el, count) {
    if (el.checked)
        setAdd(Filters["quantity"], count);
    else
        setRemove(Filters["quantity"], count);
    return true;
}

function guessWords () {
    deleteAllTableRows("table");
    Words = randomize(wordFilter(OrigWords, Filters));
    askWord();
    return;
}

function dumpWords () {
//alert("caps: "+Filters["caps"]+" decls:"+Filters["decls"]+" forms:"+Filters["forms"]+" genders:"+Filters["genders"]+" quantity:"+Filters["quantity"]);
    deleteAllTableRows("table");
    Words = wordFilter(OrigWords, Filters);
    if (Filters["quantity"] == [])
        return;
    else {
        var sg = setMember(Filters["quantity"], SG);
        var pl = setMember(Filters["quantity"], PL);
        for (var i in Words) {
            var word = Words[i];
	    if (pluralisTantum(word))
		dumpRow(word, false, pl);
            else
                dumpRow(word, sg, pl);
        }
    }
    return;
}

function checkKeypress(event) {
    // Check answer after ENTER keypress
    if ((event) && (event.keyCode == 13))
        compareAnswer();
    else if ((window.event) && (window.event.keyCode == 13))
        compareAnswer();
    else
        /* ignore */;
    return true;
}
