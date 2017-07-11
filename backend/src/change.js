/* --------------------------------------------------------------------------
 --------------------------------Constants-----------------------------------
 -------------------------------------------------------------------------- */
const COINS = [10, 20, 50, 100, 200, 500];


/* --------------------------------------------------------------------------
 --------------------------------Functions-----------------------------------
 -------------------------------------------------------------------------- */

//Enumeration of the candidates where the @candidate numbers sum up to @amount.
var enumerateCandidates = function (candidates, amount) {
    var result = [];
    recursion(candidates, amount, [], result, 0);
    return result;
};

//Recursion for enumerateCandidates
function recursion(candidates, amount, current, result, index) {
    var len = candidates.length, i, n;
    for (i = index; i < len; i++) {
        n = candidates[i];
        current.push(n);
        if (n === amount) {
            result.push(current.concat());
        } else if (amount > n) {
            recursion(candidates, amount - n, current.concat(), result, i);
        }
        current.pop();
    }
}

// Count each coin occurence needed to make the change
var countOccurences = function (poss) {
    var result = [];
    for (var i = 0; i < poss.length; i++) {
        var occurences = {};
        poss[i].forEach(function (item) {
            var objStr = JSON.stringify(item);
            occurences[objStr] = occurences[objStr] ? ++occurences[objStr] : 1;
        });
        result.push(occurences);
    }
    return result;
};

// Check if the change set is doable with the remaining coins in the peggy
var getPossibleChange = function (poss, peggy) {
    var result = [];
    poss.forEach(function (currObj, arrInd, array) {
        var ok = true;                            // This boolean defines if the possibility is valid
        for (var key in currObj) {
            if (peggy.hasOwnProperty(key)) {
                if (peggy[key] < currObj[key]) {    // Test if there are enough coins for this possibility
                    ok = false;                   // invalidate possibility
                }
            } else {
                ok = false;                       // invalidate possibility
            }
        }
        if (ok) result.push(currObj);              // possibility included in result
    });
    return result;
};


// Choose the change set which takes the less coins
var choose = function (poss) {
    sortObject(poss);
    console.log(poss);
    var result = {"change": false};                   // If the change is not possible respond with this
    var len = Number.MAX_VALUE;
    poss.forEach(function (currObj, arrInd, array) {
        if (Object.keys(currObj).length < len) {     // Keep the possibility with least coins (if multiple take last one)
            len = Object.keys(currObj).length;
            result = currObj;
        }
    });
    return result;
};

function sortObject(o) {
    return Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {});
}

//Get the change for the given amount
module.exports.getChange = function (amount, peggy) {

    // Change format for calculation
    var str = JSON.stringify(peggy);
    if (peggy.hasOwnProperty('coin50c')) str = str.replace(/coin50c/g, '50');
    if (peggy.hasOwnProperty('coin20c')) str = str.replace(/coin20c/g, '20');
    if (peggy.hasOwnProperty('coin10c')) str = str.replace(/coin10c/g, '10');
    if (peggy.hasOwnProperty('coin5')) str = str.replace(/coin5/g, '500');
    if (peggy.hasOwnProperty('coin2')) str = str.replace(/coin2/g, '200');
    if (peggy.hasOwnProperty('coin1')) str = str.replace(/coin1/g, '100');
    peggy = JSON.parse(str);

    // Calculate in cents
    amount = amount * 100;
    amount = Math.round(amount);

    // Decide change
    var occurences = countOccurences(enumerateCandidates(COINS, amount));
    var poss = getPossibleChange(occurences, peggy);
    var result = choose(poss);

    // Change format for calculation
    str = JSON.stringify(result);
    if (result.hasOwnProperty('500')) str = str.replace(/500/g, 'coin5');
    if (result.hasOwnProperty('200')) str = str.replace(/200/g, 'coin2');
    if (result.hasOwnProperty('100')) str = str.replace(/100/g, 'coin1');
    if (result.hasOwnProperty('50')) str = str.replace(/50/g, 'coin50c');
    if (result.hasOwnProperty('20')) str = str.replace(/20/g, 'coin20c');
    if (result.hasOwnProperty('10')) str = str.replace(/10/g, 'coin10c');
    result = JSON.parse(str);

    return result;
};

