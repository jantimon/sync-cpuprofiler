const { profilePromise } = require("../../src/index")();

setTimeout(() => {
	console.log("done");
}, 500);

profilePromise.then(profileName => {
	console.log(profileName);
});
