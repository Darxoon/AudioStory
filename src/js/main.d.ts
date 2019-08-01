declare module "interaction/sound" {
    export type Sound = {
        type: 'file';
        name: string;
    } | {
        type: 'tts';
        voice: string;
        text: string;
    } | string;
}
declare module "interaction/sounds" {
    import { Sound } from "interaction/sound";
    export function loadAndPlaySound(): void;
    export function addSound(name: string, path: string): void;
    export function loadAllSounds(): void;
    export function play(sound: Sound | Sound[], gain?: number, pan?: number, id?: string, behavior?: () => void, onEnd?: () => void): void;
    export function stop(id: string): void;
}
declare module "main/state" {
    /**
     * Expresses the player's progress, position and status.
     */
    export class State {
        health: number;
        maxHealth: number;
        location: string;
        selectedPlace: number;
        dialogueTextIndex: number;
        timeOutID: any;
        status: Status;
        constructor(location: string, maxHealth: number, selectedPlace?: number);
    }
    export enum Status {
        NONE = 0,
        MENU = 1,
        DIALOGUE = 2,
        FIGHT = 3
    }
}
declare module "place/place" {
    /**
     * An element in the menu screen
     */
    import { Sound } from "interaction/sound";
    export interface Place {
        menuVoiceName: Sound;
        id: string;
        isShown: () => boolean;
    }
}
declare module "place/dialogue" {
    import { Place } from "place/place";
    import { Sound } from "interaction/sound";
    export class Dialogue implements Place {
        displayName: string;
        menuVoiceName: Sound;
        id: string;
        text: Sound[];
        isShown: () => boolean;
        onEnter: () => number;
        onFinish: () => void | undefined;
        /**
         * A dialogue that can be selected in the menu. It can be a person, a sign or other things with text, or just a script that gets run.
         * @param menuVoiceName The name to play when you scroll over this in the menu.
         * @param id The id used to address this place.
         * @param text The text to read. The first function
         * @param isShown A function that determines whether or not it should show this dialogue
         * @param onEnter The function that gets run when you enter this place. Decides which text to read.
         * @param onFinish The function that gets run when you return to the menu.
         */
        constructor(menuVoiceName: Sound, id: string, text: Sound[], isShown?: () => boolean, onEnter?: () => number, onFinish?: () => void);
        /**
         * It exits from this dialogue.
         * @param finish Does onFinish?() get run?
         */
        exit(finish: boolean): void;
    }
}
declare module "util/dataPackage" {
    export interface DataPackage<T> {
        [valueName: string]: T;
    }
    export interface Database<T> {
        [dbName: string]: DataPackage<T>;
    }
}
declare module "util/saveHandler" {
    export namespace SaveHandler {
        function initDatabase(): void;
        function getString(packageName: string, valueName: string): string;
        function getNumber(packageName: string, valueName: string): number;
        function getBoolean(packageName: string, valueName: string): boolean;
        function setString(packageName: string, valueName: string, value: string): void;
        function setNumber(packageName: string, valueName: string, value: number): void;
        function setBoolean(packageName: string, valueName: string, value: boolean): void;
        function getEncryptedSave(): string;
        function loadEncryptedSave(text: string): void;
        function saveToBrowserData(slot?: string): void;
        function loadFromBrowserData(slot?: string): void;
        function getSaveAsText(): void;
        function loadSaveFromText(): void;
    }
}
declare module "util/traveling" {
    export class Traveling {
        /**
         * Switches to another location.
         * @param location Which location to go to
         * @param selectedPlace Which place to initially select
         */
        static changeLocation(location: string, selectedPlace?: number): void;
        /**
         * Opens up a dialogue.
         * @param index Which dialogue index to go
         * @param location In which location (leave black for loaded location)
         * @param initialText In which text index to go (optional)
         * @param runOnEnter (Depends)
         */
        static openDialogue(index: number, location?: string, initialText?: number, runOnEnter?: boolean): void;
    }
}
declare module "interaction/keyboard/keyboard" {
    export class Keyboard {
        static keys: {
            [val: string]: boolean;
        };
        static keyDown(e: KeyboardEvent): void;
        static keyUp(e: KeyboardEvent): void;
    }
}
declare module "main/main" {
    import { State } from "main/state";
    import { Place } from "place/place";
    /**
     * Here's where all important information about the game are stored.
     */
    export class Game {
        private static places;
        static state: State;
        static registerPlaces(): void;
        static getPlaces(): {
            [key: string]: Place[];
        };
    }
    export function start(): void;
}
declare module "interaction/visual" {
    export namespace Visual {
        let table: HTMLElement;
        let textBox: HTMLElement;
        let textBoxText: HTMLElement;
    }
    export function drawTable(): void;
    export let ph: string;
}
declare module "place/enemy" {
    import { Place } from "place/place";
    import { Sound } from "interaction/sound";
    export abstract class Enemy implements Place {
        menuVoiceName: Sound;
        id: string;
        isShown: () => boolean;
        fightName: Sound;
        init: () => NodeJS.Timeout;
    }
}
//# sourceMappingURL=main.d.ts.map