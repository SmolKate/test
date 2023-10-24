
const actionToBind = {
	"left": { // название активности
		keys: [37,65], // список кодов кнопок соответствующих активности
        enabled: true, // отключенная активность
        isActive: false
	},
	"right": {
		keys: [39,68],
        enabled: true,
	},
	"up": { 
		keys: [38,87], 
        enabled: true,
        isActive: true
	},
	"down": {
		keys: [40, 83]
	},
    // "spacebar": {
	// 	keys: [32]
	// },
	}

const controller = new InputController(actionToBind, 'div')
// controller.attach('div')

const elem = document.querySelector('div')
elem.addEventListener('input-controller:action-activated', function(event) {
    console.log('команда активна:', event.detail.action)
})

elem.addEventListener('input-controller:action-deactivated', function(event) {
    console.log('команда не активна:', event.detail.action)
})

div.onfocus = function() {
    controller.focused = true
    console.log('focus', controller)
}

div.onblur = function() {
    controller.focused = false
    console.log('blur', controller)

}

