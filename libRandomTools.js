/*
libRandomTools - choosing a random item from a list

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
EXPORT: randomChoose, randomize
*/

function randomChoose (a) {
    /* Given an array A, choose and return one element. */
    var result;
    var len = a.length;
    result = undefined;
    if (len != 0) {
        var i = Math.floor(Math.random() * len);
        result = a[i];
    }
    return result;
}

function randomize (a) {
    /* Given an array A, take all the elements, mix them up,
       and return them in a new array D.
    */
    var len = a.length;
    var b = new Array(len);
    var c = new Array(len);
    var d = new Array(len);
    /* b = array of indices: 0,1,2,... */
    var i, j=0;
    for (i=0 ; i<len ; i++)
        b[i] = j++;
    /* c = indices mixed up, 8,1,4,... */
    for (i=0 ; i<len ; i++) {
        j = Math.floor(Math.random() * b.length);
	c[i] = b[j];
	b.splice(j,1);
    }
    /* d = array with original elements, mixed up */
    for (i=0 ; i<len ; i++)
	d[i] = a[c[i]];
    delete b;
    delete c;
    return (d);
}

function testRandom () {
    var basket = ["a", "b", "c", "d", "e", "f"];
    var counts = new Array(basket.length);
    var i,j;
    for (i=0 ; i<basket.length ; i++)
        counts[i] = 0;
    for (i=0 ; i<600 ; i++) {
        var one = randomChoose(basket);
        for (j=0 ; j<basket.length ; j++)
            if (basket[j] == one)
	        counts[j]++;
    }
    alert(counts.join(" "));
    return;
}
