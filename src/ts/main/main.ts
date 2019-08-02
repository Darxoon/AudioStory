import {State} from "./state";
import {Dialogue} from "../place/dialogue";
import {drawTable} from "../interaction/visual";
import {Keyboard} from "../interaction/keyboard/keyboard";
import {Place} from "../place/place";
import {SaveHandler} from "../util/saveHandler";
import {Traveling} from "../util/traveling";
import * as Sounds from "interaction/sounds"

/**
 * Here's where all important information about the game are stored.
 */
export class Game {

	private static places: {[key: string]: Place[]};

	public static state: State = new State('Kottlington', 6, 0)

	public static registerPlaces(): void {
		this.places = {


			Kottlington: [
				new Dialogue('dialogue_talk_to_grandpa',     "kottlington.Grandpa",      ['tts_placeholder'],
					undefined,
					undefined,
					() => SaveHandler.setBoolean('story progression', 'talkedToGrandma', true)),
				new Dialogue( 'enemy_weak_rat_fight',    "kottlington.weakRat$1",    ['tts_placeholder']),
				new Dialogue('tts_placeholder',     "kottlington.Battlington",  ['tts_placeholder'],
					() => SaveHandler.getBoolean('story progression', 'talkedToGrandma'),
					undefined,
					() => Traveling.changeLocation('Battlington'))
			],
			Battlington: [
				new Dialogue('tts_placeholder',	"battlington.Pub",      ['tts_placeholder']),
				new Dialogue('tts_placeholder',	"battlington.slime$1",  ['tts_placeholder']),
				new Dialogue('tts_joins_fight',	"battlington.Kate",     ['tts_placeholder']),
				new Dialogue('tts_placeholder',	"battlington.egg$1",    ['tts_placeholder'],
					undefined,
					undefined,
					() => {console.log('thanks')}),
				new Dialogue('tts_placeholder',	"battlington.Justus",   ['tts_placeholder']),
			]


		}
	}
	public static getPlaces(): {[key: string]: Place[]} {return this.places}
}
export function start() {

	// show UI
	document.getElementById('location').style.display = null
	document.getElementById('save').style.display = null
	// hide front page
	document.getElementById('front_page').style.display = 'none'

	// register the places
	Game.registerPlaces()
	SaveHandler.initDatabase()

	// add the keyboard event listener
	document.addEventListener('keydown', (e: KeyboardEvent) => {
		Keyboard.keyDown(e)
	})
	document.addEventListener('keyup', (e: KeyboardEvent): void => {
		Keyboard.keyUp(e)
	})

	// add sounds
	function addSound(name: string) {
		Sounds.addSound(name, `src/sounds/${name}.wav`)
	}
	addSound('moved_selection')
	addSound('selection_confirmed')
	addSound('selection_not_possible')
	addSound('tts_placeholder')
	addSound('tts_joins_fight')
	addSound('enemy_rat_fight')
	addSound('blankspace')
	addSound('enemy_weak_rat_fight')
	addSound('dialogue_talk_to_grandpa')

	Sounds.loadAllSounds()

	slot = prompt("Which slot") || 'Unnamed'
	if(localStorage.getItem(`slot:${slot}`))
		SaveHandler.loadFromBrowserData(slot)
	else
		drawTable()


}