
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
