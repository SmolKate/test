class InputController {

    static ACTION_ACTIVATED =  "input-controller:action-activated"

    static ACTION_DEACTIVATED = "input-controller:action-deactivated"

    constructor (actionsToBind = {}, target = null) {
        // this._addListenerKeyDownHandler = this._addListenerKeyDown.bind(this)
        // this._addListenerKeyUpHandler = this._addListenerKeyUp.bind(this)

        this.enable = true
        this.focused = true

        this._actionsToBind = Object.fromEntries(
            Object.entries(actionsToBind).map(([key, actionSettings]) => [key, new Action(key, actionSettings)])
        )
        this._target = target
        // this._pressedKeyCode = []

        this.attach(this._target)

        this.plagin = [KeyboardPlugin]
    }

    // генерирует событие в подключенный DOM-элемент и передает название активности
    // _createEvent (event, eventName) { 
    //     Object.keys(this._actionsToBind).forEach(item => {
    //         if (this.focused && this.enable && this._actionsToBind[item].keys.includes(event.keyCode) && this._actionsToBind[item].enabled) {
    //             this._actionsToBind[item].target = this._target
    //             if (eventName === InputController.ACTION_ACTIVATED) {
    //                 this._actionsToBind[item].isActive = true
    //             } else if (eventName === InputController.ACTION_DEACTIVATED) {
    //                 for (let key of this._actionsToBind[item].keys) {       // проверка, нажата ли какая-либо другая кнопка, отвечающая за эту же команду. Если нажата, то событие сброса команды не генерится
    //                     if(this._pressedKeyCode.includes(key)) {
    //                         console.log('include', key)
    //                         return
    //                     }
    //                 }
    //                 this._actionsToBind[item].isActive = false
    //             }
    //         }
    //     })
    // }

    // функция, выполняемая при нажатии кнопки
    // _addListenerKeyDown (event) { 
    //     if (!this._pressedKeyCode.includes(event.keyCode)) {
    //         this._pressedKeyCode.push(event.keyCode)
    //     }
    //     this._createEvent (event, InputController.ACTION_ACTIVATED)
    // }

    // функция, выполняемая при отжатии кнопки
    // _addListenerKeyUp (event) { 
    //     this._pressedKeyCode = this._pressedKeyCode.filter(code => code !== event.keyCode)
    //     this._createEvent (event, InputController.ACTION_DEACTIVATED)
    // }

    // удаляет слушатели событий, навешанные данным контроллером
    // _removeKeyListeners() {
    //     document.removeEventListener("keydown",  this._addListenerKeyDownHandler)
    //     document.removeEventListener("keyup",  this._addListenerKeyUpHandler)
    // }

    // добавляет в контроллер переданные активности
    bindAction (actionsToBind) {
        Object.assign(this._actionsToBind, Object.fromEntries(
            Object.entries(actionsToBind).map(([key, actionSettings]) => [key, new Action(key, actionSettings)])
        ))
       console.log("Доступные команды: ", Object.keys(this._actionsToBind))
    }

    // вклучает объявленную активность
    enableAction (actionName) { 
        const actionElem = this._actionsToBind[actionName]

        if (!actionElem) return
        actionElem.enabled = true

        console.log("Активированные команды: ", Object.keys(this._actionsToBind).filter(command => this._actionsToBind[command].enabled === true))
    }

    // выклучает объявленную активность
    disableAction (actionName) {
        if (!this._actionsToBind[actionName]) return
        const actionElem = this._actionsToBind[actionName]
        actionElem.enabled = false
        console.log("Активированные команды: ", Object.keys(this._actionsToBind).filter(command => this._actionsToBind[command].enabled === true))
    }

    // нацеливает контроллер на переданный DOM элемент
    attach (target, dontEnable = null) {
        if (dontEnable) {
            this.enable = false
        } else {
            this.enable = true
        }
                                                             
        this._target = target
        this.focused = true

        // document.addEventListener("keydown",   this._addListenerKeyDownHandler) 
        // document.addEventListener("keyup",  this._addListenerKeyUpHandler)

        // console.log(target +" is attached")
    }

    // отцеливает контроллер от активного DOM элемента и деактивирует контроллер
    detach () {
        this._target = null
        this.enable = false
        // this._removeKeyListeners()
        // console.log("Target is detached")
    }

    // проверяет, активирована ли переданная активность в контроллере
    isActionActive (action) {           
        return this.enable && this._actionsToBind[action]?.enabled && !!this._actionsToBind[action].isActive
    }

    // проверяет, нажата ли переданная кнопка в контроллере
    // isKeyPressed (keyCode) {                                                
    //     return this._pressedKeyCode.includes(keyCode)
    // }

    registerPlugin (plugin) {
        if (!this.plagin.includes(plugin)) return
        console.log(this._target)
        return new plugin(this._actionsToBind, this._target)
        // Object.assign(InputController.prototype, plugin)            
        
        // Object.setPrototypeOf(plugin, InputController)
    }
}

class Action {

    constructor(command, {keys, enabled = false, isActive = false}) {
        this.keys = keys
        this.enabled = enabled
        this._isActive = isActive
        this._command = command
    }

    set isActive(isActive){
        if(this._isActive === isActive) return 
        this._isActive = isActive

        let downEvent = new CustomEvent(InputController.ACTION_ACTIVATED, {detail: {action: this._command}})
        let upEvent = new CustomEvent(InputController.ACTION_DEACTIVATED, {detail: {action: this._command}})

        const elem = document.getElementById(this.target)
        elem.dispatchEvent(isActive ? downEvent : upEvent )
    }

