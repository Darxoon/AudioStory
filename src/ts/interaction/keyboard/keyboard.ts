/*
 * Here all the keyboard information is stored.
 */
import {Game} from "../../main/main";
import {Dialogue} from "../../place/dialogue";
import {Status} from "../../main/state";
import {drawTable} from "../visual";
import {Traveling} from "../../util/traveling";
import * as Sounds from "interaction/sounds"

export class Keyboard {

	static keys: { [val: string]: boolean } = {
		'w': false,
		'a': false,
		's': false,
		'd': false,
		' ': false,
		'Escape': false,
		'e': false,
	}


	// public static keyDown   (e: KeyboardEvent) { console.log(this.keys[e.key]) }
	public static keyDown(e: KeyboardEvent) { if (this.keys[e.key] !== undefined) this.keys[e.key] = true; /*console.log(e)*/ keyPressed(e) }
	public static keyUp(e: KeyboardEvent) { if (this.keys[e.key] !== undefined) this.keys[e.key] = false }
}

let canEnterPlace: boolean = true

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
					canEnterPlace = false
					Sounds.play('moved_selection', 1, 0, undefined, undefined, () => {
						Sounds.play(currentLocation[Game.state.selectedPlace].menuVoiceName, 1, 0, 'menuVoiceName', undefined, () => {
							canEnterPlace = true
						})
					})
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
					canEnterPlace = false
					Sounds.play('moved_selection', 1, 0, undefined, undefined, () => {
						Sounds.play(currentLocation[Game.state.selectedPlace].menuVoiceName, 1, 0, 'menuVoiceName', undefined, () => {
							canEnterPlace = true
						})
					})
				}
				break

			case ' ':

				if(canEnterPlace) {
					Sounds.play('selection_confirmed', 1, 0, undefined, () => {
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

			case 'Escape':
				let currentPlaceEsc = Game.getPlaces()[Game.state.location][Game.state.selectedPlace]
				if (currentPlaceEsc instanceof Dialogue) {
					let currentDialogue: Dialogue = currentPlaceEsc
					clearTimeout(Game.state.timeOutID)
					currentDialogue.exit(false)
				}
				break

			case ' ':
				let currentPlaceE = Game.getPlaces()[Game.state.location][Game.state.selectedPlace]
				if (currentPlaceE instanceof Dialogue) {
					let currentDialogue: Dialogue = currentPlaceE
					clearTimeout(Game.state.timeOutID)
					currentDialogue.exit(true)
				}
				break


		}
		/* #endregion */
	}

	drawTable()

}