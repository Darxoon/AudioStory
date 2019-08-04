requirejs.config({
	baseUrl: 'node_modules/',
	paths: {
		bson: 'bson/dist/bson.bundle',
		'crypto-js': 'crypto-js/crypto-js'
	}
})
global = window
let slot = null

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
	function submit()  {
		let name = entryInput.value
		if(name) {
			// if a save with this name exists already, append a _ to this name, and check again
			while(Array.from(profileSelectorList.children).reduce((previousValue, currentValue) => currentValue.innerText === name || previousValue, false))
				name += '_'
			profileChanges.newSlots.push(name)
			entry.removeChild(entryInput)
			entry.innerText = name
			finishEntry(entry, name)
			entry.click()
		} else {
			profileSelectorList.removeChild(entry)
		}
	}
	entryInput.addEventListener('blur', submit)
	entryInput.addEventListener('keypress', ev => {
		if(ev.key === 'Enter')
			submit()
	})
	console.log(entryInput)
})

profileSelectorList.appendChild(newButton)


// add selected slot
slot = localStorage.getItem('#slot')
if(slot !== null && localStorage.getItem('slot:' + slot) === null) {
	slot = null
	localStorage.removeItem('#slot')
}

// if slot is set, enable start button
if(slot !== null)
	document.getElementById('start_button').disabled = false


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
		if(profileName === slot)
			entry.click()
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
	localStorage.setItem('#slot', profileChanges.slot)
	profileChanges.newSlots.forEach(value => {
		localStorage.setItem('slot:' + value, '')
	})
	document.getElementById('overlay').style.display = 'none'
	if(slot !== null)
		document.getElementById('start_button').disabled = false
})
document.getElementById('cancel').addEventListener('click', () => {
	document.getElementById('overlay').style.display = 'none'
	for(const child of profileSelectorList.children) {
		if(child.innerText === slot)
			child.click()
		if(profileChanges.newSlots.includes(child.innerText))
			profileSelectorList.removeChild(child)
	}
})