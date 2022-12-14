let ooo = [[1, 2, 3, 4, 5, 6], [7, 8, 9, 10, 11]]
let vvv = [[10, 5, 9, 45, 70, 15], [1, 2, 3, 7, 64, 21]]

function verifyMatches([v], [o]) {
    let ver = [...v]
    let ori = [...o]

    console.log(ver);
    console.log(ori);

    for (let arr of ver) {
        for (let x of ori) {
            let matches = x.filter(n => arr.includes(n))
            return matches
        }
    }
}
console.log(verifyMatches(vvv, ooo))

// for (let arr of vvv) {
//     for (let x of ooo) {
//         let matches = x.filter(n => arr.includes(n))
//         console.log(matches)
//     }
// }