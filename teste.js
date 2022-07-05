let origem = [[1, 2, 3, 4, 5, 6], [7, 8, 9, 10, 11]]
let verificador = [[10, 5, 9, 45, 70, 15], [1, 2, 3, 7, 64, 21]]

let match = []

for (let arr of verificador) {
    for (let x of origem) {
        let h = x.filter(n => arr.includes(n))
        console.log(h);
    }
}
