import {Game} from "../main/main"
import {Status} from "../main/state"
import {Place} from "./place"
import {Sound} from "../interaction/sound";

export class Dialogue implements Place {

	displayName: string
	menuVoiceName: Sound
	id: string

	text: Sound[]
	isShown: () => boolean
	onEnter: () => number
	onFinish: () => void | undefined

	/**
	 * A dialogue that can be selected in the menu. It can be a person, a sign or other things with text, or just a script that gets run.
	 * @param menuVoiceName The name to play when you scroll over this in the menu.
	 * @param id The id used to address this place.
	 * @param text The text to read. The first function
	 * @param isShown A function that determines whether or not it should show this dialogue
	 * @param onEnter The function that gets run when you enter this place. Decides which text to read.
	 * @param onFinish The function that gets run when you return to the menu.
	 */
	constructor (menuVoiceName: Sound, id: string, text: Sound[], isShown: () => boolean = () => true, onEnter: () => number = () => 0, onFinish?: () => void) {
		this.menuVoiceName = menuVoiceName
		this.id = id
		this.text = text
		this.isShown = isShown
		this.onEnter = onEnter
		this.onFinish = onFinish
	}

	/**
	 * It exits from this dialogue.
	 * @param finish Does onFinish?() get run?
	 */
	public exit(finish: boolean): void {
		Game.state.status = Status.MENU
		if(finish && this.onFinish)
			this.onFinish()
	}

}