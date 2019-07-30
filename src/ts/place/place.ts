/**
 * An element in the menu screen
 */
export interface Place {

	displayName: string;
	id: string;

	isShown: () => boolean

}