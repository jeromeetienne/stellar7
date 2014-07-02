threex.coloradjust
===================

It is a 
[threex](http://jeromeetienne.github.io/threex/) extension 
for 
[three.js](http://threejs.org)
which provide an color adjustement based on a 3d texture.
It is very flexible, you can build those textures with any image editing software.
It is ported from
[color-adjust demo](http://webglsamples.googlecode.com/hg/color-adjust/color-adjust.html)
by
[greggman](http://greggman.com/).
Here is a [video](http://www.youtube.com/watch?v=rfQ8rKGTVlg#t=25m03s)
where you can see greggman explaining the underlying technic.
It is released under MIT license.

Show Don't Tell
===============
* [examples/basic.html](http://jeromeetienne.github.io/threex.coloradjust/examples/basic.html)
\[[view source](https://github.com/jeromeetienne/threex.coloradjust/blob/master/examples/basic.html)\] :
It shows how to use the ```THREEx.ColorAdjust.Renderer```.
It changes the color cube randomly every 3-seconds just to put some animations
* [examples/demo.html](http://jeromeetienne.github.io/threex.coloradjust/examples/demo.html)
\[[view source](https://github.com/jeromeetienne/threex.coloradjust/blob/master/examples/demo.html)\] :
It show an video with the adjusted colors. 
You can play with it to get a better feeling of what this effect can do for you.

How To Install It
=================

You can install it via script tag

```html
<script src='threex.coloradjust.js'></script>
```

Or you can install with [bower](http://bower.io/), as you wish.

```bash
bower install threex.coloradjust
```

How To Use It
=============

It build the passes for the color effect.
It exposes ```colorPass.colorPass``` for a ```THREE.EffectComposer``` instance.

Create an instance

```
var colorPasses	= new THREEx.ColorAdjust.Passes();
```

Everytime you render the scene, be sure to update it

```
colorPasses.update(delta, now)		
```

Then you add those passes to an ```THREE.EffectComposer``` like that

```
colorPasses.addPassesTo(composer)
```

### Tuning

This module comes with a set of predefined *color cubes* : 22 of them to be exact.
You can set the color cube you want: one of the 22 already provided, or your own. 
It default to ```default```.
Here is the full list of available colors adjustement : default,
monochrome,
sepia,
saturated,
posterize,
inverse,
color-negative,
high-contrast-bw,
funky-contrast,
nightvision,
thermal,
black-white,
hue-plus-60,
hue-plus-180,
hue-minus-60,
red-to-cyan,
blues,
infrared,
radioactive,
goolgey,
bgy.

```javascript
// set color adjustement to 'nightvision'
colorPasses.setColorCube('nightvision')
```

There is a smooth linear transition between the old colorCube and the new colorCube. 
You can tune the delay like this.

```javascript
// set the transition delay to 2 seconds
colorPasses.delay	= 2;
```


