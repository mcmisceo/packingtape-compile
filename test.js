let example = {
    test: "test"
}
let example2 = example;

example2.test = "test2"

console.log(example.test + ", " + example2.test);