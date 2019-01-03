const spawn = require("child_process").spawn;
const path = require("path");
const rimraf = require("rimraf");
const fs = require("fs");
process.chdir(__dirname);

function runFixture(filename) {
	const subProcess = spawn("node", [path.join(__dirname, "fixtures", filename)], {
		stdio: ["pipe", "pipe", "inherit"]
	});
	const endPromise = new Promise((resolve, reject) => {
		subProcess.on("err", reject);
		subProcess.on("close", exitCode => Number(exitCode) !== 0 ? reject(exitCode) : resolve(exitCode));
	});
	return {
		endPromise,
		subProcess
	};
}

function getFiles(directory) {
	try {
		return fs.readdirSync(path.resolve(directory));
	} catch (e) {}
	return [];
}

function removeProfiles() {
	try {
		rimraf.sync("./profiles");
	} catch (e) {}
}

beforeEach(removeProfiles);
afterAll(removeProfiles);

test("should create profile after program finished", async () => {
	expect(getFiles("profiles").length).toBe(0);
	await runFixture("default.js").endPromise
	expect(getFiles("profiles").length).toBe(1);
});

test("should create valid json profile", async () => {
	expect(getFiles("profiles").length).toBe(0);
	await runFixture("default.js").endPromise
	const profile = path.resolve(__dirname, 'profiles', getFiles("profiles")[0]);
	const profileContent = JSON.parse(fs.readFileSync(profile, 'utf-8'));
	expect(Object.keys(profileContent)).toMatchSnapshot();
});

test("should create profile after program was ended", async () => {
	expect(getFiles("profiles").length).toBe(0);
	const child = runFixture("default.js");
	setTimeout(() => child.subProcess.stdin.end(), 500);
	await child.endPromise;
	expect(getFiles("profiles").length).toBe(1);
});
