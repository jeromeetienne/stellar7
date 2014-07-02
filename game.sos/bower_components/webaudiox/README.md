[webaudiox.js](https://github.com/jeromeetienne/webaudiox)
is a bunch of helpers for 
[WebAudio API](https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html).
It isn't a library per se.
You can use any of those helpers independantly.
This makes it very light to include these in your own code.
There is a ```webaudiox.js``` provided though.
This is for convenience.
It is just the concatenation of all the helpers.

## Usage

Here is a boilerplate, a good example to start with. 
It initializes the AudioContext, the lineOut and downloads a sound.

```html
<script src='webaudiox.js'></script>
<script>
	// create WebAudio API context
	var context	= new AudioContext()

	// Create lineOut
	var lineOut	= new WebAudiox.LineOut(context)

	// load a sound and play it immediatly
	WebAudiox.loadBuffer(context, 'sound.wav', function(buffer){
		// init AudioBufferSourceNode
		var source	= context.createBufferSource();
		source.buffer	= buffer
		source.connect(lineOut.destination)
		
		// start the sound now
		source.start(0);
	});
</script>
```

## Installation

Download the helpers with a usual ```<script>```. 
the easiest is to get 
[webaudiox.js](https://raw.github.com/jeromeetienne/webaudiox/master/build/webaudiox.js)
in ```/build``` directory.

```html
<script src='webaudiox.js'></script>
```

[bower](http://bower.io/) is supported if it fit your needs. just use
```bower install webaudiox``` 

## Requirements

No real requirements: there are no external dependancies.
Well WebAudio API must be available obviously :)
Currently Chrome, Firefox, iOS and Opera support it.

## Contributings

Feel free to send pull requests. i love little helpers which are useful :)

## ChangeLogs
*  v1.0.1 bower support
  * you can try with ```bower install webaudiox```
*  v1.0.0 initial release

## Plugins
* [webaudiox.ConvolverHelper](https://github.com/erichlof/webaudiox.ConvolverHelper)
is a plugin by @erichlof .
It provides a simple mean to use convolvers, thus you can simulate being thru an old
telephone, in a hall, or in a tunnel.

# API for Each Helpers

Here is all the helpers provided and their respective API. the source contains a jsdoc
which is authoritative.

## webaudiox.bytetonormalizedfloat32array.js

You can see the
[file on github](https://github.com/jeromeetienne/webaudiox/blob/master/lib/webaudiox.bytetonormalizedfloat32array.js).
You can try an usage 
[example live](http://jeromeetienne.github.io/webaudiox/examples/frequencyspectrum.html)
and check its 
[source](https://github.com/jeromeetienne/webaudiox/blob/master/examples/frequencyspectrum.html).
Sure but what does it do ?

It converts a byteArray to a normalized Float32Array.
The destination Array is normalized because 
values are garanted to be between 0 and 1.
It works even if the destination array has a different value than the source array.
It is useful when playing with frequency spectrum.

```javascript
WebAudiox.ByteToNormalizedFloat32Array(srcArray, dstArray);
// bytesFreq is from a analyser.getByteFrequencyData(bytesFreq)
// histogram is destination array, e.g. new Float32Array(10)
WebAudiox.ByteToNormalizedFloat32Array(bytesFreq, histogram)
```

## webaudiox.analyser2canvas.js

You can see the
[file on github](https://github.com/jeromeetienne/webaudiox/blob/master/lib/webaudiox.analyser2canvas.js).
You can try an usage 
[example live](http://jeromeetienne.github.io/webaudiox/examples/analyser2canvas.html)
and check its 
[source](https://github.com/jeromeetienne/webaudiox/blob/master/examples/analyser2canvas.html).
Sure but what does it do ?

It display various visualisation of the played sound, the one analysed by ```analyser```.
It display a FFT histogram, a waveform, and a volume. It is there mainly for debug.

First you create the object

```
var analyser2canvas	= new WebAudiox.Analyser2Canvas(analyser, canvas);
```

Then every time you want to draw on the canvas do 

```
analyser2canvas.update()
```

## webaudiox.analyser2volume.js

You can see the
[file on github](https://github.com/jeromeetienne/webaudiox/blob/master/lib/webaudiox.analyser2volume.js).
You can try an usage 
[example live](http://jeromeetienne.github.io/webaudiox/examples/analyser2volume.html)
and check its 
[source](https://github.com/jeromeetienne/webaudiox/blob/master/examples/analyser2volume.html).
Sure but what does it do ?

It makes an average on a ByteFrequencyData from an analyser node. clear ? :)
In brief, it makes an fft to extract the frequency of the sound, all that in real time.
It is often used to detect pulse in some frequency range.
like detecting pulse in the low frequencies can be a easy beat detector.

```javascript
// create the object
var analyser2Volume	= new WebAudiox.Analyser2Volume(analyser)
var rawVolume		= analyser2Volume.rawValue()
var smoothedVolume	= analyser2Volume.smoothedValue()
```

It is possible to directly compute the raw volume.

```javascript
var rawVolume	= new WebAudiox.Analyser2Volume.compute(analyser, width, offset);
// rawVolume is a Number of the computed average
```

width is optional and default to ```analyser.frequencyBinCount```.
offset is optional and default to 0.

## webaudiox.lineout.js

You can see the
[file on github](https://github.com/jeromeetienne/webaudiox/blob/master/lib/webaudiox.lineout.js).
You can try an usage 
[example live](http://jeromeetienne.github.io/webaudiox/examples/lineout.html)
and check its 
[source](https://github.com/jeromeetienne/webaudiox/blob/master/examples/lineout.html).
Sure but what does it do ?
It provide a main line out with the *good practices*
from 
["Developing Game Audio with the Web Audio API"](http://www.html5rocks.com/en/tutorials/webaudio/games/)
on 
[html5rocks](http://www.html5rocks.com/). 
So it provides 
a clipping detection and
a dynamic compressor to reduce clipping to improve sound quality.

Additionaly it provides some tools useful in real-life cases.
Such as the ability for the user to mute the sound. 
Its is useful when the user is at the office or any place where it isn't
polite to have a loud computer :)
Another thing, there is a *muteIfHidden* feature. so if the browser tab is hidden, 
the sound is mute using 
[PageVisibility API](http://www.w3.org/TR/page-visibility/).
and obviously ability to tune the volume globally for all sounds.

Now let's see it's API

### create a lineOut

```javascript
var lineOut	= new WebAudiox.LineOut(context)
```

### to set the volume/gain
 
```javascript
lineOut.volume	= 0.8;
```

### To connect a sound to your lineOut

use ```lineOut.destination``` as you would use ```context.destination```.

```javascript
source.connect(lineOut.destination)
```

### test if currently muted by user

```javascript
if( lineOut.isMuted === true ){
	console.log('sound has been muted by user')
}
```

### toggle mute status

typically when the user click on the mute button, you want to toggle the mute status.

```javascript
lineOut.toggeMute()
```

## webaudiox.shim.js

You can see the
[file on github](https://github.com/jeromeetienne/webaudiox/blob/master/lib/webaudiox.shim.js).
You can try an usage 
[example live](http://jeromeetienne.github.io/webaudiox/examples/jsfx.html)
and check its 
[source](https://github.com/jeromeetienne/webaudiox/blob/master/examples/jsfx.html).
Sure but what does it do ?
It does a [shim](http://en.wikipedia.org/wiki/Shim_\(computing\)) which handle 
the vendor prefix, so you don't have to. Typically it contains code like 

```javascript
window.AudioContext	= window.AudioContext || window.webkitAudioContext;
```

## webaudiox.jsfx.js

You can see the
[file on github](https://github.com/jeromeetienne/webaudiox/blob/master/lib/webaudiox.jsfx.js).
You can try an usage 
[example live](http://jeromeetienne.github.io/webaudiox/examples/jsfx.html)
and check its 
[source](https://github.com/jeromeetienne/webaudiox/blob/master/examples/jsfx.html).
Sure but what does it do ?

[jsfx.js](https://github.com/egonelbre/jsfx) 
is a library to generate procedural sound, very 8-bit kindof sound.
See [jsfx demo page](http://www.egonelbre.com/js/jsfx/) for details on this fun library
by [@egonelbre](https://twitter.com/egonelbre/).
It is usefull because you can generate lots of different sound easily without downloading
anything.
Here is a usage example

```javascript
// create the audio context 
var context	= new AudioContext()
// parameter for jsfx.js - http://www.egonelbre.com/js/jsfx/
var lib		= ["square",0.0000,0.4000,0.0000,0.3200,0.0000,0.2780,20.0000,496.0000,2400.0000,0.4640,0.0000,0.0000,0.0100,0.0003,0.0000,0.0000,0.0000,0.0235,0.0000,0.0000,0.0000,0.0000,1.0000,0.0000,0.0000,0.0000,0.0000]
var buffer	= WebAudiox.getBufferFromJsfx(context, lib)
```


## webaudiox.loadbuffer.js

You can see the 
[file on github](https://github.com/jeromeetienne/webaudiox/blob/master/lib/webaudiox.loadbuffer.js).
You can try an usage 
[example live](http://jeromeetienne.github.io/webaudiox/examples/lineout.html)
and check its 
[source](https://github.com/jeromeetienne/webaudiox/blob/master/examples/lineout.html).
Sure but what does it do ?
It is helper to load sound. 
it is a function which load the sound from an ```url``` and decode it.

```javascript
WebAudiox.loadBuffer(context, url, function(buffer){
	// notified when the url has been downloaded and the sound decoded.
}, function(){
	// notified if an error occurs
});
```

### Scheduling Download

In real-life cases, like game, you want to be sure all your sounds
are ready to play before the user start playing.
So here is way to schedule your sound downloads simply.
There is global onLoad callback ```WebAudiox.loadBuffer.onLoad```
This function is notified everytime .loadBuffer() load something.
you can overload it to fit your need.
here for an 
[usage example](https://github.com/jeromeetienne/webaudiox/blob/master/lib/soundsbank.html).

```javascript
// context is the webaudio API context
// url is where to download the sound
// buffer is the just loaded buffer
WebAudiox.loadBuffer.onLoad = function(context, url, buffer){
	// put your own stuff here	
	// ... 
}
```

Additionally there is ```WebAudiox.loadBuffer.inProgressCount```.
it is counter of all the .loadBuffer in progress. 
it useful to know is all your sounds as been loaded.

## webaudiox.three.js

You can see the 
[file on github](https://github.com/jeromeetienne/webaudiox/blob/master/lib/webaudiox.three.js).
You can try an usage 
[example live](http://jeromeetienne.github.io/webaudiox/examples/threejs.html)
and check its 
[source](https://github.com/jeromeetienne/webaudiox/blob/master/examples/threejs.html).
Additionaly, here is an experimentation using ```PannerNode``` 
with a 
[example live](http://jeromeetienne.github.io/webaudiox/examples/threejs-panner.html)
and its
[source](https://github.com/jeromeetienne/webaudiox/blob/master/examples/threejs-panner.html).
Sure but what does it do ?

This is useful lf you have a three.js scene and would like to play spacial sound in it.
When a sound is played in 3d space, there are 2 actors: 
the listener which hears the sound 
and
the sound source which emits the sound.
Each of them must be localised in 3d space. 

In practice when you use it with three.js
you need to constantly update the position of the 
listener and all the sound sources. First in your init, you instance the updater objects.
Then at each iteration of your rendering loop, you update all the positions.
Here is the API details.

### listener localisation

First let's localise the listener. most of the time it will be the the viewer camera.
So you create a ```ListenerObject3DUpdater``` for that 

```javascript
// context is your WebAudio context
// object3d is the object which represent the listener
var listenerUpdater = new WebAudiox.ListenerObject3DUpdater(context, object3d)
```

then you call ```.update()``` everytime you update the position of your ```object3d```
listener.

```javascript
// delta is the time between the last update in seconds
// now is the absolute time in seconds
listenerUpdater.update(delta, now)
```

### sound source localisation

Now let's localise a sound source.
A sound source is localised only if it has a 
[panner node](https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html#PannerNode).

#### if you want a sound to follow a Object3D

So you create a ```PannerObject3DUpdater``` for that 

```javascript
// panner is the panner node from WebAudio API
// object3d is the object which represent the sound source in space
var pannerUpdater = new WebAudiox.PannerObject3DUpdater(panner, object3d)
```

then you call ```.update()``` everytime you update the position of your ```object3d```
listener

```javascript
// delta is the time between the last update in seconds
// now is the absolute time in seconds
pannerUpdater.update(delta, now)
```

#### if you want a sound to be played at a given position

```
var panner	= context.createPanner()
var position	= new THREE.Vector3(1,0,0)
WebAudiox.PannerSetPosition(panner, position)
```

#### if you want a sound to be played from a THREE.Object3D

```
var panner	= context.createPanner()
var object3d	= new THREE.Object3D
WebAudiox.PannerSetObject3D(panner, object3d)
```

# Other Examples

here are the various examples: 

* a possible way to handle soundback: [here](http://jeromeetienne.github.io/webaudiox/examples/soundsbank.html)
* how to get a track from sound cloud: [here](http://jeromeetienne.github.io/webaudiox/examples/soundcloud-test.html)
* how to load and play a sound only with the API: [here](http://jeromeetienne.github.io/webaudiox/examples/raw.html)
* how to use it with beatdetektor.js: [here](http://jeromeetienne.github.io/webaudiox/examples/beatdetektorjs.html)
* how load and play a sound with webaudio api raw. no helper at all: [here](http://jeromeetienne.github.io/webaudiox/examples/raw.html)


# TODO
* http://webaudiodemos.appspot.com/
* http://webaudioapi.com/
* port examples from webaudio.js
* QF-MichaelK: jetienne: http://www.youtube.com/watch?v=Nwuwg_tkHVA it's the rainbow one in the middle...
* QF-MichaelK: http://www.smartjava.org/content/exploring-html5-web-audio-visualizing-sound
* http://chromium.googlecode.com/svn/trunk/samples/audio/samples.html
* [2:14pm] QF-MichaelK: here's one I guess http://airtightinteractive.com/demos/js/reactive/
* done QF-MichaelK: this is neat too http://www.bram.us/2012/03/21/spectrogram-canvas-based-musical-spectrum-analysis/
