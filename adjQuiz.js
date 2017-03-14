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


var M=0,F=1,N=2;
var NOM=0,ACC=1,GEN=2,DAT=3,ABL=4;
var IndexCaps, IndexQuantities, IndexDecls;
var FilterCaps=[], FilterForms=[], FilterDecls=[],
    FilterGenders=[], FilterQuantities=[];
var ImplementedChapters=[], MaxCap=35;
var Forms = [NOM,ACC,GEN,DAT,ABL];
var Decls = [1,3];
var Genders = [M,F,N];
var Quantities = [SG,PL];
var Words=[], Word;
var TargetQuantity, TargetGender, TargetForm;

function printableGender (g) {
    return ["m","f","n"][g];
}

function printableForm (f) {
    return ["nom","acc","gen","dat","abl"][f];
}

function printableQuantity (sp) {
    if (sp.length == 1)
        return ["sg","pl"][sp];
    else if (sp.length == 2)
        return "sp";
    return "";
}

function makeIndices (adjs) {
    IndexCaps = [];
    for (var i=1 ; i<=MaxCap ; i++)
        IndexCaps[i] = [];
    IndexDecls = [];
    for (var i in Decls)
        IndexDecls[Decls[i]] = [];
    IndexQuantities = [];
    IndexQuantities[SG] = [];
    IndexQuantities[PL] = [];

    for (var i in adjs) {
        var adj = adjs[i];

        /* chapters */
        var cap = adjCap(adj);
        IndexCaps[cap].push(i);
        /* implemented chapters */
        setAdd(ImplementedChapters,cap);

        /* declensions */
        var decl = adjDecl(adj);
        IndexDecls[decl].push(i);

        /* quantities */
        /* sp is an array: [SG], [PL], or [SG,PL] */
        var sp = adjSP(adj);
        for (var j in sp)
            if (sp[j] == SG)
                IndexQuantities[SG].push(i);
            else if (sp[j] == [PL])
                IndexQuantities[PL].push(i);
    }
    return;
}

function decline (adj, gender, quantity, form) {
    var type = adjType(adj);
    var base = adjBase(adj);
    var ending = AdjectiveEndings[type][gender][(quantity*5)+form];
    return base+ending;
}

function filter () {
    var caps=[], quans=[], decls=[];
    for (var i in FilterCaps)
        caps = caps.concat(IndexCaps[FilterCaps[i]])
    for (var i in FilterQuantities)
        quans = quans.concat(IndexQuantities[FilterQuantities[i]]);
    for (var i in FilterDecls)
        decls = decls.concat(IndexDecls[FilterDecls[i]]);
    var indices = setIntersection(caps,quans);
    indices = setIntersection(indices,decls);
    var b = [];
    for (var i in indices)
        b.push(Adjectives[indices[i]]);
    return b;
}

function dumpRow(table, adj) {
    var heading = macronsPrintable(adjName(adj) + " " + adjEnds(adj));
    if (adjSP(adj) == PL)
        heading += " pl";
    else if (adjSP(adj) == SG)
        heading += " sg";
    var quantities = adjSP(adj);
    for (var i in Genders) {
        var gender = Genders[i];
        if (!setMember(FilterGenders,gender))
            continue;
        heading2 = printableGender(gender);
        var tr = table.insertRow(-1);
        var t1 = tr.insertCell(-1);
        if (heading) {
            t1.appendChild(document.createTextNode(heading));
            t1.className = "ref";
            heading = false;
        }
        for (var j in Quantities) {
            quantity = Quantities[j];
            if (!setMember(FilterQuantities,quantity))
                continue;
            var th = tr.insertCell(-1);
            if (heading2) {
                th.appendChild(document.createTextNode(heading2));
                th.className = "ref";
                heading2 = false;
            }
            if (setMember(quantities,quantity))
                for (var k in Forms) {
                    var form = Forms[k];
                    var td = tr.insertCell(-1);
                    var txt = macronsPrintable(decline(adj,gender,quantity,form));
                    td.appendChild(document.createTextNode(txt));
                }
            else
                for (var k in Forms)
                    var t = tr.insertCell(-1);
        }
    }
    return;
}

function dumpWords () {
    var table = document.getElementById("table");
    deleteAllTableRows (table);
    var adjs = filter();    /* new subset of Adjs */
    for (var i in adjs)
        dumpRow(table, adjs[i]);
    return;
}

function tableAskWord (table, refText, targetText) {
    var tr = table.insertRow(-1);
    var th = tr.insertCell(-1);
    th.className = "ref";
    th.appendChild(document.createTextNode(refText));
    var td = tr.insertCell(-1);
    td.className = "targetform";
    td.appendChild(document.createTextNode(targetText));
    var tdi = tr.insertCell(-1);
    var input = document.createElement("input");
    input.id = "input";
    /* avoid NS_ERROR_XPC_JS_THREW_STRING autocomplete bug */
    input.setAttribute("autocomplete", "off");
    input.setAttribute("type", "text");
    input.setAttribute("size", "20");
    input.onkeypress = checkKeypress;
    tdi.appendChild(input);
    var tdr = tr.insertCell(-1);
    tdr.id = "result";
    return;
}

