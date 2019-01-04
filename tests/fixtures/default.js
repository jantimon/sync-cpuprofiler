require("../../src/index")(undefined, {
	onProfileDone: profileName => console.log(profileName)
});

setTimeout(() => {
	console.log("done");
}, 500);
