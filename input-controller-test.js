
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
		keys: [40, 83],
        enabled: true, // отключенная активность

	},
    // "spacebar": {
	// 	keys: [32]
	// },
}

const actionsToBind = {
    "jump": {
        keys: [32]
    },
    "down": {
        keys: [40, 83]
    },
}

const actionName = "jump"
const target = "game2"
const action = "up"
const keyCode = 40

const controller = new InputController(actionToBind, "game1")
// controller.attach('input')

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
    console.log("команда для элемента input активна: ", event.detail.action)
})

elem2.addEventListener("input-controller:action-deactivated", function(event) {
    elem2.classList.remove(event.detail.action)
    console.log("команда для элемента input не активна: ", event.detail.action)
})

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

bindActionBtn.onclick = function() {controller.bindAction(actionsToBind)}
enableActionBtn.onclick = function() {controller.enableAction(actionName)}
disableActionBtn.onclick = function() {controller.disableAction(actionName)}
attachBtn.onclick = function() {controller.attach(target)}
detachBtn.onclick = function() {controller.detach()}
isActionActiveBtn.onclick = function() {
    const commandArray = Object.keys(controller._actionsToBind)
    const isActive = controller.isActionActive(action)
    console.log("Is " + action +" command active:", isActive)
}
isKeyPressedBtn.onclick = function() {
    const isPressed = controller.isKeyPressed(keyCode)
    console.log("Is " + keyCode +" key pressed:", isPressed)

}
enableControllerBtn.onclick = function() {
    controller.enable = true
    console.log("Controller is enable: ", controller.enable)
}
disableControllerBtn.onclick = function() {
    controller.enable = false
    console.log("Controller is enable: ", controller.enable)
}


