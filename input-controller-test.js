
const actionToBind = {
	"left": { // название активности
		keys: [37,65], // список кодов кнопок соответствующих активности
        enabled: false // отключенная активность
	},
	"right": {
		keys: [39,68]
	},
	"up": { 
		keys: [38,87], 
        enabled: false 
	},
	"down": {
		keys: [40, 83]
	},
    // "spacebar": {
	// 	keys: [32]
	// },
	}

const controller = new InputController(actionToBind)
controller.attach('div')
