requirejs.config({
	baseUrl: 'node_modules/',
	paths: {
		bson: 'bson/dist/bson.bundle',
		'crypto-js': 'crypto-js/crypto-js'
	}
})
global = window
let slot = "Unnamed"

function finishEntry(entry, profileName) {
	console.log(profileName)
	entry.addEventListener('click', () => {
		console.log(`Profile selected: '${profileName}'`)
		profileChanges.slot = profileName
		// iterate through the entries and remove 'selected', if they have it
		const childArray = Array.prototype.slice.call(profileSelectorList.children)
		childArray.forEach(value => {
			if(value.classList.contains('selected'))
				value.classList.remove('selected')
		})
		// add 'selected' to this entry
		entry.classList.add('selected')
	})

}

let profileChanges = {
	slot: 'Unnamed',
	newSlots: []
}

const profileSelectorList = document.querySelector('.list div ul')

// add new button
const newButton = document.createElement('li')
newButton.innerText = 'New...'
newButton.addEventListener('click', () => {
	const entry = document.createElement('li')
	const entryInput = document.createElement('input')
	entry.appendChild(entryInput)
	profileSelectorList.appendChild(entry)
	entryInput.focus()
	entryInput.addEventListener('blur', () => {
		const name = entryInput.value
		if(name) {
			profileChanges.newSlots.push(name)
			entry.removeChild(entryInput)
			entry.innerText = name
			finishEntry(entry, name)
			entry.click()
		} else {
			profileSelectorList.removeChild(entry)
		}
	})
	console.log(entryInput)
})

profileSelectorList.appendChild(newButton)


// iterate through items in localStorage
for(const name in localStorage) {
	// if it's a slot
	if(localStorage.hasOwnProperty(name) && name.startsWith('slot:')) {
		// set the name and create the entry
		const profileName = name.slice('slot:'.length)
		const entry = document.createElement('li')
		// modify the entry
		entry.innerText = profileName
		finishEntry(entry, profileName)
		profileSelectorList.appendChild(entry)
	}
}

// add event listeners to buttons
document.getElementById('select_save_button').addEventListener('click', () => {
	profileChanges = {
		slot: slot,
		newSlots: []
	}
	document.getElementById('overlay').style.display = null
})
document.getElementById('ok').addEventListener('click', () => {
	slot = profileChanges.slot
	profileChanges.newSlots.forEach(value => {
		localStorage.setItem(value, '')
	})
	document.getElementById('overlay').style.display = 'none'
})
document.getElementById('cancel').addEventListener('click', () => {
	document.getElementById('overlay').style.display = 'none'
})