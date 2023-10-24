class InputController {
    constructor (actionsToBind = {}, target = null) {
        this.enable = true
        this.focused = true
        this.ACTION_ACTIVATED =  "input-controller:action-activated"
        this.ACTION_DEACTIVATED = "input-controller:action-deactivated"

        this._actionsToBind = actionsToBind
        this._target = target
        
        this._addListenerKeyDownHandler = this._addListenerKeyDown.bind(this)
        this._addListenerKeyUpHandler = this._addListenerKeyUp.bind(this)

        this.attach(this._target)
    }

    // генерирует событие в подключенный DOM-элемент и передает название активности
    _createEvent (event, eventName) {
        let command = ''
        Object.keys(this._actionsToBind).forEach(item => {
            if (this._actionsToBind[item].keys.includes(event.keyCode)) {
                command = item
            }
        })
        if(this.focused && this.enable && command && this._actionsToBind[command].enabled) {
            let newEvent = new CustomEvent(eventName, {detail: {action: command}})                  // нужно ли всплытие события???
            const elem = document.getElementById(this._target)
            elem.dispatchEvent(newEvent)
        }
    }

    // функция, выполняемая при нажатии кнопки
    _addListenerKeyDown (event) { 
        this._createEvent (event, this.ACTION_ACTIVATED)
    }

    // функция, выполняемая при отжатии кнопки
    _addListenerKeyUp (event) { 
        this._createEvent (event, this.ACTION_DEACTIVATED)
    }

    // удаляет слушатели событий, навешанные данным контроллером
    _removeKeyListeners() {                                                               // когда удалять слушатели???
        document.removeEventListener("keydown",  this._addListenerKeyDownHandler)
        document.removeEventListener("keyup",  this._addListenerKeyUpHandler)
    }

    // добавляет в контроллер переданные активности
    bindAction (actionsToBind) {
       Object.assign(this._actionsToBind, actionsToBind)
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
        } else {                                                        // нужно ли это условие после else???
            this.enable = true
        }
        this._target = target

        document.addEventListener("keydown",   this._addListenerKeyDownHandler)    // при зажатых кнопках непрерывно срабатывает слушатель. Оставить???
        document.addEventListener("keyup",  this._addListenerKeyUpHandler)

        console.log(target +" is attached")
    }

    // отцеливает контроллер от активного DOM элемента и деактивирует контроллер
    detach () {
        this._target = null
        this.enable = false
        console.log("Target is detached")
    }

    // проверяет, активирована ли переданная активность в контроллере
    isActionActive (action) {                                   
        if ( this._actionsToBind[action]?.enabled ) {                   // нужно ли проверять доступность самого контроллера????
            return !!this._actionsToBind[action].isActive
        }
        return false
    }

    // проверяет, нажата ли переданная кнопка в контроллере
    isKeyPressed (keyCode) {
        let isPressed = false
        Object.keys(this._actionsToBind).forEach(item => {
            if (this._actionsToBind[item].keys.includes(keyCode)) {
                isPressed = !!this._actionsToBind[item].isActive
            }
        })
        // console.log("Is " + keyCode +" key pressed:", isPressed)
        return isPressed
    }
}