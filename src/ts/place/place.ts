/**
 * An element in the menu screen
 */
import {Sound} from "../interaction/sound"

export interface Place {

	displayName: string
	menuVoiceName: Sound
	id: string

	isShown: () => boolean

}