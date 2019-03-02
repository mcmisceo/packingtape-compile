const fs = require("fs-extra");

let lines = ["foo", "bar", "foo"]

//fs.createFileSync('test/compile_to/mechanization/data/mechanization/functions/give/mystic_chestplate.mcfunction')
//var file = fs.createWriteStream('test/compile_to/mechanization/data/mechanization/functions/give/mystic_chestplate.mcfunction');
//file.on('error', function(err) { /* error handling */ });
//lines.forEach(function(v) { file.write(v + '\n'); });
//file.end();
fs.writeFileSync('test/compile_to/mechanization/data/mechanization/functions/give/mystic_chestplate.mcfunction', lines);