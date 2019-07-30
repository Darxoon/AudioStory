import {Game} from "../main/main";
import {Status} from "../main/state";
import {Place} from "../place/place";

export namespace Visual {
	export let table: HTMLElement;
	export let textBox: HTMLElement;
	export let textBoxText: HTMLElement;
}
export function drawTable () {


	if(Game.state.status === Status.DIALOGUE) {
		Visual.textBox.style.display = null
		Visual.table.style.display = 'none'
	} else {
		Visual.textBox.style.display = 'none'
		Visual.table.style.display = null
	}


	let table: Element = Visual.table;
	let currentPlace: Place[] = Game.getPlaces()[Game.state.location];

	for (let i = table.children.length - 1; i > 0; i--) {
		const element = table.children[i];
		table.removeChild(element)
	}

	for (let i = 0; i < currentPlace.length; i++) {
		const element = currentPlace[i];
		addRow(Game.state.selectedPlace === i, element.isShown() ? element.displayName : `(${element.displayName})...`, element.id, table, element.isShown())
	}

}
export let ph = 'My secret Passphrase'
function addRow(isSelected: boolean, displayName: string, id: string, table: Element, isShown: boolean) {
	let row = table.appendChild(document.createElement('tr'))
	row.className = 'locationRow'

	let selected = document.createElement('td')
	selected.appendChild(document.createTextNode(isSelected ? '>' : isShown ? ' ' : '❌'))
	row.appendChild(selected)

	let dname = document.createElement('td')
	dname.appendChild(document.createTextNode(displayName))
	row.appendChild(dname)

	let did = document.createElement('td')
	did.appendChild(document.createTextNode(id))
	row.appendChild(did)

}
