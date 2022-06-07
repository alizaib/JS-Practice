const fs = require("fs");

console.log(process.argv[2]);

const targetDir = process.argv[2] || process.cwd();
fs.readdir(targetDir, async (err, filenames) => {
    if (err) {
        console.log("An error occurred ", err);
    }

    for (let filename of filenames) {
        const stats = await fs.promises.lstat(filename);
        console.log(filename, stats.isFile());
    }
});
