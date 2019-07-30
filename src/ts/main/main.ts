import {State} from "./state";
import {Dialogue} from "../place/dialogue";
import {drawTable, Visual} from "../interaction/visual";
import {Keyboard} from "../interaction/keyboard/keyboard";
import {Place} from "../place/place";
import {SaveHandler} from "../util/saveHandler";
import {Traveling} from "../util/traveling";

/**
 * Here's where all important information about the game are stored.
 */
export class Game {

	private static places: {[key: string]: Place[]};

	public static state: State = new State('Kottlington', 6, 0)

	public static registerPlaces(): void {
		this.places = {


			Kottlington: [
				new Dialogue("Grandma's cottage", "kottlington.Grandma", ["Hey! I don't want you, go to Battlington."], undefined, undefined,
					() => SaveHandler.setBoolean('story progression', 'talkedToGrandma', true)),
				new Dialogue("A weak rat", "kottlington.weakRat$1", ["Hey. I'm nice to you. Please go away."]),
				new Dialogue("Travel to Battlington", "kottlington.Battlington", ["You go to Battlington"],
					() => SaveHandler.getBoolean('story progression', 'talkedToGrandma'),
					undefined,
					() => Traveling.changeLocation('Battlington'))
			],
			Battlington: [
				new Dialogue("The pub 'the great dragon'",  "battlington.Pub",      ["Hey!"]),
				new Dialogue("A slime",                     "battlington.slime$1",  ["Hey. I'm nice to you. Please go away."]),
				new Dialogue("Kate's house",                "battlington.Kate",     ["Hey! I'm Kate."]),
				new Dialogue("An egg with legs",            "battlington.egg$1",    ["Hey. I'm nice to you. Please go away."], undefined, undefined, () => {console.log('thanks')}),
				new Dialogue("Justus's house",              "battlington.Justus",   ["Hey! I'm Justus."]),
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

	// do the visuals
	let table = document.getElementById('location')
	if (table instanceof HTMLElement)
		Visual.table = table;
	else
		throw new Error("Can't find html table '#location'!")
	let textBox = document.getElementById('textbox_frame')
	if (textBox instanceof HTMLElement)
		Visual.textBox = textBox;
	else
		throw new Error("Can't find the textbox!")
	let textBoxText = document.getElementById('textbox')
	if (textBoxText instanceof HTMLElement)
		Visual.textBoxText = textBoxText;
	else
		throw new Error("Can't find the textbox's contents!")

	slot = prompt("Which slot") || 'Unnamed'
	if(localStorage.getItem(`slot:${slot}`) !== undefined)
		SaveHandler.loadFromBrowserData(slot)
	else
		drawTable()
}