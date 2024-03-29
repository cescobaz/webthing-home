const {
  Property,
  Thing,
  Value
} = require('webthing')
const Gpio = require('onoff').Gpio

function makeButtonThing (pin, asToggle, identifier, name) {
  const thing = new Thing(
    `urn:dev:ops:${identifier}`,
    name,
    ['PushButton'],
    name)
  const value = new Value(false)
  thing.addProperty(
    new Property(thing, 'pushed', value, {
      '@type': 'PushedProperty',
      title: 'Pushed',
      type: 'boolean',
      description: 'Whether the button is pressed',
      readOnly: true
    }))
  const button = new Gpio(pin, 'in', 'both', {debounceTimeout: 10})
  let toggle = false
  let previousValue = false
  let newValue = false
  let pinV = 0
  button.watch((error, v) => {
    if (pinV == v) {
      return
    }
    pinV = v
    if (error) {
      console.log({error})
      value.notifyOfExternalUpdate(false)
      return
    }
    console.log({pin, asToggle, toggle, v})
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

module.exports = { makeButtonThing }
