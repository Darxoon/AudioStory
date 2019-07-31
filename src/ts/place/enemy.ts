import {Place} from "./place"
import {Sound} from "../interaction/sound";

export abstract class Enemy implements Place {

	displayName: string
	menuVoiceName: Sound
	id: string
	isShown: () => boolean

	fightName: Sound

	init: () => NodeJS.Timeout

}