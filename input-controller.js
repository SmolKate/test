  class InputController {
    constructor (actionsToBind = {}, target = null) {
        this.enable = true
        this.focused = true
        this.ACTION_ACTIVATED =  'input-controller:action-activated'
        this.ACTION_DEACTIVATED = 'input-controller:action-deactivated'

        this._actionsToBind = actionsToBind
        this._target = target

    }

    _addListenerKeyDown (command, elem, e) { 
   
        console.log(e.keyCode)
        if (this._actionsToBind[command].keys.includes(e.keyCode)) {
            console.log(command)
                elem.classList = [command]
            }
    }

    _addListenerKeyUp (command, elem, e) { 
   
        console.log(e.keyCode)
        if (this._actionsToBind[command].keys.includes(e.keyCode)) {
            console.log(command)
                elem.classList = [command]
                elem.classList.add('input-controller:action-deactivated')
            }
    }

    bindAction (actionsToBind) {
       Object.assign(this._actionsToBind, actionsToBind)
    }
    // вклучает объявленную активность
    enableAction (actionName) { 
        if (!this._actionsToBind[actionName]) return
        this._actionsToBind[actionName].enabled = true
    }

    // выклучает объявленную активность
    disableAction (actionName) {
        if (!this._actionsToBind[actionName]) return
        this._actionsToBind[actionName].enabled = false
    }
    // нацеливает контроллер на переданный DOM элемент
    attach (target, dontEnable = null) {
        if (dontEnable) {
            this.enable = false
        }
        this._target = target
        console.log('attach')
        const elem = document.querySelector(this._target)

        Object.keys(this._actionsToBind).map(command => {
            console.log(command)
            document.addEventListener('keydown',  (e) => this._addListenerKeyDown(command, elem, e))
            document.addEventListener('keyup',  (e) => this._addListenerKeyUp(command, elem, e))

        })

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