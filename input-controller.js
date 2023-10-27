class InputController {

    static ACTION_ACTIVATED =  "input-controller:action-activated"

    static ACTION_DEACTIVATED = "input-controller:action-deactivated"

    constructor (actionsToBind = {}, target = null) {
    
        this.enable = true
        this.focused = true

        this._actionsToBind = Object.fromEntries(
            Object.entries(actionsToBind).map(([key, actionSettings]) => [key, new Action(key, actionSettings)])
        )
        this._target = target
        this._plugin = []

        this.attach(this._target)
    }

    // добавляет в контроллер переданные активности
    bindAction (actionsToBind) {
        const newObj =  Object.fromEntries(
            Object.entries(actionsToBind).map(([key, actionSettings]) => [key, new Action(key, actionSettings)])
        )
        const initKeys = Object.keys(this._actionsToBind)

        for ( let elem in newObj) {
            if(initKeys.includes(elem)) {
                Object.assign(this._actionsToBind[elem], newObj[elem])
            } else {
                this._actionsToBind[elem] = newObj[elem]
            }
        }

        for (let plugin of this._plugin) {
            plugin._actionsToBind = this._actionsToBind
        }  
        console.log(this)
    }

    // вклучает объявленную активность
    enableAction (actionName) { 
        // меняет состояние во всех плагинах
        for (let plugin of this._plugin) {
            if (plugin._actionsToBind[actionName]) {
             plugin._actionsToBind[actionName].enabled = true
            }
        }  
        const actionElem = this._actionsToBind[actionName]

        if (!actionElem) return
        actionElem.enabled = true

        console.log("Активированные команды: ", Object.keys(this._actionsToBind).filter(command => this._actionsToBind[command].enabled === true))
    }

    // выклучает объявленную активность
    disableAction (actionName) {
        // меняет состояние во всех плагинах
        for (let plugin of this._plugin) {
           if (plugin._actionsToBind[actionName]) {
            plugin._actionsToBind[actionName].enabled = false
           }
        }  
        if (!this._actionsToBind[actionName]) return
        const actionElem = this._actionsToBind[actionName]
        actionElem.enabled = false
       
        console.log("Активированные команды: ", Object.keys(this._actionsToBind).filter(command => this._actionsToBind[command].enabled === true))
    }

    // нацеливает контроллер на переданный DOM элемент
    attach (target, dontEnable = null) {
        if (dontEnable) {
            this.enable = false
            this._plugin.forEach(plugin => plugin.enable = false)
        } else {
            this.enable = true
            this._plugin.forEach(plugin => plugin.enable = true)
        }
                                                             
        this._target = target
        this.focused = true

        this._plugin.forEach(plugin => {
            plugin._target = target
            plugin.focused = true
            plugin.pluginAttach()
        })
    }

    // отцеливает контроллер от активного DOM элемента и деактивирует контроллер
    detach () {
        this._target = null
        this.enable = false
        this._plugin.forEach(plugin => {
            plugin._target = null
            plugin.enable = false
            plugin.pluginDetach()
        })
    }

    // проверяет, активирована ли переданная активность в контроллере
    isActionActive (action) {   
        for (let plugin of this._plugin) {
            if (plugin.enable && Object.keys(plugin._actionsToBind).includes(action) && plugin._actionsToBind[action].enabled && !!plugin._actionsToBind[action].isActive) {
                return true
            }
        }  
        return false    
    }

    // подключает плагин, расширяющий функционал обработки до нового типа ввода
    registerPlugin (plugin) {
        const newplugin = new plugin(this._actionsToBind, this._target)
        this._plugin.push(newplugin)
        return newplugin
    }

}

class Action {

    constructor(command, {enabled = false, isActive = false, ...settings}) {
        this.enabled = enabled
        this._isActive = isActive
        this._command = command
        
        for (const [key, value] of Object.entries(settings)) {
            this[key] = value
            console.log(this)

        }
    }

    set isActive(isActive){
        if(this._isActive === isActive) return 
        this._isActive = isActive

        let activateEvent = new CustomEvent(InputController.ACTION_ACTIVATED, {detail: {action: this._command}})
        let deactivateEvent = new CustomEvent(InputController.ACTION_DEACTIVATED, {detail: {action: this._command}})

        const elem = document.getElementById(this.target)
        elem.dispatchEvent(isActive ? activateEvent : deactivateEvent )
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

    pluginDetach () {
        this._removeKeyListeners()
        console.log("Target is detached")
    }

    pluginAttach (target) {

        document.addEventListener("keydown",   this._addListenerKeyDownHandler) 
        document.addEventListener("keyup",  this._addListenerKeyUpHandler)

        console.log(target +" is new attached")
    }

    detach () {
        this._target = null
        this.enable = false
        this.pluginDetach()
        
    }

    attach (target, dontEnable = null) {
        if (dontEnable) {
            this.enable = false
        } else {
            this.enable = true
        }
                                                             
        this._target = target
        this.focused = true

        this.pluginAttach (target)
    }

}