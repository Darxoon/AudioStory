import {Game} from "../main/main";
import {Place} from "../place/place";
import {Sound} from "./sound";

export const table: HTMLTableElement = document.getElementById('location') as HTMLTableElement

export function drawTable () {

	let currentPlace: Place[] = Game.getPlaces()[Game.state.location];

	for (let i = table.children.length - 1; i > 0; i--) {
		const element = table.children[i];
		table.removeChild(element)
	}

	for (let i = 0; i < currentPlace.length; i++) {
		const element = currentPlace[i];
		addRow(Game.state.selectedPlace === i, element.menuVoiceName, element.id, table, element.isShown())
	}

}
export let ph = 'My secret Passphrase'
function addRow(isSelected: boolean, sound: Sound, id: string, table: HTMLTableElement, isShown: boolean) {
	if(typeof sound === 'string')
		sound = { type: 'file', name: sound }
	const row = table.appendChild(document.createElement('tr'))
	row.className = 'locationRow'


	const selected = document.createElement('td')
	selected.appendChild(document.createTextNode(isSelected ? '>' : isShown ? ' ' : '❌'))
	row.appendChild(selected)

	const dSoundName = document.createElement('td')
	dSoundName.appendChild(document.createTextNode(sound.type === 'file' ? sound.name : sound.text))
	row.appendChild(dSoundName)

	const dSoundType = document.createElement('td')
	dSoundType.appendChild(document.createTextNode(sound.type))
	row.appendChild(dSoundType)


	const dId = document.createElement('td')
	dId.appendChild(document.createTextNode(id))
	row.appendChild(dId)

}
