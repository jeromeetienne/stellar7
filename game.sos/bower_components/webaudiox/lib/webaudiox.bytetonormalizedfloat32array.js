var WebAudiox	= WebAudiox	|| {}


/**
 * source is integers from 0 to 255,  destination is float from 0 to 1 non included
 * source and destination may not have the same length.
 * 
 * @param {[type]} srcArray [description]
 * @param {[type]} dstArray [description]
 */
WebAudiox.ByteToNormalizedFloat32Array	= function(srcArray, dstArray){
	var ratio	= srcArray.length / dstArray.length
	for(var i = 0; i < dstArray.length; i++){
		var first	= Math.round((i+0) * ratio)
		var last	= Math.round((i+1) * ratio)
		last		= Math.min(srcArray.length-1, last)
		for(var j = first, sum = 0; j <= last; j++){
			sum	+= srcArray[j]/256;
		}
		dstArray[i]	= sum/(last-first+1);
	}
}
