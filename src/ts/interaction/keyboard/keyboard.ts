/*
 * Here all the keyboard information is stored.
 */
import {Game} from "../../main/main";
import {Dialogue} from "../../place/dialogue";
import {Status} from "../../main/state";
import {drawTable} from "../visual";
import {Traveling} from "../../util/traveling";
import * as Sounds from "interaction/sounds"

export namespace Keyboard {

	export const keys: { [val: string]: boolean } = {
		'w': false,
		'a': false,
		's': false,
		'd': false,
		' ': false,
		'Escape': false,
		'e': false,
	}

	export let canEnterPlace: boolean = true

	// public static keyDown   (e: KeyboardEvent) { console.log(this.keys[e.key]) }
	export function keyDown(e: KeyboardEvent) { if (keys[e.key] !== undefined) keys[e.key] = true; /*console.log(e)*/ keyPressed(e) }
	export function keyUp(e: KeyboardEvent) { if (keys[e.key] !== undefined) keys[e.key] = false }
}


function keyPressed(e: KeyboardEvent) {
	if (Game.state.status === Status.MENU) {
		/* region While being in the MENU */
		const currentLocation = Game.getPlaces()[Game.state.location]
		switch (e.key) {
			case 'w':

				if(--Game.state.selectedPlace >= 0 && !currentLocation[Game.state.selectedPlace].isShown())
					Game.state.selectedPlace--
				if (Game.state.selectedPlace < 0) {
					Game.state.selectedPlace = 0
					Sounds.play('selection_not_possible')
					if(!currentLocation[Game.state.selectedPlace].isShown())
						Game.state.selectedPlace++
				} else {
					Keyboard.canEnterPlace = false
					Sounds.play('moved_selection')
						.then(() => {
							return Sounds.play(currentLocation[Game.state.selectedPlace].menuVoiceName, 1, 0, 'menuVoiceName')
						})
						.then(() => Keyboard.canEnterPlace = true)
				}
				break

			case 's':

				if (++Game.state.selectedPlace < currentLocation.length && !currentLocation[Game.state.selectedPlace].isShown())
					Game.state.selectedPlace++
				if(Game.state.selectedPlace >= currentLocation.length) {
					Game.state.selectedPlace = currentLocation.length - 1
					Sounds.play('selection_not_possible')
					if(!currentLocation[Game.state.selectedPlace].isShown())
						Game.state.selectedPlace--
				} else {
					Keyboard.canEnterPlace = false
					Sounds.play('moved_selection')
						.then(() => {
							return Sounds.play(currentLocation[Game.state.selectedPlace].menuVoiceName, 1, 0, 'menuVoiceName')
						})
						.then(() => Keyboard.canEnterPlace = true)
				}
				break

			case ' ':

				if(Keyboard.canEnterPlace) {
					Sounds.play('selection_confirmed')
						.then(() => {
							let currentPlace = Game.getPlaces()[Game.state.location][Game.state.selectedPlace]
							if (currentPlace instanceof Dialogue) {

								Traveling.openDialogue(Game.state.selectedPlace)

							} else
								console.log("let's fight, I guess")
							drawTable()
						})
					Game.state.status = Status.NONE
				}

				break
		}

		/* #endregion */
	} else if (Game.state.status === Status.DIALOGUE) {
		/* region While being in a DIALOGUE */
		switch (e.key) {

			case 'b':
				let currentPlaceB = Game.getPlaces()[Game.state.location][Game.state.selectedPlace]
				if (currentPlaceB instanceof Dialogue) {
					let currentDialogue: Dialogue = currentPlaceB
					clearTimeout(Game.state.timeOutID)
					currentDialogue.exit(false)
				}
				break

			case ' ':
				let currentPlaceSpace = Game.getPlaces()[Game.state.location][Game.state.selectedPlace]
				if (currentPlaceSpace instanceof Dialogue) {
					let currentDialogue: Dialogue = currentPlaceSpace
					clearTimeout(Game.state.timeOutID)
					currentDialogue.exit(true)
				}
				break


		}
		/* #endregion */
	}

	drawTable()

}