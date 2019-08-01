import {Game} from "../main/main"
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



	}

}