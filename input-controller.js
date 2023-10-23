
  
  class InputController {
    constructor (actionsToBind = {}, target = null) {
        this.enable = true
        this.focused = true
        this.ACTION_ACTIVATED =  'input-controller:action-activated'
        this.ACTION_DEACTIVATED = 'input-controller:action-deactivated'

        this._actionsToBind = actionsToBind
        this._target = target
        
        this._elem = null
        this._command = null

        this._addKeyListeners(this._actionsToBind, this._target)
        this._addKeyListeners = this._addKeyListeners.bind(this)
        this._removeKeyListeners = this._removeKeyListeners.bind(this)
        // this._addListenerKeyDown = this._addListenerKeyDown.bind(this)
        // this._addListenerKeyUp = this._addListenerKeyUp.bind(this)

        // this.enableAction =  this.enableAction.bind(this)
    }

    _addListenerKeyDown = (command) => { 
   
        console.log(command)
        // if (this._actionsToBind[command].keys.includes(e.keyCode)) {
        //         elem.classList = [command]
        //         elem.classList.add('input-controller:action-activated')
        //     }
    }

    _addListenerKeyUp = (command, elem, e) => { 
   
        if (this._actionsToBind[command].keys.includes(e.keyCode)) {
                elem.classList = [command]
                elem.classList.add('input-controller:action-deactivated')
            }
    }

    _addKeyListeners (commandObj, target) {
        console.log(commandObj)
        console.log(target)

        if(commandObj && target) {
            const elem = document.querySelector(target)
            this._target = target
            this._elem = elem
            Object.keys(commandObj).map(command => {
                this._command = command
                if(commandObj[command].enabled) {
                    document.addEventListener('keydown',  function handler (e) {
                        this._addListenerKeyDown(command)
                    })

                    // document.addEventListener('keydown',  (e) => this._addListenerKeyDown(command, elem, e))
                    document.addEventListener('keyup',  (e) => this._addListenerKeyUp(command, elem, e))
                } 
            })
        }
    }

    _removeKeyListeners(command) {
        const elem = document.querySelector(this.target)
        document.removeEventListener('keydown',  handler)
        document.removeEventListener('keyup',  (e) => this._addListenerKeyUp(command, elem, e))
    }


    bindAction (actionsToBind) {
       Object.assign(this._actionsToBind, actionsToBind)
       this._addKeyListeners(actionsToBind)
    }
    // вклучает объявленную активность
    enableAction (actionName) { 
        if (!this._actionsToBind[actionName]) return
        const actionElem = this._actionsToBind[actionName]
        actionElem.enabled = true

        const obj = Object.fromEntries([[actionName, actionElem]])
        this._addKeyListeners(obj, this._target)
    }

    // выклучает объявленную активность
    disableAction (actionName) {
        if (!this._actionsToBind[actionName]) return
        const actionElem = this._actionsToBind[actionName]
        actionElem.enabled = false

        this._removeKeyListeners(actionName)

    }
    // нацеливает контроллер на переданный DOM элемент
    attach (target, dontEnable = null) {
        if (dontEnable) {
            this.enable = false
        }
        this._target = target

        this._addKeyListeners(this._actionsToBind)
        // const elem = document.querySelector(this._target)

        // Object.keys(this._actionsToBind).map(command => {
        //     document.addEventListener('keydown',  (e) => this._addListenerKeyDown(command, elem, e))
        //     document.addEventListener('keyup',  (e) => this._addListenerKeyUp(command, elem, e))

        // })

    }

    // отцеливает контроллер от активного DOM элемента и деактивирует контроллер
    detach () {
        this._target = null
        this.enable = false
    }

    // проверяет, активирована ли переданная активность в контроллере
    isActionActive (action) {
        if (this._actionsToBind[action] && Object.keys(this._actionsToBind[action]).includes('enable')) {
            return this._actionsToBind[action].enable
        }
        return false
    }

    // провенряет нажата ли переданная кнопка в контроллере
    isKeyPressed (keyCode) {
        Object.keys(this._actionsToBind).map(item => {
            let isPressed = this._actionsToBind[item].keys.includes(keyCode)
            if (isPressed) {
                return this._actionsToBind[item].enable
            }

        })
        return false
    }
}