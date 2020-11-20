const {
  Property,
  Thing,
  Value
} = require('webthing')
const Gpio = require('onoff').Gpio

function makeBlackButtonThing (pin, asToggle) {
  const thing = new Thing(
    'urn:dev:ops:black-button-0',
    'kitchen black button',
    ['PushButton'],
    'kitchen black button')
  const value = new Value(false)
  thing.addProperty(
    new Property(thing, 'pushed', value, {
      '@type': 'PushedProperty',
      title: 'Pushed',
      type: 'boolean',
      description: 'Whether the button is pressed',
      readOnly: true
    }))
  const button = new Gpio(pin, 'in', 'both')
	let toggle = false
	let previousValue = false
	let newValue = false
  button.watch((err, v) => {
	  console.log(asToggle, toggle, v)
	  if (asToggle && v === 0) {
		  toggle = !toggle
		  newValue = toggle
	  } else if (!asToggle) {
		  newValue = v === 1
	  }
	  if (newValue !== previousValue) {
                  console.log('button to value ' + newValue)
		  value.notifyOfExternalUpdate(newValue)
	          previousValue = newValue
	  }
          })
  return thing
}

module.exports = { makeBlackButtonThing }
