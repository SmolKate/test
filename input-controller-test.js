// константы для проверки работы кнопок
const actionToBindArrows = {
	"left": { // название активности
		keys: [37], // список кодов кнопок соответствующих активности
        enabled: false, // отключенная активность
	},
	"right": {
		keys: [39],
        enabled: true,
	},
	"up": { 
		keys: [38], 
        enabled: true,
	},
	"down": {
		keys: [40],
        enabled: true, 

	},
}

const actionToBindLetters = {
	"left": { // название активности
		keys: [65], // список кодов кнопок соответствующих активности
        enabled: false, // отключенная активность
	},
	"right": {
		keys: [68],
        enabled: true,
	},
	"up": { 
		keys: [87], 
        enabled: true,
	},
	"down": {
		keys: [83],
        enabled: true, 

	},
} 

const actionToBind2 = {
	"left": { // название активности
		mouse: ['left'], // список кодов кнопок соответствующих активности
        mouseisTrue: true,
        enabled: true, // отключенная активность
	},
	"right": {
		mouse: ['right'],
        enabled: false,
        mouseisTrue: true,

	},
	"up": { 
		mouse: ['up'], 
        enabled: true,
        mouseisTrue: false,

	},
	"down": {
		mouse: ['down'],
        enabled: false, 
        mouseisTrue: false,
	},
    "jump": {
        mouse: ['jump']
    },
}

const actionsToBind = {
    "jump": {
        keys: [32, 38]
    },
    "down": {
        keys: [40, 83]
    },
}

const actionName = "jump"
const action = "up"
const keyCode = 32

// создание экземпляра контроллера
const baseController = new InputController()
const controller = baseController.registerPlugin(KeyboardPlugin)
const controller2 = baseController.registerPlugin(KeyboardPlugin)

controller.attach("game1")
controller2.attach("game2")

controller.bindAction(actionToBindArrows)
controller2.bindAction(actionToBindLetters)


// слушатели событий на элементы Game 1 и Game 2
const elem1 = document.getElementById("game1")
elem1.addEventListener("input-controller:action-activated", function(event) {
    elem1.classList.add(event.detail.action)
    console.log("команда для элемента game1 активна: ", event.detail.action)
})

elem1.addEventListener("input-controller:action-deactivated", function(event) {
    elem1.classList.remove(event.detail.action)
    console.log("команда для элемента game1 не активна: ", event.detail.action)
})

const elem2 = document.getElementById("game2")
elem2.addEventListener("input-controller:action-activated", function(event) {
    elem2.classList.add(event.detail.action)
    console.log("команда для элемента game2 активна: ", event.detail.action)
})

elem2.addEventListener("input-controller:action-deactivated", function(event) {
    elem2.classList.remove(event.detail.action)
    console.log("команда для элемента game2 не активна: ", event.detail.action)
})

// переключение фокуса между элементами
elem1.onfocus = function() {
    controller.attach("game1")
    controller.focused = true
    console.log('focus on game1')
}

elem1.onblur = function() {
    controller.detach()
    controller.focused = false
    console.log('blur on game1')
}

elem2.onfocus = function() {
    controller.attach("game2")
    controller.focused = true
    console.log('focus on game2')
}

elem2.onblur = function() {
    controller.detach()
    controller.focused = false
    console.log('blur on game2')
}

// Функции, выполняемые при нажатии кнопок

bindActionBtn.onclick = function() {
    controller.bindAction(actionsToBind)
    controller2.bindAction(actionsToBind)
}
enableActionBtn.onclick = function() {baseController.enableAction(actionName)}
disableActionBtn.onclick = function() {baseController.disableAction(actionName)}
attachBtn1.onclick = function() {baseController.attach("game1")}
attachBtn2.onclick = function() {baseController.attach("game2")}
detachBtn.onclick = function() {baseController.detach()}
isActionActiveBtn.onclick = function() {
    const isActive = baseController.isActionActive(action)
    console.log("Is " + action +" command active:", isActive)
}
isKeyPressedBtn.onclick = function() {
    const isPressed = controller.isKeyPressed(keyCode)
    console.log("Is " + keyCode +" key pressed:", isPressed)

}
enableControllerBtn.onclick = function() {
    baseController.enable = true
    controller.enable = true
    controller2.enable = true
    console.log("Controller is enable: ", controller.enable)
}
disableControllerBtn.onclick = function() {
    baseController.enable = false
    controller.enable = false
    controller2.enable = false
    console.log("Controller is enable: ", controller.enable)
}