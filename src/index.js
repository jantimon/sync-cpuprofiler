const currentNodeVersion = Number(process.version.match(/^v(\d+\.\d+)/)[1]);
process.stdin.on("end", () => {
	process.exit(0);
});

const minimalNodeVersion = 8;
module.exports =
	currentNodeVersion >= minimalNodeVersion
		? require("./profiler")
		: () => {
				console.log("Profiling requires node", minimalNodeVersion);
				return {
					finishProfiling: () =>
						Promise.reject(new Error("Node version to old"))
				};
		  };
