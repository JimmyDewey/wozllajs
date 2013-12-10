define(function(require) {

	var listenAppState = require('../utils/listenAppState');
    var Objects = require('../utils/Objects');
    var Rectangle = require('../math/Rectangle');
    var CachableGameObject = require('./CachableGameObject');
    var Touch = require('./Touch');

    var visibleRect = new Rectangle();

    var Stage = function(param) {
		var me = this;
        CachableGameObject.apply(this, arguments);
        this.autoClear = param.autoClear;
		this.bgColor = param.bgColor;
        this._width = param.width || param.canvas.width;
        this._height = param.height || param.canvas.height;
        this.stageCanvas = param.canvas;
        this.stageContext = this.stageCanvas.getContext('2d');
        Stage.root = this;
        Touch.init(this);
        this.init();
    };

    Stage.root = null;

    var p = Objects.inherits(Stage, CachableGameObject);

    p.isStage = true;

    p.tick = function() {
        this.update();
        this.lateUpdate();
        this.draw();
    };

    p.draw = function() {
        if(this.autoClear) {
			if(this.bgColor) {
				this.stageContext.fillStyle = this.bgColor;
				this.stageContext.fillRect(0, 0, this._width, this._height);
			} else {
				this.stageContext.clearRect(0, 0, this._width, this._height);
			}
		}
        CachableGameObject.prototype.draw.apply(this, [this.stageContext, this.getVisibleRect()]);
    };

    p.resize = function(width, height) {
        this.stageCanvas.width = width;
        this.stageCanvas.height = height;
        this._width = width;
        this._height = height;
    };

    p.getVisibleRect = function() {
        visibleRect.x = -this.transform.x;
        visibleRect.y = -this.transform.y;
        visibleRect.width = this._width;
        visibleRect.height = this._height;
        return visibleRect;
    };

    return Stage;

});