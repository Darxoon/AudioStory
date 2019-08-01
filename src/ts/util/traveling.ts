import {Game} from "../main/main"
import {SaveHandler} from "./saveHandler"
import {Dialogue} from "../place/dialogue";
import {Status} from "../main/state";
import * as Sounds from "interaction/sounds";
import {Keyboard} from "../interaction/keyboard/keyboard";

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
	 * Opens a dialogue
	 * @param index The index in the location that gets opened
	 * @param location The location to open the dialogue in, defaults to the current location
	 * @param initialText The text to jump to
	 * @param runOnEnter Whether it should run onEnter, if initialText isn't specified, it will default to true
	 */
	static openDialogue(index: number, location: string = Game.state.location, initialText?: number, runOnEnter: boolean = true): void {

		// get the place
		const place = Game.getPlaces()[location][index]

		// check if it's a dialogue
		if(place instanceof Dialogue) {
			console.log(`Talking to '${place.id}'`)

			// change status
			Game.state.status = Status.DIALOGUE

			// get initialText
			if(initialText) {
				if (runOnEnter)
					place.onEnter()
			} else {
				initialText = place.onEnter()
			}

			// play sound
			console.log(place.text, initialText)
			Sounds.play([place.text[initialText], 'blankspace'], 1, 0, 'currentDialogue')
				.then(() => {
					Game.state.status = Status.MENU
					Keyboard.canEnterPlace = false
					return Sounds.play(Game.getPlaces()[Game.state.location][Game.state.selectedPlace].menuVoiceName, 1, 0, 'menuVoiceName')
				})
				.then(() => Keyboard.canEnterPlace = true)

		} else
			throw `The place ('${place.id}') is not a dialogue!`

	}

}