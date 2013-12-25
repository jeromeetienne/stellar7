var WebAudiox	= WebAudiox	|| {}

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
		console.assert('TO BE IMPLEMENTED')
		delete sounds[label]
		new WebAudiox.GameSound(url, playFn)
	}
	this.play	= function(label){
		console.assert(sounds[label] !== undefined)
		sounds[label].play()
	}
}

WebAudiox.GameSound	= function(gameSounds, url, playFn){
	var loadedBuffer	= null
	
	// load the sound
	WebAudiox.loadBuffer(gameSounds.context, url, function(decodedBuffer){
		loadedBuffer	= decodedBuffer;
	})
	
	this.isReady	= function(){
		return loadedBuffer !== null
	}

	this.play	= function(){
		// if not yet loaded, do nothing
		if( loadedBuffer === null )	return;
		// if custom play function
		if( playFn ){
			playFn(this)
			return
		}
		// default play function
		var source	= gameSounds.context.createBufferSource()
		source.buffer	= loadedBuffer
		source.connect(gameSounds.lineOut.destination)
		source.start(0)
		return source				
	}
}