function guessWord () {
    var input = document.getElementById("input")
    if (input) {
        input.removeAttribute("onKeypress");
        input.removeAttribute("id");
    }
    var result = document.getElementById("result")
    if (result)
        result.removeAttribute("id");
    if (Words.length == 0)
        Words = randomize(filter());
    if ((Words.length > 0) && (FilterQuantities.length > 0)
                           && (FilterForms.length > 0)
                           && (FilterGenders.length > 0)) {
        Word = Words.pop();
        TargetQuantity = randomChoose(FilterQuantities);
        TargetForm = randomChoose(FilterForms);
        TargetGender = randomChoose(FilterGenders);
        var refText = adjName(Word)+" "+adjEnds(Word);
        var targetText = "";
        tableAskWord(Word, refText, targetText);
        if (window.scrollBy)    /* scroll down -- not standard */
            window.scrollBy(0,100);
        var input = document.getElementById("input")
        input.select();
    	input.focus();
    }
    return;
}

function resetControls () {
    FilterCaps = [1];
    FilterForms = [NOM,ACC,GEN,DAT,ABL];
    FilterDecls = [1,3];
    FilterGenders = [M,F,N];
    FilterQuantities = [SG,PL];

    /* caps */
    for (var i=1 ; i<=MaxCap ; i++) {
        var el = document.getElementById("cap"+i)
        el.checked = false;
        if (!setMember(ImplementedChapters,i))
            el.disabled = true;
    }
    for (var i in FilterCaps)
        document.getElementById("cap"+FilterCaps[i]).checked = true;

    /* forms */
    for (var i in Forms)
        document.getElementById("f"+printableForm(Forms[i])).checked = false;
    for (var i in FilterForms)
        document.getElementById("f"+printableForm(Forms[i])).checked = true;

    /* decls */
    for (var i in Decls)
        document.getElementById("d"+Decls[i]).checked = false;
    for (var i in FilterDecls)
        document.getElementById("d"+FilterDecls[i]).checked = true;

    /* genders */
    for (var i in Genders) {
        var id = "g"+printableGender(Genders[i]);
        document.getElementById(id).checked = false;
    }
    for (var i in FilterGenders) {
        var id = "g"+printableGender(FilterGenders[i]);
        document.getElementById(id).checked = true;
    }

    /* quantities */
    for (var i in Quantities) {
        var id = printableQuantity(Quantities[i]);
        document.getElementById(id).checked = false;
    }
    for (var i in FilterQuantities) {
        var id = printableQuantity(FilterQuantities[i]);
        document.getElementById(id).checked = true;
    }

    return;
}

function init () {
    var macronList = document.getElementById("macrons").firstChild.nodeValue;
    macrons_init(macronList);
    adjListInit();
    makeIndices(Adjectives);
    resetControls();
    return;
}

function chCap (el, cap) {
    /* one of the chapter filter control checkboxes changed */
    if (cap == "all") {
        /* Select all chapters */
	FilterCaps = copyArray(ImplementedChapters);
        /* check all the boxes */
        for (var i in FilterCaps)
            document.getElementById("cap"+FilterCaps[i]).checked = true;
    }
    else if (cap == "none") {
        /* deselect all chapters */
        FilterCaps = [];
        /* uncheck all the boxes */
        for (var i in ImplementedChapters)
            document.getElementById("cap"+ImplementedChapters[i]).checked = false;
    }
    else if (el.checked)
        setAdd(FilterCaps, cap);
    else
        setRemove(FilterCaps, cap);
    return true;
}

function chDecl (el, decl) {
    /* one of the Declension filter control checkboxes changed */
    if (decl == "all") {
        /* Select all decls */
	FilterDecls = copyArray(Decls);
        /* check all the boxes */
        for (var i in Decls)
            document.getElementById("d"+Decls[i]).checked = true;
    }
    else if (decl == "none") {
        /* deselect all decls */
        FilterDecls = [];
        /* uncheck all the boxes */
        for (var i in Decls)
            document.getElementById("d"+Decls[i]).checked = false;
    }
    else if (el.checked)
        setAdd(FilterDecls, decl);
    else
        setRemove(FilterDecls, decl);
    return true;
}

function chForm (el, form) {
    /* one of the Form filter control checkboxes changed */
    if (form == "all") {
        FilterForms = copyArray(Forms);
        for (var i in Forms) {
            var id = "f"+printableForms(Forms[i]);
            document.getElementById(id).checked = true;
        }
    }
    else if (form == "none") {
        FilterForms = [];
	for (var i in Forms) {
            var id = "f"+printableForms(Forms[i]);
	    document.getElementById(id).checked = false;
        }
    }
    else if (el.checked)
        setAdd(FilterForms, form);
    else
        setRemove(FilterForms, form);
    return true;
}

function chGender (el, gender) {
    if (el.checked)
        setAdd(FilterGenders, gender);
    else
        setRemove(FilterGenders, gender);
    return true;
}

function chQuan (el, quantity) {
    if (el.checked)
        setAdd(FilterQuantities, quantity);
    else
        setRemove(FilterQuantities, quantity);
    return true;
}

function copyArray (a) {
    var b = [];
    for (var i in a)
        b.push(a[i]);
    return b;
}

function deleteAllTableRows (table) {
    var i;
    while (table.rows.length != 0) 
        table.deleteRow(-1);
    return;
}
