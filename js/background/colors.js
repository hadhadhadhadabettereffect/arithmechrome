var small_primes = [2,3,5,7,11,13];

var rgb_values = [
  [0,0,0], // 0: black
  [0xc7, 0xc7, 0xc7], // 1: gray
  [0x00, 0x67, 0xcf], // 2: blue
  [0xd5, 0x03, 0x00], // 3: red
  [0x17, 0x2e, 0x9c], // 4: blue-2
  [0x00, 0x80, 0x34], // 5: green
  [0x63, 0x08, 0x87], // 6: purple
  [0xfa, 0xe2, 0x61], // 7: yellow
  [0x00, 0x50, 0x90], // 8: blue-3
  [0x79, 0x02, 0x02], // 9: red-2
  [0x0d, 0x8d, 0x87], // 10: blue/green
  [0xf6, 0xa8, 0x58], // 11: orange
  [0x31, 0x2b, 0x8d], // 12: blue-2/red
  [0xe6, 0x9f, 0xe0]  // 13: pink
];

/**
 * get a number's rgb value based on leading digits
 * @param  {number} n number to check
 * @return {number[3]} array of rgb int values
 */
function vanVal (n) {
    var str, c1, c2, r, g, b;

    // if n < rgb_values.length
    // passing ref directly since not altering values in array
    if (n <= 13) return rgb_values[n];

    // 3/4 first digit, 1/4 second
    str = n.toString(10);
    c1 = rgb_values[str[0]];
    c2 = rgb_values[str[1]];
    r = (c1[0] >>> 1) + (c1[0] >>> 2) + (c2[0] >>> 2);
    g = (c1[1] >>> 1) + (c1[1] >>> 2) + (c2[1] >>> 2);
    b = (c1[2] >>> 1) + (c1[2] >>> 2) + (c2[2] >>> 2);

    // larger numbers tend towards gray
    while (n >>>= 12) {
        r = (r + 128) >>> 1;
        g = (g + 128) >>> 1;
        b = (b + 128) >>> 1;
    }

    return [r,g,b];
}

/**
 * returns a color for a given number
 * @param  {number} n number (int) to check
 * @return {string}   hex color string
 */
function colorValue (n) {
    var r = 0, g = 0, b = 0,
        mult = 0, count = 0,
        product = 1, weight = 0;
    // leading digits provides base
    var base = vanVal(n);
    var f = factors(n);

    // for each prime in small_primes
    for (var i = 0; i < 7; ++i) {
        // # of times factor divides into n
        mult = f[i];
        if (mult) {
            var c = rgb_values[small_primes[i]];
            r += c[0] * mult;
            g += c[1] * mult;
            b += c[2] * mult;
            count += mult;
            product *= Math.pow(small_primes[i], mult);
        }
    }

    // if any factors found, incorporate those colors,
    // weighted by how much of n they represent
    if (count) {
        weight = product / n;
        if (weight < 0.05) weight = 0;
    }

    if (weight) {
        r = Math.round((base[0] * (1 - weight)) + weight * r / count);
        g = Math.round((base[1] * (1 - weight)) + weight * g / count);
        b = Math.round((base[2] * (1 - weight)) + weight * b / count);
    } else {
        r = base[0];
        g = base[1];
        b = base[2];
    }

    return '#'+ (r > 15 ? r.toString(16) : '0' + r.toString(16)) +
                (g > 15 ? g.toString(16) : '0' + g.toString(16)) +
                (b > 15 ? b.toString(16) : '0' + b.toString(16));
}

/**
 * check number of times a factor divides evenly into a number
 * @param  {number} n the number to check
 * @param  {number} f the factor
 * @return {https://www.udacity.com/courses/allnumber}   the number of times f divides n
 */
function factorCount (n, f) {
    var count = 0;
    while (n >= f && n % f === 0) {
        ++count;
        n /= f;
    }
    return count;
}

/**
 * returns prime factors of given number
 * @param  {number} n int to check
 * @return {number[7]} the number of times small primes divide n
 */
function factors (n) {
    var counts = small_primes.map(function(p) {
        var c = factorCount(n, p);
        if (c) n /= (Math.pow(p, c));
        return c;
    });
    return counts;
}