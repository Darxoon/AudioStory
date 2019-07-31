export type Sound = { type: 'file',	name: string }
				  | { type: 'tts', 	voice: string, text: string }