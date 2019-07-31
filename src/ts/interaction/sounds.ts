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
		}
		request.send(null)
	})
	console.log(soundLib)
}

export function play(name: string) {
	
}