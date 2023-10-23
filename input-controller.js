import { ACTION_ACTIVATED, ACTION_DEACTIVATED} from './const'

export class InputController {
    constructor (actionsToBind = {}, target = null) {
        this.enable = true
        this.focused = true
        this.ACTION_ACTIVATED =  ACTION_ACTIVATED
        this.ACTION_DEACTIVATED = ACTION_DEACTIVATED

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
            let isInclude = this._actionToBind[item].keys.includes(keyCode)
            if (isInclude) {
                return this._actionToBind[item].enable
            }

        })
        return false
    }
}