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

