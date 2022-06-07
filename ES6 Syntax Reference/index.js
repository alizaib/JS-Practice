/*let updateFunctions = [];
for (var i = 0; i < 2; i++) {
    updateFunctions.push(function () {
        return i;
    });
}
console.log(updateFunctions[0]()); // will return 2 and not 0 because a closure is formed around i
// i will gets its updated value when getting executed

let updateFunctions2 = [];
for (let i = 0; i < 2; i++) {
    updateFunctions2.push(function () {
        return i;
    });
}
console.log(updateFunctions2[0]());
// declaring i with let, will provide its own value to each iteration*/
