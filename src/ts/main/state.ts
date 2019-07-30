/**
 * Expresses the player's progress, position and status.
 */
export class State {

	public health: number;
	public maxHealth: number;

	public location: string;
	public selectedPlace: number = 0;

	public dialogueTextIndex: number = 0;
	public timeOutID: any = 0;

	public status: Status = Status.MENU;

	constructor (location: string, maxHealth: number, selectedPlace?: number) {
		this.health = maxHealth;
		this.maxHealth = maxHealth;
		this.location = location;
		if(selectedPlace !== undefined) this.selectedPlace = selectedPlace;
	}

}

export enum Status {
	MENU,
	DIALOGUE,
	FIGHT
}

