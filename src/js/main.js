var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
define("interaction/sound", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("interaction/sounds", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function loadAndPlaySound() {
        const context = new AudioContext();
        const request = new XMLHttpRequest();
        request.open('GET', 'src/sounds/moved_selection.wav', true);
        request.responseType = 'arraybuffer';
        request.onload = () => {
            console.log(request.response);
            context.decodeAudioData(request.response)
                .then(x => {
                const audioBuffer = x;
                const source = context.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(context.destination);
                source.start();
            })
                .catch(x => {
                console.error(x);
            });
        };
        request.send(null);
    }
    exports.loadAndPlaySound = loadAndPlaySound;
    const context = new AudioContext();
    const soundLoadQueue = [];
    const soundLib = {};
    const soundsPlayingWithID = new Map();
    function addSound(name, path) {
        soundLoadQueue.push({ name, path: path });
    }
    exports.addSound = addSound;
    function loadAllSounds() {
        soundLoadQueue.forEach(value => {
            const request = new XMLHttpRequest();
            request.open('GET', value.path, true);
            request.responseType = 'arraybuffer';
            request.onload = () => {
                context.decodeAudioData(request.response)
                    .then(audioBuffer => {
                    soundLib[value.name] = audioBuffer;
                })
                    .catch(reason => {
                    console.error(reason);
                });
            };
            request.send(null);
        });
        console.log(soundLib);
    }
    exports.loadAllSounds = loadAllSounds;
    function combineAudioBuffers(audioBuffers) {
        // iterate through channels
        const minChannelAmount = audioBuffers.reduce((previousValue, currentValue) => { console.log(currentValue); return Math.min(previousValue, currentValue.numberOfChannels); }, 100), combinedDuration = audioBuffers.reduce((previousValue, currentValue) => { return previousValue + currentValue.length; }, 0), newBuffer = context.createBuffer(minChannelAmount, combinedDuration, audioBuffers[0].sampleRate);
        for (let i = 0; i < minChannelAmount; i++) {
            const channelData = newBuffer.getChannelData(i);
            // iterate through audioBuffers
            for (let j = 0, channelPosition = 0; j < audioBuffers.length; j++) {
                channelData.set(audioBuffers[j].getChannelData(i), channelPosition);
                channelPosition += audioBuffers[j].length;
            }
        }
        return newBuffer;
    }
    function textToSpeech(sound) {
        console.log('text to speech:', sound);
        return soundLib.tts_placeholder;
    }
    function playBuffer(audioBuffer, gain = 1, pan = 0, id, behavior, onEnd) {
        const source = context.createBufferSource();
        source.buffer = audioBuffer;
        const gainNode = context.createGain();
        gainNode.gain.value = gain;
        source.connect(gainNode);
        const pannerNode = context.createStereoPanner();
        pannerNode.pan.value = pan;
        gainNode.connect(pannerNode);
        pannerNode.connect(context.destination);
        source.start();
        if (id) {
            if (soundsPlayingWithID.has(id))
                soundsPlayingWithID.get(id).stop();
            soundsPlayingWithID.set(id, source);
        }
        if (behavior) {
            let interval;
            interval = setInterval(behavior, 1);
            source.addEventListener('ended', () => {
                clearInterval(interval);
                if (onEnd)
                    onEnd();
            });
        }
        else if (onEnd)
            source.addEventListener('ended', onEnd);
    }
    function play(sound, gain = 1, pan = 0, id, behavior, onEnd = () => { }) {
        console.log(sound);
        return new Promise((resolve, reject) => {
            try {
                // if it's an array, combine it and play it
                if (sound instanceof Array) {
                    playBuffer(combineAudioBuffers(sound.map(value => {
                        if (typeof value === 'string')
                            value = { type: 'file', name: value };
                        if (value.type === 'tts')
                            return textToSpeech(value);
                        else
                            return soundLib[value.name];
                    })), gain, pan, id, behavior, () => {
                        onEnd();
                        resolve();
                    });
                }
                else {
                    console.log(sound);
                    // if it's a string, convert it to an object
                    if (typeof sound === 'string')
                        sound = { type: 'file', name: sound };
                    console.log(sound);
                    // if it's a file, play item from soundLib
                    if (sound.type === 'file') {
                        if (soundLib[sound.name]) {
                            playBuffer(soundLib[sound.name], gain, pan, id, behavior, () => {
                                onEnd();
                                resolve();
                            });
                        }
                        else
                            console.error(`Sound called '${sound.name} doesn't exist`);
                    }
                    else {
                        // play text-to-speech
                        playBuffer(textToSpeech(sound), gain, pan, id, behavior, () => {
                            onEnd();
                            resolve();
                        });
                    }
                }
            }
            catch (e) {
                reject(e);
            }
        });
    }
    exports.play = play;
    function stop(id) {
        if (soundsPlayingWithID.has(id))
            soundsPlayingWithID.get(id).stop();
        else
            console.error("There's no sound playing with the given id", id);
    }
    exports.stop = stop;
});
define("main/state", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Expresses the player's progress, position and status.
     */
    class State {
        constructor(location, maxHealth, selectedPlace) {
            this.selectedPlace = 0;
            this.dialogueTextIndex = 0;
            this.timeOutID = 0;
            this.status = Status.MENU;
            this.health = maxHealth;
            this.maxHealth = maxHealth;
            this.location = location;
            if (selectedPlace !== undefined)
                this.selectedPlace = selectedPlace;
        }
    }
    exports.State = State;
    var Status;
    (function (Status) {
        Status[Status["NONE"] = 0] = "NONE";
        Status[Status["MENU"] = 1] = "MENU";
        Status[Status["DIALOGUE"] = 2] = "DIALOGUE";
        Status[Status["FIGHT"] = 3] = "FIGHT";
    })(Status = exports.Status || (exports.Status = {}));
});
define("place/place", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("place/dialogue", ["require", "exports", "main/main", "main/state"], function (require, exports, main_1, state_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Dialogue {
        /**
         * A dialogue that can be selected in the menu. It can be a person, a sign or other things with text, or just a script that gets run.
         * @param menuVoiceName The name to play when you scroll over this in the menu.
         * @param id The id used to address this place.
         * @param text The text to read. The first function
         * @param isShown A function that determines whether or not it should show this dialogue
         * @param onEnter The function that gets run when you enter this place. Decides which text to read.
         * @param onFinish The function that gets run when you return to the menu.
         */
        constructor(menuVoiceName, id, text, isShown = () => true, onEnter = () => 0, onFinish) {
            this.menuVoiceName = menuVoiceName;
            this.id = id;
            this.text = text;
            this.isShown = isShown;
            this.onEnter = onEnter;
            this.onFinish = onFinish;
        }
        /**
         * It exits from this dialogue.
         * @param finish Does onFinish?() get run?
         */
        exit(finish) {
            console.log('exiting from', this.id, finish);
            main_1.Game.state.status = state_1.Status.MENU;
            if (finish && this.onFinish)
                this.onFinish();
        }
    }
    exports.Dialogue = Dialogue;
});
define("util/dataPackage", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("util/saveHandler", ["require", "exports", "main/main", "interaction/visual"], function (require, exports, main_2, visual_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SaveHandler;
    (function (SaveHandler) {
        let stringDatabase = {};
        let numberDatabase = {};
        let booleanDatabase = {};
        function initDatabase() {
            stringDatabase = {
                'names': {
                    playerName: 'John Doe',
                    opponentName: 'Peter Hook'
                },
                'inventory': {
                    content: 'mysticalScroll|dragonMedal|map'
                },
                'misc': {
                    location: 'Kottlington'
                }
            };
            numberDatabase = {
                'player stats': {
                    health: 6,
                    maxHealth: 6,
                    baseAttackDamage: 3,
                    inventorySize: 16,
                    money: 500
                },
                'quests': {
                    masterCook: 0
                }
            };
            booleanDatabase = {
                'places visited': {
                    Kottlington: true,
                    Battlington: false,
                    KapKapTown: false
                },
                'story progression': {
                    talkedToGrandma: false
                }
            };
        }
        SaveHandler.initDatabase = initDatabase;
        //region Getters
        function getString(packageName, valueName) {
            return stringDatabase[packageName][valueName];
        }
        SaveHandler.getString = getString;
        function getNumber(packageName, valueName) {
            return numberDatabase[packageName][valueName];
        }
        SaveHandler.getNumber = getNumber;
        function getBoolean(packageName, valueName) {
            return booleanDatabase[packageName][valueName];
        }
        SaveHandler.getBoolean = getBoolean;
        //endregion
        //region Setters
        function setString(packageName, valueName, value) {
            stringDatabase[packageName][valueName] = value;
        }
        SaveHandler.setString = setString;
        function setNumber(packageName, valueName, value) {
            numberDatabase[packageName][valueName] = value;
        }
        SaveHandler.setNumber = setNumber;
        function setBoolean(packageName, valueName, value) {
            booleanDatabase[packageName][valueName] = value;
        }
        SaveHandler.setBoolean = setBoolean;
        //endregion
        //region Encryption / BSON Saving
        function getEncryptedSave() {
            return BSON.serialize([stringDatabase, numberDatabase, booleanDatabase]).join(' ');
        }
        SaveHandler.getEncryptedSave = getEncryptedSave;
        function loadEncryptedSave(text) {
            const save = BSON.deserialize(Uint8Array.from(text.split(' ').map(x => parseInt(x))));
            stringDatabase = save[0];
            numberDatabase = save[1];
            booleanDatabase = save[2];
            main_2.Game.state.location = getString('misc', 'location');
            main_2.Game.state.selectedPlace = 0;
            visual_1.drawTable();
        }
        SaveHandler.loadEncryptedSave = loadEncryptedSave;
        //endregion
        //region Local Storage Saving
        function saveToBrowserData(slot = "Unnamed") {
            const encryptedSave = getEncryptedSave();
            localStorage.setItem(`slot:${slot}`, encryptedSave);
        }
        SaveHandler.saveToBrowserData = saveToBrowserData;
        function loadFromBrowserData(slot = "Unnamed") {
            const text = localStorage.getItem(`slot:${slot}`);
            if (!text)
                throw "That slot doesn't exist!";
            loadEncryptedSave(text);
        }
        SaveHandler.loadFromBrowserData = loadFromBrowserData;
        //endregion
        //region Text Saving
        function getSaveAsText() {
            const output = document.getElementById('save_output');
            if (!output)
                throw "Cannot find output textarea!";
            output.style.display = null;
            output.value = getEncryptedSave();
        }
        SaveHandler.getSaveAsText = getSaveAsText;
        function loadSaveFromText() {
            // show
            const input = document.getElementById('save_output');
            if (!input)
                throw "Cannot find input textarea!";
            input.style.display = null;
            input.value = "";
            const submitButton = document.getElementById('save_submit');
            if (!submitButton)
                throw "Cannot find submit button!";
            submitButton.style.display = null;
            const cancelButton = document.getElementById('save_cancel');
            if (!cancelButton)
                throw "Cannot find cancel button!";
            cancelButton.style.display = null;
            // add button event listener
            function inputDone() {
                if (submitButton != null && cancelButton != null && input != null) {
                    submitButton.removeEventListener('click', submitListener);
                    cancelButton.removeEventListener('click', cancelListener);
                    input.style.display = 'none';
                    submitButton.style.display = 'none';
                    cancelButton.style.display = 'none';
                }
            }
            function submitListener() {
                const inputArea = input;
                try {
                    loadEncryptedSave(inputArea.value);
                    inputDone();
                }
                catch (e) {
                    const errorBox = document.getElementById('save_load_error_box');
                    errorBox.style.display = null;
                }
            }
            function cancelListener() {
                inputDone();
            }
            submitButton.addEventListener('click', submitListener);
            cancelButton.addEventListener('click', cancelListener);
        }
        SaveHandler.loadSaveFromText = loadSaveFromText;
        //endregion
        document.getElementById('save_to_browser_data').addEventListener('click', () => saveToBrowserData(slot));
        document.getElementById('save_as_text').addEventListener('click', () => getSaveAsText());
        document.getElementById('load_from_text').addEventListener('click', () => loadSaveFromText());
        document.getElementById('load_from_browser_data').addEventListener('click', () => loadFromBrowserData(slot));
    })(SaveHandler = exports.SaveHandler || (exports.SaveHandler = {}));
});
define("util/traveling", ["require", "exports", "main/main", "util/saveHandler", "place/dialogue", "main/state", "interaction/sounds", "interaction/keyboard/keyboard", "interaction/visual"], function (require, exports, main_3, saveHandler_1, dialogue_1, state_2, Sounds, keyboard_1, visual_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Sounds = __importStar(Sounds);
    class Traveling {
        /**
         * Switches to another location.
         * @param location Which location to go to
         * @param selectedPlace Which place to initially select
         */
        static changeLocation(location, selectedPlace = 0) {
            if (main_3.Game.getPlaces()[location] !== undefined) {
                main_3.Game.state.location = location;
                main_3.Game.state.selectedPlace = selectedPlace;
                saveHandler_1.SaveHandler.setBoolean('places visited', location, true);
                saveHandler_1.SaveHandler.setString('misc', 'location', location);
            }
            else
                throw `The location '${location}' doesn't exist!`;
        }
        /**
         * Opens a dialogue
         * @param index The index in the location that gets opened
         * @param location The location to open the dialogue in, defaults to the current location
         * @param initialText The text to jump to
         * @param runOnEnter Whether it should run onEnter, if initialText isn't specified, it will default to true
         */
        static openDialogue(index, location = main_3.Game.state.location, initialText, runOnEnter = true) {
            // get the place
            const place = main_3.Game.getPlaces()[location][index];
            // check if it's a dialogue
            if (place instanceof dialogue_1.Dialogue) {
                console.log(`Talking to '${place.id}'`);
                // change status
                main_3.Game.state.status = state_2.Status.DIALOGUE;
                // get initialText
                if (initialText) {
                    if (runOnEnter)
                        place.onEnter();
                }
                else {
                    initialText = place.onEnter();
                }
                // play sound
                console.log(place.text, initialText);
                Sounds.play(place.text[initialText], 1, 0, 'currentDialogue')
                    .then(() => {
                    console.log(this.endByDefault);
                    keyboard_1.Keyboard.canEnterPlace = true;
                    if (this.endByDefault)
                        place.exit(true);
                    else
                        this.endByDefault = true;
                    visual_2.drawTable();
                });
            }
            else
                throw `The place ('${place.id}') is not a dialogue!`;
        }
    }
    Traveling.endByDefault = true;
    exports.Traveling = Traveling;
});
define("interaction/keyboard/keyboard", ["require", "exports", "main/main", "place/dialogue", "main/state", "interaction/visual", "util/traveling", "interaction/sounds"], function (require, exports, main_4, dialogue_2, state_3, visual_3, traveling_1, Sounds) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Sounds = __importStar(Sounds);
    var Keyboard;
    (function (Keyboard) {
        Keyboard.keys = {
            'w': false,
            'a': false,
            's': false,
            'd': false,
            ' ': false,
            'Escape': false,
            'e': false,
        };
        Keyboard.canEnterPlace = true;
        // public static keyDown   (e: KeyboardEvent) { console.log(this.keys[e.key]) }
        function keyDown(e) { if (Keyboard.keys[e.key] !== undefined)
            Keyboard.keys[e.key] = true; /*console.log(e)*/ /*console.log(e)*/ keyPressed(e); }
        Keyboard.keyDown = keyDown;
        function keyUp(e) { if (Keyboard.keys[e.key] !== undefined)
            Keyboard.keys[e.key] = false; }
        Keyboard.keyUp = keyUp;
    })(Keyboard = exports.Keyboard || (exports.Keyboard = {}));
    function keyPressed(e) {
        if (main_4.Game.state.status === state_3.Status.MENU) {
            /* region While being in the MENU */
            const currentLocation = main_4.Game.getPlaces()[main_4.Game.state.location];
            switch (e.key) {
                case 'w':
                    if (--main_4.Game.state.selectedPlace >= 0 && !currentLocation[main_4.Game.state.selectedPlace].isShown())
                        main_4.Game.state.selectedPlace--;
                    if (main_4.Game.state.selectedPlace < 0) {
                        main_4.Game.state.selectedPlace = 0;
                        Sounds.play('selection_not_possible');
                        if (!currentLocation[main_4.Game.state.selectedPlace].isShown())
                            main_4.Game.state.selectedPlace++;
                    }
                    else {
                        Keyboard.canEnterPlace = false;
                        Sounds.play('moved_selection')
                            .then(() => {
                            return Sounds.play(currentLocation[main_4.Game.state.selectedPlace].menuVoiceName, 1, 0, 'menuVoiceName');
                        })
                            .then(() => Keyboard.canEnterPlace = true);
                    }
                    break;
                case 's':
                    if (++main_4.Game.state.selectedPlace < currentLocation.length && !currentLocation[main_4.Game.state.selectedPlace].isShown())
                        main_4.Game.state.selectedPlace++;
                    if (main_4.Game.state.selectedPlace >= currentLocation.length) {
                        main_4.Game.state.selectedPlace = currentLocation.length - 1;
                        Sounds.play('selection_not_possible');
                        if (!currentLocation[main_4.Game.state.selectedPlace].isShown())
                            main_4.Game.state.selectedPlace--;
                    }
                    else {
                        Keyboard.canEnterPlace = false;
                        Sounds.play('moved_selection')
                            .then(() => {
                            return Sounds.play(currentLocation[main_4.Game.state.selectedPlace].menuVoiceName, 1, 0, 'menuVoiceName');
                        })
                            .then(() => Keyboard.canEnterPlace = true);
                    }
                    break;
                case ' ':
                    if (Keyboard.canEnterPlace) {
                        Sounds.play('selection_confirmed')
                            .then(() => {
                            let currentPlace = main_4.Game.getPlaces()[main_4.Game.state.location][main_4.Game.state.selectedPlace];
                            if (currentPlace instanceof dialogue_2.Dialogue) {
                                traveling_1.Traveling.openDialogue(main_4.Game.state.selectedPlace);
                            }
                            else
                                console.log("let's fight, I guess");
                            visual_3.drawTable();
                        });
                        main_4.Game.state.status = state_3.Status.NONE;
                    }
                    break;
            }
            /* #endregion */
        }
        else if (main_4.Game.state.status === state_3.Status.DIALOGUE) {
            /* region While being in a DIALOGUE */
            switch (e.key) {
                case 'b':
                    let currentPlaceB = main_4.Game.getPlaces()[main_4.Game.state.location][main_4.Game.state.selectedPlace];
                    if (currentPlaceB instanceof dialogue_2.Dialogue) {
                        let currentDialogue = currentPlaceB;
                        clearTimeout(main_4.Game.state.timeOutID);
                        traveling_1.Traveling.endByDefault = false;
                        Sounds.stop('currentDialogue');
                        main_4.Game.state.status = state_3.Status.NONE;
                        Sounds.play('tts_shut_up')
                            .then(() => {
                            console.log('b pressed');
                            currentDialogue.exit(false);
                            visual_3.drawTable();
                        });
                    }
                    break;
                case ' ':
                    let currentPlaceSpace = main_4.Game.getPlaces()[main_4.Game.state.location][main_4.Game.state.selectedPlace];
                    if (currentPlaceSpace instanceof dialogue_2.Dialogue) {
                        let currentDialogue = currentPlaceSpace;
                        clearTimeout(main_4.Game.state.timeOutID);
                        Sounds.stop('currentDialogue');
                        traveling_1.Traveling.endByDefault = false;
                        main_4.Game.state.status = state_3.Status.NONE;
                        Sounds.play('tts_okay')
                            .then(() => {
                            console.log('space pressed');
                            currentDialogue.exit(true);
                            visual_3.drawTable();
                        });
                    }
                    break;
            }
            /* #endregion */
        }
        visual_3.drawTable();
    }
});
define("main/main", ["require", "exports", "main/state", "place/dialogue", "interaction/visual", "interaction/keyboard/keyboard", "util/saveHandler", "util/traveling", "interaction/sounds"], function (require, exports, state_4, dialogue_3, visual_4, keyboard_2, saveHandler_2, traveling_2, Sounds) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Sounds = __importStar(Sounds);
    /**
     * Here's where all important information about the game are stored.
     */
    class Game {
        static registerPlaces() {
            this.places = {
                Kottlington: [
                    new dialogue_3.Dialogue('dialogue_talk_to_grandpa', "kottlington.Grandpa", ['tts_placeholder'], undefined, undefined, () => saveHandler_2.SaveHandler.setBoolean('story progression', 'talkedToGrandma', true)),
                    new dialogue_3.Dialogue('enemy_weak_rat_fight', "kottlington.weakRat$1", ['tts_placeholder']),
                    new dialogue_3.Dialogue('tts_placeholder', "kottlington.Battlington", ['tts_placeholder'], () => saveHandler_2.SaveHandler.getBoolean('story progression', 'talkedToGrandma'), undefined, () => traveling_2.Traveling.changeLocation('Battlington'))
                ],
                Battlington: [
                    new dialogue_3.Dialogue('tts_placeholder', "battlington.Pub", ['tts_placeholder']),
                    new dialogue_3.Dialogue('tts_placeholder', "battlington.slime$1", ['tts_placeholder']),
                    new dialogue_3.Dialogue('tts_joins_fight', "battlington.Kate", ['tts_placeholder']),
                    new dialogue_3.Dialogue('tts_placeholder', "battlington.egg$1", ['tts_placeholder'], undefined, undefined, () => { console.log('thanks'); }),
                    new dialogue_3.Dialogue('tts_placeholder', "battlington.Justus", ['tts_placeholder']),
                ]
            };
        }
        static getPlaces() { return this.places; }
    }
    Game.state = new state_4.State('Kottlington', 6, 0);
    exports.Game = Game;
    function start() {
        // show UI
        document.getElementById('location').style.display = null;
        document.getElementById('save').style.display = null;
        // hide front page
        document.getElementById('front_page').style.display = 'none';
        // register the places
        Game.registerPlaces();
        saveHandler_2.SaveHandler.initDatabase();
        // add the keyboard event listener
        document.addEventListener('keydown', (e) => {
            keyboard_2.Keyboard.keyDown(e);
        });
        document.addEventListener('keyup', (e) => {
            keyboard_2.Keyboard.keyUp(e);
        });
        // add sounds
        function addSound(name) {
            Sounds.addSound(name, `src/sounds/${name}.wav`);
        }
        addSound('moved_selection');
        addSound('selection_confirmed');
        addSound('selection_not_possible');
        addSound('tts_placeholder');
        addSound('tts_joins_fight');
        addSound('enemy_rat_fight');
        addSound('blankspace');
        addSound('enemy_weak_rat_fight');
        addSound('dialogue_talk_to_grandpa');
        addSound('tts_shut_up');
        addSound('tts_okay');
        Sounds.loadAllSounds();
        slot = prompt("Which slot") || 'Unnamed';
        if (localStorage.getItem(`slot:${slot}`))
            saveHandler_2.SaveHandler.loadFromBrowserData(slot);
        else
            visual_4.drawTable();
    }
    exports.start = start;
});
define("interaction/visual", ["require", "exports", "main/main"], function (require, exports, main_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.table = document.getElementById('location');
    function drawTable() {
        let currentPlace = main_5.Game.getPlaces()[main_5.Game.state.location];
        for (let i = exports.table.children.length - 1; i > 0; i--) {
            const element = exports.table.children[i];
            exports.table.removeChild(element);
        }
        for (let i = 0; i < currentPlace.length; i++) {
            const element = currentPlace[i];
            addRow(main_5.Game.state.selectedPlace === i, element.menuVoiceName, element.id, exports.table, element.isShown());
        }
    }
    exports.drawTable = drawTable;
    exports.ph = 'My secret Passphrase';
    function addRow(isSelected, sound, id, table, isShown) {
        if (typeof sound === 'string')
            sound = { type: 'file', name: sound };
        const row = table.appendChild(document.createElement('tr'));
        row.className = 'locationRow';
        const selected = document.createElement('td');
        selected.appendChild(document.createTextNode(isSelected ? '>' : isShown ? ' ' : '❌'));
        row.appendChild(selected);
        const dSoundName = document.createElement('td');
        dSoundName.appendChild(document.createTextNode(sound.type === 'file' ? sound.name : sound.text));
        row.appendChild(dSoundName);
        const dSoundType = document.createElement('td');
        dSoundType.appendChild(document.createTextNode(sound.type));
        row.appendChild(dSoundType);
        const dId = document.createElement('td');
        dId.appendChild(document.createTextNode(id));
        row.appendChild(dId);
    }
});
define("place/enemy", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Enemy {
    }
    exports.Enemy = Enemy;
});
//# sourceMappingURL=main.js.map