import {Sound} from "./sound";

export function loadAndPlaySound() {
	const context = new AudioContext()
	const request = new XMLHttpRequest()
	request.open('GET', 'src/sounds/moved_selection.wav', true)
	request.responseType = 'arraybuffer'
	request.onload = () => {
		console.log(request.response)
		context.decodeAudioData(request.response)
			.then(x => {
				const audioBuffer = x

				const source = context.createBufferSource()
				source.buffer = audioBuffer
				source.connect(context.destination)
				source.start()
			})
			.catch(x => {
				console.error(x)
			})
	}
	request.send(null)
}
const context = new AudioContext()
const soundLoadQueue: {name: string, path: string}[] = []
const soundLib: {[name: string]: AudioBuffer} = {}
const soundsPlayingWithID: Map<string, AudioBufferSourceNode > = new Map<string, AudioBufferSourceNode>()

export function addSound(name: string, path: string) {
	soundLoadQueue.push({name, path: path})
}

export function loadAllSounds() {
	soundLoadQueue.forEach(value => {
		const request = new XMLHttpRequest()
		request.open('GET', value.path, true)
		request.responseType = 'arraybuffer'
		request.onload = () => {
			context.decodeAudioData(request.response)
				.then(audioBuffer => {
					soundLib[value.name] = audioBuffer
				})
				.catch(reason => {
					console.error(reason)
				})
		}
		request.send(null)
	})
	console.log(soundLib)
}

function combineAudioBuffers(audioBuffers: AudioBuffer[]) {
	// iterate through channels
	const minChannelAmount = audioBuffers.reduce((previousValue, currentValue) => { console.log(currentValue); return Math.min(previousValue, currentValue.numberOfChannels) }, 100),
		  combinedDuration = audioBuffers.reduce((previousValue, currentValue) => { return previousValue + currentValue.length }, 0),
		  newBuffer		 = context.createBuffer(minChannelAmount, combinedDuration, audioBuffers[0].sampleRate)
	for (let i = 0; i < minChannelAmount; i++) {

		const channelData = newBuffer.getChannelData(i)

		// iterate through audioBuffers
		for (let j = 0, channelPosition = 0; j < audioBuffers.length; j++) {
			channelData.set(audioBuffers[j].getChannelData(i), channelPosition)
			channelPosition += audioBuffers[j].length
		}

	}

	return newBuffer
}

function textToSpeech(sound: {type: 'tts', voice: string, text: string}): AudioBuffer {
	console.log('text to speech:', sound)
	return soundLib.tts_placeholder
}

function playBuffer(audioBuffer: AudioBuffer, gain = 1, pan = 0, id?: string, behavior?: () => void, onEnd?: () => void) {

	const source = context.createBufferSource()
	source.buffer = audioBuffer

	const gainNode = context.createGain()
	gainNode.gain.value = gain
	source.connect(gainNode)

	const pannerNode = context.createStereoPanner()
	pannerNode.pan.value = pan
	gainNode.connect(pannerNode)

	pannerNode.connect(context.destination)
	source.start()

	if(id) {
		if(soundsPlayingWithID.has(id))
			soundsPlayingWithID.get(id).stop()
		soundsPlayingWithID.set(id, source)
	}


	if (behavior) {

		let interval: NodeJS.Timeout

		interval = setInterval(behavior, 1)

		source.addEventListener('ended', () => {
			clearInterval(interval)
			if(onEnd)
				onEnd()
		})
	} else if(onEnd)
		source.addEventListener('ended', onEnd)

}

export function play(sound: Sound | Sound[], gain = 1, pan = 0, id?: string, behavior?: () => void, onEnd?: () => void) {

	// if it's an array, combine it and play it
	if(sound instanceof Array) {
		return playBuffer(combineAudioBuffers(sound.map(value => {
			if(typeof value === 'string')
				value = { type: 'file', name: value }

			if(value.type === 'tts')
				return textToSpeech(value)
			else
				return soundLib[value.name]
		})), gain, pan, id, behavior, onEnd)
	}

	// if it's a string, convert it to an object
	if(typeof sound === 'string')
		sound = { type: 'file', name: sound }

	// if it's a file, play item from soundLib
	if(sound.type === 'file') {
		if(soundLib[sound.name]) {
			playBuffer(soundLib[sound.name], gain, pan, id, behavior, onEnd)
		} else
			console.error(`Sound called '${sound.name} doesn't exist`)

	} else {
		// play text-to-speech
		playBuffer(textToSpeech(sound), gain, pan, id, behavior, onEnd)
	}
}