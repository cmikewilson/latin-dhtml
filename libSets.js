/*
libSets - arrays as sets

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
IMPORT: ()
EXPORT: *
*/

function setify (a) {
    /* return copy of A without any duplicates */
    var b = [];
    for (var i in a)
        if (! setMember(b, a[i]))
            b.push(a[i]);
    return b;
}

function setAdd (a, item) {
    for (var i=0 ; i<a.length ; i++)
        if (a[i] == item)
	    return;
    a.push(item);
    return;
}

function setRemove (a, item) {
    var i=0;
    while (i<a.length)
        if (a[i] == item)
	    a.splice(i,1);
        else
            i++;
    return;
}

function setMember (a, item) {
    var result;
    for (var i in a)
        if (a[i] == item)
            return true;
    return false;
}

function setUnion (a, b) {
    var c = [];
    for (var i=0 ; i<a.length ; i++)
        c.push(a[i]);
    for (var j=0 ; j<b.length ; j++)
        c.push(b[j]);
    return setify(c);
}

function setIntersect (a, b) {
    /* this is a predicate */
    for (var i=0 ; i<a.length ; i++)
        for (var j=0 ; j<b.length ; j++)
	    if (a[i] == b[j])
	        return true;
    return false;
}

function setIntersection (a, b) {
    var c = [];
    for (var i in a) {
        var ai = a[i];
	for (var j in b) {
	    var bj = b[j];
	    if (bj == ai) {
	        c.push(ai);
		break;
	    }
	}
    }
    return c;
}

function setSubtract (a, b) {
    /* C = A - B */
    var c = [];
    for (var i in a)
        if (! setMember(b, a[i]))
	    c.push(a[i]);
    return c;
}

function testSet () {
    var a = [1,2,3,4,5,6];
    var b = ["abc", "def", "ghi", "jkl", "mno"];
    if (! setMember(a,1))
        alert("testSet: 1 should be in A");
    if (! setMember(a, 5))
        alert("testSet: 5 should be in A");
    if (! setMember(a, 6))
        alert("testSet: 6 should be in A");
    if (setMember(a, 7))
        alert("testSet: 7 should not be in A");
    if (setMember(a, 0))
        alert("testSet: 0 should not be in A");

    if (! setMember(b, "abc"))
        alert("testSet: abc should be in B");
    if (! setMember(b, "def"))
        alert("testSet: def should be in B");
    if (! setMember(b, "mno"))
        alert("testSet: mno should be in B");
    if (setMember(b, "pqr"))
        alert("testSet: pqr should not be in B");

    setAdd(a,12);
    if (! setMember(a,12))
        alert("testSet: 12 should be in A");
    setAdd(b,"xyz");   
    if (! setMember(b,"xyz"))
        alert("testSet: xyz should be in B");

    setRemove(a,1);
    if (setMember(a,1))
        alert("testSet: 1 should not be in A");
    setRemove(b,"ghi");
    if (setMember(b,"ghi"))
        alert("testSet: ghi should not be in B");

    var a = [1,2,3,4];
    var b = [5,6,7,8];
    var c = setUnion(a,b);
    if (! setMember(c,1))
        alert("testSet setUnion: 1 should be in C");
    if (! setMember(c,8))
        alert("testSet setUnion: 8 should be in C");
    if (c.length != 8)
        alert("testSet setUnion: C should be of length 8");
}
