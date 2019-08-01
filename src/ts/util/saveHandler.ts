import {Database} from "./dataPackage";
import {Game} from "../main/main";
import {drawTable} from "../interaction/visual";

declare namespace BSON {
	export function serialize(object: {}, options?: {}): Uint8Array;
	export function deserialize(buffer: Uint8Array, options?: {}): {};

}

export namespace SaveHandler {
	let stringDatabase: Database<string> = {}
	let numberDatabase: Database<number> = {}
	let booleanDatabase: Database<boolean> = {}

	export function initDatabase() {
		stringDatabase = {
			'names': {
				playerName: 'John Doe',
				opponentName: 'Peter Hook'
		 	},
			'inventory': {
				content: 'mysticalScroll|dragonMedal|map'
			},
			'misc': {
				location: 'Kottlington'
			}
		}
		numberDatabase = {
			'player stats': {
				health: 6,
				maxHealth: 6,
				baseAttackDamage: 3,
				inventorySize: 16,
				money: 500
			},
			'quests': {
				masterCook: 0
			}
		}
		booleanDatabase = {
			'places visited': {
				Kottlington: true,
				Battlington: false,
				KapKapTown: false
			},
			'story progression': {
				talkedToGrandma: false
			}
		}
	}

	//region Getters
	export function getString(packageName: string, valueName: string): string {
		return stringDatabase[packageName][valueName]
	}
	export function getNumber(packageName: string, valueName: string): number {
		return numberDatabase[packageName][valueName]
	}
	export function getBoolean(packageName: string, valueName: string): boolean {
		return booleanDatabase[packageName][valueName]
	}
	//endregion

	//region Setters
	export function setString(packageName: string, valueName: string, value: string): void {
		stringDatabase[packageName][valueName] = value
	}
	export function setNumber(packageName: string, valueName: string, value: number): void {
		numberDatabase[packageName][valueName] = value
	}
	export function setBoolean(packageName: string, valueName: string, value: boolean): void {
		booleanDatabase[packageName][valueName] = value
	}
	//endregion


	//region Encryption / BSON Saving
	export function getEncryptedSave(): string {
		return BSON.serialize([stringDatabase, numberDatabase, booleanDatabase]).join(' ')
	}


	export function loadEncryptedSave(text: string): void {
		const save: [Database<string>, Database<number>, Database<boolean>] = BSON.deserialize(Uint8Array.from(text.split(' ').map(x => parseInt(x)))) as [Database<string>, Database<number>, Database<boolean>]
		stringDatabase 	= save[0]
		numberDatabase 	= save[1]
		booleanDatabase = save[2]
		Game.state.location = getString('misc', 'location')
		Game.state.selectedPlace = 0
		drawTable()
	}
	//endregion
	
	//region Local Storage Saving
	export function saveToBrowserData(slot: string = "Unnamed"): void {
		const encryptedSave = getEncryptedSave()
		localStorage.setItem(`slot:${slot}`, encryptedSave)
	}
	export function loadFromBrowserData(slot: string = "Unnamed") {
		const text = localStorage.getItem(`slot:${slot}`)
		if(!text)
			throw "That slot doesn't exist!"
		loadEncryptedSave(text)
	}
	//endregion

	//region Text Saving
	export function getSaveAsText() {
		const output: HTMLTextAreaElement | null = document.getElementById('save_output') as HTMLTextAreaElement | null
		if(!output)
			throw "Cannot find output textarea!"
		output.style.display = null
		output.value = getEncryptedSave()
	}
	export function loadSaveFromText() {
		// show
		const input: HTMLTextAreaElement | null = document.getElementById('save_output') as HTMLTextAreaElement | null
		if(!input)
			throw "Cannot find input textarea!"
		input.style.display = null
		input.value = ""
		const submitButton: HTMLButtonElement | null = document.getElementById('save_submit') as HTMLButtonElement | null
		if(!submitButton)
			throw "Cannot find submit button!"
		submitButton.style.display = null
		const cancelButton: HTMLButtonElement | null = document.getElementById('save_cancel') as HTMLButtonElement | null
		if(!cancelButton)
			throw "Cannot find cancel button!"
		cancelButton.style.display = null

		// add button event listener
		function inputDone() {
			if (submitButton != null && cancelButton != null && input != null) {
				submitButton.removeEventListener('click', submitListener)
				cancelButton.removeEventListener('click', cancelListener)

				input.style.display = 'none'
				submitButton.style.display = 'none'
				cancelButton.style.display = 'none'
			}
		}
		function submitListener() {
			const inputArea: HTMLTextAreaElement = input as HTMLTextAreaElement
			try {
				loadEncryptedSave(inputArea.value)
				inputDone()
			} catch (e) {
				const errorBox: HTMLDivElement = document.getElementById('save_load_error_box') as HTMLDivElement
				errorBox.style.display = null
			}
		}
		function cancelListener() {
			inputDone()
		}
		submitButton.addEventListener('click', submitListener)
		cancelButton.addEventListener('click', cancelListener)
	}
	//endregion


	document.getElementById('save_to_browser_data').addEventListener('click', 	() => saveToBrowserData(slot))
	document.getElementById('save_as_text').addEventListener('click', 			() => getSaveAsText())
	document.getElementById('load_from_text').addEventListener('click', 		() => loadSaveFromText())
	document.getElementById('load_from_browser_data').addEventListener('click',	() => loadFromBrowserData(slot))
}

