const inspector = require("inspector");
const fs = require("fs");
const runLoopOnce = require("deasync").runLoopOnce;
const session = new inspector.Session();
const path = require("path");

/**
 * Create a new profile once the process is done
 */
module.exports = function syncProfiling(profilePath, options = {}) {
	// Defaults
	const { autoCleanup, writeFileSync, onProfileDone } = Object.assign(
		{
			autoCleanup: true,
			writeFileSync: fs.writeFileSync,
			onProfileDone: () => {}
		},
		options
	);
	if (profilePath === undefined) {
		profilePath = path.resolve(
			"profiles",
			"profile-" + new Date().getTime() + ".cpuprofile"
		);
	}

	let profilerStarted = false;
	// Start profiling
	session.connect();
	session.post("Profiler.enable", () => {
		session.post("Profiler.start", () => {
			profilerStarted = true;
		});
	});
	let finishProfilePromise;
	// Stop profiling
	async function finishProfiling() {
		if (finishProfilePromise) {
			return finishProfilePromise;
		}
		finishProfilePromise = new Promise((resolve, reject) => {
			session.post("Profiler.stop", (profileCloseError, { profile }) => {
				session.disconnect();
				if (profileCloseError) {
					return reject(profileCloseError);
				}
				mkdirp(path.dirname(profilePath));
				writeFileSync(profilePath, JSON.stringify(profile), {
					encoding: "utf-8"
				});
				onProfileDone(profilePath);
				resolve(profilePath);
			});
		});
		return finishProfilePromise;
	}

	// Wait until the process
	// exits to write the profile
	if (autoCleanup !== false) {
		process.on("exit", async () => {
			try {
				await finishProfiling();
			} catch (err) {
				console.error(err);
			}
		});
		process.on("SIGINT", () => {
			process.exit(2);
		});
		process.on("uncaughtException", error => {
			console.error(error);
			process.exit(99);
		});
	}

	// Blook loop until profile is started
	while (!profilerStarted) {
		runLoopOnce();
	}

	return {
		finishProfiling
	};
};

/**
 * Small mkdirp helper
 */
function mkdirp(filepath) {
	function isDir(filepath) {
		try {
			return fs.lstatSync(filepath).isDirectory();
		} catch (e) {}
		return false;
	}
	const pathInformation = path.parse(path.resolve(filepath));
	const directory = pathInformation.dir.substr(pathInformation.root.length);
	if (directory === "") {
		return;
	}
	const pathParts = directory.split(path.sep);
	pathParts.push(pathInformation.base);
	let combinedPath = pathInformation.root;
	pathParts.forEach(part => {
		combinedPath = path.join(combinedPath, part);
		if (!isDir(combinedPath)) {
			fs.mkdirSync(combinedPath);
		}
	});
}
