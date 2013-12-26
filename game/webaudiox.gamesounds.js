var WebAudiox	= WebAudiox	|| {}

/**
 * attempts to a more structure sound banks
 */
WebAudiox.GameSounds	= function(){
	// create WebAudio API context
	var context	= new AudioContext()
	this.context	= context

	// Create lineOut
	var lineOut	= new WebAudiox.LineOut(context)
	this.lineOut	= lineOut
	
	/**
	 * show if the Web Audio API is detected or not
	 * @type {boolean}
	 */
	this.webAudioDetected	= AudioContext ? true : false
	

	//////////////////////////////////////////////////////////////////////////////////
	//		library API							//
	//////////////////////////////////////////////////////////////////////////////////
	
	var sounds	= {}
	this.sounds	= sounds
	
	this.labels	= function(){
		return Object.keys(sounds)
	}	
	this.has	= function(label){
		return sounds[label] !== undefined
	}
	this.get	= function(label){
		console.assert(sounds[label] !== undefined)
		return sounds[label]
	}
	this.add	= function(label, url, playFn){
		console.assert(sounds[label] === undefined)
		sounds[label]	= new WebAudiox.GameSound(this, url, playFn)
	}
	this.remove	= function(label){
		delete sounds[label]
	}
	this.play	= function(label){
		console.assert(sounds[label] !== undefined)
		sounds[label].play()
	}
}

WebAudiox.GameSound	= function(gameSounds, url, playFn){
	// handle default arguments
	playFn		= playFn	|| function(){
		var source	= gameSounds.context.createBufferSource()
		source.buffer	= loadedBuffer
		source.connect(gameSounds.lineOut.destination)
		source.start(0)
		return source				
	}
	// load the sound
	var loadedBuffer= null
	WebAudiox.loadBuffer(gameSounds.context, url, function(decodedBuffer){
		loadedBuffer	= decodedBuffer;
	})
	
	this.isReady	= function(){
		return loadedBuffer !== null
	}

	this.play	= function(){
		// if not yet loaded, do nothing
		if( loadedBuffer === null )	return;
		return playFn(this)
	}
	
	// possible three.js api
	// sound.at(position).play(3)
	// sound.follow(object3d).play(3)
	
	this.play	= function(object3d, intensity){
		// * make it follow object3d
		//   * so this mean there is a update function 
		//   * (maybe there is already that in three.js event)
		//   * this mean it has to be unfollowed when the sound is over
		//   * how to know if a sound is over ? event ? setTimerout based on duration ?
		//   * how to get duration ?
		// * set a special intensity for this play
		// * pass parameter generically in GameSounds
		// * 
	}
}