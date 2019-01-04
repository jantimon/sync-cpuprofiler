require("../../src/index")();

process.stdin.pipe(process.stdout);
setInterval(() => {
	console.log("ping");
}, 100);
