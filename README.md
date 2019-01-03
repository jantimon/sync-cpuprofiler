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

## Using .cpuprofile

The .cpuprofile can be analysed using the [Google Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/rendering-tools):  
![GoogleChrome DevTools](https://developers.google.com/web/tools/chrome-devtools/rendering-tools/imgs/long-paint.png
 "GoogleChrome DevTools")

## Parsing .cpuprofile 

To render a `.cpuprofile` or to get the timings of it you have to convert it with [cpuprofile-to-flamegraph](https://github.com/jantimon/cpuprofile-to-flamegraph).

## Browser Javascript Profiling

`sync-cpuprofiler` works only for node - If you need something similar for browserside javacsript take a look at [automated-chrome-profiling](https://github.com/paulirish/automated-chrome-profiling).
