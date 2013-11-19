define(function (require, exports, module) {

    var Event = require('./Event');

    /**
     *
     * @name EventTarget
     * @class EventTarget 类是可调度事件的所有类的基类。
     * @constructor
     */
    var EventTarget = function() {
        this._captureListeners = {};
        this._listeners = {};
    };

    EventTarget.DEFAULT_ACTION_MAP = {
        'touchstart' : 'onTouchStart',
        'touchmove' : 'onTouchMove',
        'touchend' : 'onTouchEnd',
        'click' : 'onClick'
    };

    /**
     * @lends EventTarget.prototype
     */
    var p = EventTarget.prototype;

    /**
     *
     */
    p.addEventListener = function(eventType, listener, useCapture) {
        var listeners = useCapture ? this._captureListeners : this._listeners;
        var arr = listeners[eventType];
        if (arr) { this.removeEventListener(eventType, listener, useCapture); }
        arr = listeners[eventType];
        if (!arr) {
            listeners[eventType] = [listener];
        }
        else {
            arr.push(listener);
        }
        return listener;
    };

    p.removeEventListener = function(eventType, listener, useCapture) {
        var listeners = useCapture ? this._captureListeners : this._listeners;
        if (!listeners) { return; }
        var arr = listeners[eventType];
        if (!arr) { return; }
        for (var i=0,l=arr.length; i<l; i++) {
            if (arr[i] == listener) {
                if (l==1) {
                    delete(listeners[eventType]);
                }
                else { arr.splice(i,1); }
                break;
            }
        }
    };

    p.hasEventListener = function(eventType) {
        var listeners = this._listeners, captureListeners = this._captureListeners;
        return !!((listeners && listeners[eventType]) || (captureListeners && captureListeners[eventType]));
    };

    p.dispatchEvent = function(event) {
        var i, len, list, object, defaultAction;
        event.target = this;
        if(false === event.bubbles) {
            event.eventPhase = Event.TARGET_PHASE;
            if(!this._dispatchEvent(event)) {
                defaultAction = this[EventTarget.DEFAULT_ACTION_MAP[event.type]];
                defaultAction && defaultAction(event);
            }
            return;
        }

        list = this._getAncients();
        event.eventPhase = Event.CAPTURING_PHASE;
        for(i=list.length-1; i>=0 ; i--) {
            object = list[i];
            if(!object._dispatchEvent(event)) {
                defaultAction = object[EventTarget.DEFAULT_ACTION_MAP[event.type]];
                defaultAction && defaultAction(event);
            }
            if(event._propagationStoped) {
                return;
            }
        }
        event.eventPhase = Event.TARGET_PHASE;
        if(!this._dispatchEvent(event)) {
            defaultAction = this[EventTarget.DEFAULT_ACTION_MAP[event.type]];
            defaultAction && defaultAction(event);
        }
        if(event._propagationStoped) {
            return;
        }
        event.eventPhase = Event.BUBBLING_PHASE;
        for(i=0,len=list.length; i<len; i++) {
            object = list[i];
            if(!object._dispatchEvent(event)) {
                defaultAction = object[EventTarget.DEFAULT_ACTION_MAP[event.type]];
                defaultAction && defaultAction(event);
            }
            if(event._propagationStoped) {
                return;
            }
        }
    };

    p._getAncients = function() {
        var list = [];
        var parent = this;
        while (parent._parent) {
            parent = parent._parent;
            list.push(parent);
        }
        return list;
    };

    p._dispatchEvent = function(event) {
        var i, len, arr, allArr, listeners, handler;
        event.currentTarget = this;
        event._listenerRemoved = false;
        listeners = event.eventPhase === Event.CAPTURING_PHASE ? this._captureListeners : this._listeners;
        if(listeners) {
            arr = listeners[event.type];
			allArr = listeners['*'];
			if(arr && arr.length > 0) {
				arr = arr.slice();
				for(i=0,len=arr.length; i<len; i++) {
					event._listenerRemoved = false;
					handler = arr[i];
					handler(event);
					if(event._listenerRemoved) {
						this.removeEventListener(event.type, handler, event.eventPhase === Event.CAPTURING_PHASE);
					}
					if(event._immediatePropagationStoped) {
						break;
					}
				}
			}
			if(allArr && allArr.length > 0) {
				allArr = allArr.slice();
				for(i=0,len=allArr.length; i<len; i++) {
					event._listenerRemoved = false;
					handler = allArr[i];
					handler(event);
					if(event._listenerRemoved) {
						this.removeEventListener('*', handler, event.eventPhase === Event.CAPTURING_PHASE);
					}
				}
			}
        }
        return event._defaultPrevented;
    };

    module.exports = EventTarget;

});