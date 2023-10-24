
  
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

        // this._addKeyListeners(this._actionsToBind, this._target)
        this._addListenerKeyDownHandler = this._addListenerKeyDown.bind(this)
        this._addListenerKeyUpHandler = this._addListenerKeyUp.bind(this)

        this.attach(this._target)
        // this._addKeyListeners = this._addKeyListeners.bind(this)
        // this._removeKeyListeners = this._removeKeyListeners.bind(this)
        // this.attach = this.attach.bind(this)
        
        // this.enableAction =  this.enableAction.bind(this)
    }

    _addListenerKeyDown (event) { 
   
        console.log(event.keyCode)
        // if (this._actionsToBind[command].keys.includes(e.keyCode)) {
        //         elem.classList = [command]
        //         elem.classList.add('input-controller:action-activated')
        //     }
    }

    _addListenerKeyUp (event) { 
        console.log(event.keyCode)
   
        // if (this._actionsToBind[command].keys.includes(e.keyCode)) {
        //         elem.classList = [command]
        //         elem.classList.add('input-controller:action-deactivated')
        //     }
    }

    // _addKeyListeners (commandObj, target) {
    //     console.log(commandObj)
    //     console.log(target)

    //     if(commandObj && target) {
    //         const elem = document.querySelector(target)
    //         this._target = target

    //         Object.keys(commandObj).map(command => {
    //             this._command = command
    //             if(commandObj[command].enabled) {
    //                 document.addEventListener('keydown',  function  keyPressHandler (e) {
    //                     this._addListenerKeyDown(command)
    //                 })

    //                 // document.addEventListener('keydown',  (e) => this._addListenerKeyDown(command, elem, e))
    //                 document.addEventListener('keyup',  (e) => this._addListenerKeyUp(command, elem, e))
    //             } 
    //         })
    //     }
    // }

    _removeKeyListeners() {
        // const elem = document.querySelector(this.target)
        document.removeEventListener('keydown',  this._addListenerKeyDownHandler)
        document.removeEventListener('keyup',  this._addListenerKeyUpHandler)
    }


    bindAction (actionsToBind) {
       Object.assign(this._actionsToBind, actionsToBind)
    //    this._addKeyListeners(actionsToBind)
    }
    // вклучает объявленную активность
    enableAction (actionName) { 
        const actionElem = this._actionsToBind[actionName]

        if (!actionElem) return
        actionElem.enabled = true

        // const obj = Object.fromEntries([[actionName, actionElem]])
        // this._addKeyListeners(obj, this._target)
    }

    // выклучает объявленную активность
    disableAction (actionName) {
        if (!this._actionsToBind[actionName]) return
        const actionElem = this._actionsToBind[actionName]
        actionElem.enabled = false

        this._removeKeyListeners()

    }
    // нацеливает контроллер на переданный DOM элемент
    attach (target, dontEnable = null) {
        if (dontEnable) {
            this.enable = false
        } else {                    // нужно ли это условие после else???
            this.enable = true
        }
        this._target = target

        // const elem = document.querySelector(target)
        document.addEventListener('keydown',   this._addListenerKeyDownHandler)
        document.addEventListener('keyup',  this._addListenerKeyUpHandler)



        // this._addKeyListeners(this._actionsToBind)
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
        if ( this._actionsToBind[action]?.enabled ) {
            return !!this._actionsToBind[action].isActive
        }
        return false
    }
    // провенряет нажата ли переданная кнопка в контроллере
    isKeyPressed (keyCode) {
        let isPressed = false
        Object.keys(this._actionsToBind).forEach(item => {
            if (this._actionsToBind[item].keys.includes(keyCode)) {
                isPressed = !!this._actionsToBind[item].isActive
            }
        })
       return isPressed
    }
}