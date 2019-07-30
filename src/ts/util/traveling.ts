import {Game} from "../main/main"
import {Status} from "../main/state"
import {Dialogue} from "../place/dialogue"
import {drawTable, Visual} from "../interaction/visual"
import {SaveHandler} from "./saveHandler"

export class Traveling {

	/**
	 * Switches to another location.
	 * @param location Which location to go to
	 * @param selectedPlace Which place to initially select
	 */
	static changeLocation(location: string, selectedPlace: number = 0): void {
		if(Game.getPlaces()[location] !== undefined) {
			Game.state.location = location
			Game.state.selectedPlace = selectedPlace
			SaveHandler.setBoolean('places visited', location, true)
			SaveHandler.setString('misc', 'location', location)
		} else
			throw `The location '${location}' doesn't exist!`
	}

	/**
	 * Opens up a dialogue.
	 * @param index Which dialogue index to go
	 * @param location In which location (leave black for loaded location)
	 * @param initialText In which text index to go (optional)
	 * @param runOnEnter (Depends)
	 */
	static openDialogue(index: number, location: string = Game.state.location, initialText?: number, runOnEnter?: boolean): void {
		/* Changes the textbox's contents */

		// Checks if runOnEnter is given or not
		let runOnEnterBool: boolean
		if (initialText !== undefined) {
			if (runOnEnter === undefined)
				runOnEnterBool = true
			else
				runOnEnterBool = runOnEnter
		} else {
			if (runOnEnter !== undefined)
				throw new Error("Specified not to execute runOnEnter but didn't give an initial text!")
			runOnEnterBool = true
		}

		// if (runOnEnter !== undefined)
		//     runOnEnterBool = runOnEnter
		// else if (initialText === undefined)
		//     throw new Error("Specified not to execute runOnEnter but didn't give an initial text!")
		// else runOnEnterBool = true

		// Set the status
		Game.state.status = Status.DIALOGUE

		// Check if it actually is a dialogue
		let currentPlace = Game.getPlaces()[location][index]
		if (currentPlace instanceof Dialogue) {
			let currentDialogue: Dialogue = currentPlace

			// Set the title
			Visual.textBox.children[0].innerHTML = currentDialogue.displayName

			// Set the content
			let dialogueTextIndex
			if(runOnEnterBool)
				dialogueTextIndex = currentDialogue.onEnter()
			if (initialText)
				dialogueTextIndex = initialText

			Visual.textBoxText.innerHTML = currentDialogue.text[dialogueTextIndex]
			console.log(currentDialogue.displayName, currentDialogue.text, "Enter normally:", initialText === undefined && runOnEnterBool)

			Game.state.timeOutID = setTimeout(() => {currentDialogue.exit(true); drawTable()}, 5000)

		} else
			throw new Error(`The selected place (${location}[${index}] id: "${Game.getPlaces()[location][index].id}") is NOT a dialogue!`)

	}

}