define([
    './../var'
], function(W) {

    /**
     * @name Event
     * @class Event 类作为创建 Event 对象的基类，当发生事件时，Event 对象将作为参数传递给事件侦听器。
     * @constructor
     * @param {Object} params
     * @param {String} params.type 指定事件类型
     * @param {Boolean} params.bubbles 指定事件是否冒泡
     */

    var Event = function(params) {

        /**
         * [readonly] 事件类型
         * @type {String}
         */
        this.type = params.type;

        /**
         * [readonly] 事件目标
         * @type {EventTarget}
         */
        this.target = null;

        /**
         * [readonly] 当前正在使用某个事件侦听器处理 Event 对象的对象。
         * @type {EventTarget}
         */
        this.currentTarget = null;

        /**
         * [readonly] 事件流中的当前阶段。
         * @type {int}
         */
        this.eventPhase = null;

        /**
         * [只读] 表示事件是否为冒泡事件。
         * @type {Boolean}
         */
        this.bubbles = params.bubbles;

        this._immediatePropagationStoped = false;
        this._propagationStoped = false;
        this._defaultPrevented = false;
        this._listenerRemoved = false;
    };

    Event.CAPTURING_PHASE = 1;
    Event.BUBBLING_PHASE = 2;
    Event.TARGET_PHASE = 3;

    /**
     * @lends Event.prototype
     */
    var p = Event.prototype;

    /**
     * 防止对事件流中当前节点中和所有后续节点中的事件侦听器进行处理。
     */
    p.stopImmediatePropagation = function() {
        this._immediatePropagationStoped = true;
        this._propagationStoped = true;
    };

    /**
     * 防止对事件流中当前节点的后续节点中的所有事件侦听器进行处理。
     */
    p.stopPropagation = function() {
        this._propagationStoped = true;
    };

    /**
     * 如果可以取消事件的默认行为，则取消该行为。
     */
    p.preventDefault = function() {
        this._defaultPrevented = true;
    };

    /**
     * 移除当前正在处理事件的侦听器。
     */
    p.removeListener = function() {
        this._listenerRemoved = true;
    };

    return Event;

});



