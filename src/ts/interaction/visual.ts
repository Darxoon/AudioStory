import {Game} from "../main/main";
import {Status} from "../main/state";
import {Place} from "../place/place";
import {Sound} from "./sound";

export namespace Visual {
	export let table: HTMLElement;
	export let textBox: HTMLElement;
	export let textBoxText: HTMLElement;
}
export function drawTable () {

	// check whether to show the dialogue box or menu table
	if(Game.state.status === Status.DIALOGUE) {
		Visual.textBox.style.display = null
		Visual.table.style.display = 'none'
	} else {
		Visual.textBox.style.display = 'none'
		Visual.table.style.display = null
	}


	let table: HTMLTableElement = Visual.table as HTMLTableElement;
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
