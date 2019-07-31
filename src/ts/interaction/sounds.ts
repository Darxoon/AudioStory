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

export function play(sound: Sound, gain = 1, pan = 0, sinPan = false) {
	if(typeof sound === 'string')
		sound = { type: 'file', name: sound }
	if(sound.type === 'file') {
		if(soundLib[sound.name]) {
			// play file
			const source = context.createBufferSource()
			source.buffer = soundLib[sound.name]


			const gainNode = context.createGain()
			gainNode.gain.value = gain
			source.connect(gainNode)

			const pannerNode = context.createStereoPanner()
			pannerNode.pan.value = pan
			gainNode.connect(pannerNode)

			pannerNode.connect(context.destination)
			source.start()


			if (sinPan) {

				let interval: NodeJS.Timeout
				let count = 0

				interval = setInterval(() => {
					pannerNode.pan.value = Math.sin(pan)
					pan += 0.01
					count++

				}, 1)

				source.addEventListener('ended', () => {
					clearInterval(interval)
				})
			}
		} else
			console.error(`Sound called '${sound.name} doesn't exist`)
	} else {
		// text to speech
		// temporarily, text to speech will play the placeholder file
		play('tts_placeholder')
	}
}