    get isActive(){
        return this._isActive
    }

    set target(target) {
        this._target = target
    }

    get target(){
        return this._target
    }
}
class KeyboardPlugin extends InputController {
    constructor(...arg) {
        super(...arg)
        this._addListenerKeyDownHandler = this._addListenerKeyDown.bind(this)
        this._addListenerKeyUpHandler = this._addListenerKeyUp.bind(this)
        this._pressedKeyCode = []
    }

    _createEvent (event, eventName) { 
        Object.keys(this._actionsToBind).forEach(item => {
            if (this.focused && this.enable && this._actionsToBind[item].keys.includes(event.keyCode) && this._actionsToBind[item].enabled) {
                this._actionsToBind[item].target = this._target
                if (eventName === InputController.ACTION_ACTIVATED) {
                    this._actionsToBind[item].isActive = true
                } else if (eventName === InputController.ACTION_DEACTIVATED) {
                    for (let key of this._actionsToBind[item].keys) {       // проверка, нажата ли какая-либо другая кнопка, отвечающая за эту же команду. Если нажата, то событие сброса команды не генерится
                        if(this._pressedKeyCode.includes(key)) {
                            console.log('include', key)
                            return
                        }
                    }
                    this._actionsToBind[item].isActive = false
                }
            }
        })
    }

    // функция, выполняемая при нажатии кнопки
    _addListenerKeyDown (event) { 
        if (!this._pressedKeyCode.includes(event.keyCode)) {
            this._pressedKeyCode.push(event.keyCode)
        }
        this._createEvent (event, InputController.ACTION_ACTIVATED)
    }

    // функция, выполняемая при отжатии кнопки
    _addListenerKeyUp (event) { 
        this._pressedKeyCode = this._pressedKeyCode.filter(code => code !== event.keyCode)
        this._createEvent (event, InputController.ACTION_DEACTIVATED)
    }

    // удаляет слушатели событий, навешанные данным контроллером
    _removeKeyListeners() {
        document.removeEventListener("keydown",  this._addListenerKeyDownHandler)
        document.removeEventListener("keyup",  this._addListenerKeyUpHandler)
    }

    // проверяет, нажата ли переданная кнопка в контроллере
    isKeyPressed (keyCode) {  
        console.log(this._pressedKeyCode)                                          
        return this._pressedKeyCode.includes(keyCode)
    }

    detach () {
        super.detach()
        this._removeKeyListeners()
    }

    attach (target, dontEnable = null) {
        super.attach(target, dontEnable)

        document.addEventListener("keydown",   this._addListenerKeyDownHandler) 
        document.addEventListener("keyup",  this._addListenerKeyUpHandler)

        console.log(target +" is new attached")
    }

}
let Keyboard = {

    // __proto__: InputController,

    // _addListenerKeyDownHandler: this._addListenerKeyDown.bind(this),
    // _addListenerKeyUpHandler: this._addListenerKeyUp.bind(this),

    _pressedKeyCode: [],

    _createEvent (event, eventName) { 
        Object.keys(this._actionsToBind).forEach(item => {
            if (this.focused && this.enable && this._actionsToBind[item].keys.includes(event.keyCode) && this._actionsToBind[item].enabled) {
                this._actionsToBind[item].target = this._target
                if (eventName === InputController.ACTION_ACTIVATED) {
                    this._actionsToBind[item].isActive = true
                } else if (eventName === InputController.ACTION_DEACTIVATED) {
                    for (let key of this._actionsToBind[item].keys) {       // проверка, нажата ли какая-либо другая кнопка, отвечающая за эту же команду. Если нажата, то событие сброса команды не генерится
                        if(this._pressedKeyCode.includes(key)) {
                            console.log('include', key)
                            return
                        }
                    }
                    this._actionsToBind[item].isActive = false
                }
            }
        })
    },

     // функция, выполняемая при нажатии кнопки
     _addListenerKeyDown (event) { 
        if (!this._pressedKeyCode.includes(event.keyCode)) {
            this._pressedKeyCode.push(event.keyCode)
        }
        this._createEvent (event, InputController.ACTION_ACTIVATED)
    },

    // функция, выполняемая при отжатии кнопки
    _addListenerKeyUp (event) { 
        this._pressedKeyCode = this._pressedKeyCode.filter(code => code !== event.keyCode)
        this._createEvent (event, InputController.ACTION_DEACTIVATED)
    },

    // удаляет слушатели событий, навешанные данным контроллером
    _removeKeyListeners() {
        document.removeEventListener("keydown",  this._addListenerKeyDownHandler)
        document.removeEventListener("keyup",  this._addListenerKeyUpHandler)
    },

    // проверяет, нажата ли переданная кнопка в контроллере
    isKeyPressed (keyCode) {  
        console.log(this._pressedKeyCode)                                          
        return this._pressedKeyCode.includes(keyCode)
    },

    detach () {
        this._target = null
        this.enable = false
        this._removeKeyListeners()
        console.log('Есть контакт 2')
    },

    attach (target, dontEnable = null) {
        if (dontEnable) {
            this.enable = false
        } else {
            this.enable = true
        }
                                                             
        this._target = target
        this.focused = true

        document.addEventListener("keydown",   this._addListenerKeyDownHandler) 
        document.addEventListener("keyup",  this._addListenerKeyUpHandler)

        console.log(target +" is new attached")
    },

    sayHi() {
        console.log("Есть контакт")
    },

    // _addListenerKeyDownHandler: _addListenerKeyDown.bind(this),
    // _addListenerKeyUpHandler: _addListenerKeyUp.bind(this),


}