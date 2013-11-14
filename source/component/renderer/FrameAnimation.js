define([
    'wozllajs',
    'wozllajs/core/Time',
    'wozllajs/core/Renderer',
    'wozllajs/core/Behaviour',
    'wozllajs/assets/Texture',
    'wozllajs/build/annotation/$Resource',
    'wozllajs/build/annotation/$Component',
    'wozllajs/build/annotation/$Query',
    './../annotation/$Property'
], function(W, Time, Renderer, Behaviour, Texture, $Resource, $Component, $Query, $Property) {

    $Component({ id: 'renderer.FrameAnimation', constructor: FrameAnimation });
    function FrameAnimation() {
        Renderer.apply(this, arguments);
    }

    var p = W.inherits(FrameAnimation, Renderer);

    p.alias = 'c-frameAnimation';

    $Property({ property: 'name', type: 'string' });
    p.name = undefined;

    $Property({ property: 'texture', type: 'texture' });
    $Resource({ property: 'texture' });
    p.texture = undefined;

    $Property({ property: 'frameTime', type: 'int' });
    p.frameTime = 33;

    $Property({ property: 'paused', type: 'boolean' });
    p.paused = false;

    p._currentFrameStartTime = null;
    p._pauseFrameTime = 0;

    p.applyProperties = function(properties) {
        if(properties.texture instanceof Texture) {
            this.texture = properties.texture;
        }
        this.frameTime = properties.frameTime;
        this.paused = properties.paused;
    };

    p.update = function() {
        if(!this.texture) return;
        if(!this._currentFrameStartTime) {
            this._currentFrameStartTime = Time.now;
            this.currentFrame = 0;
            return;
        }
        if(this._paused) {
            this._currentFrameStartTime = Time.now - this._pauseFrameTime;
        }
        if(Time.now - this._currentFrameStartTime >= this.frameTime) {
            this._currentFrameStartTime = Time.now;
            this.currentFrame ++;
            if(!this.texture.getFrame(this.currentFrame)) {
                this.currentFrame = 0;
            }
        }
    };

    p.play = function(callback) {
        this.paused = false;
        this.currentFrame = 0;
        this._currentFrameStartTime = null;
    };

    p.setPaused = function(flag) {
        this.paused = flag;
        if(this.paused) {
            this._pauseFrameTime = (Date.now() - this._currentFrameStartTime) || 0;
        }
    };

    p.draw = function(context, visibleRect) {
        if(this.texture) {
            var sourceSize = this.texture.getSpriteSourceSize(this.currentFrame);
            if(sourceSize) {
                this.texture.drawFrame(context, this.currentFrame, sourceSize.x, sourceSize.y);
            }
        }
    };

    p.isInstanceof = function(type) {
        return this instanceof type || type === Behaviour;
    };

    return FrameAnimation;
});