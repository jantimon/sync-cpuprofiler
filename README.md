# sync-cpuprofiler

Create a new cpuprofile for the currend node process


## Usage

To create a new profile to `profiles/profile-0000000000.cpuprofile` just run the following command:

```js
require('sync-cpuprofiler')();
```

To change the profile name you can specify any path:

```js
require('sync-cpuprofiler')('profiles/demo.cpuprofile');
```
