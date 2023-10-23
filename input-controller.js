import { ACTION_ACTIVATED, ACTION_DEACTIVATED} from './const'

export class InputController {
    constructor (actionsToBind = {}, target = null) {
        this.enable = true
        this.focused = true
        this.ACTION_ACTIVATED =  'input-controller:action-activated'
        this.ACTION_DEACTIVATED = 'input-controller:action-deactivated'


        this._actionToBind = actionsToBind
        this._target = target
    }

    bindAction (actionsToBind) {
       Object.assign(this._actionToBind, actionsToBind)
    }
    // вклучает объявленную активность
    enableAction (actionName) { 
        if (!this._actionToBind[actionName]) return
        this._actionToBind[actionName].enabled = true
    }

    // выклучает объявленную активность
    disableAction (actionName) {
        if (!this._actionToBind[actionName]) return
        this._actionToBind[actionName].enabled = false
    }
    // нацеливает контроллер на переданный DOM элемент
    attach (target, dontEnable = null) {
        if (dontEnable) {
            this.enable = false
        }
        this._target = target
        document.addEventListener('keydown', function(event) {
            if (event.code == 'KeyZ' && (event.ctrlKey || event.metaKey)) {
              alert('Отменить!')
            }
          });
    }

    // отцеливает контроллер от активного DOM элемента и деактивирует контроллер
    detach () {
        this._target = null
        this.enable = false
    }

    // проверяет, активирована ли переданная активность в контроллере
    isActionActive (action) {
        if (this._actionToBind[action] && Object.keys(this._actionToBind[action]).includes('enable')) {
            return this._actionToBind[action].enable
        }
        return false
    }

    // провенряет нажата ли переданная кнопка в контроллере
    isKeyPressed (keyCode) {
        Object.keys(this._actionToBind).map(item => {
            let isPressed = this._actionToBind[item].keys.includes(keyCode)
            if (isPressed) {
                return this._actionToBind[item].enable
            }

        })
        return false
    }
}