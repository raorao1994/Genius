/*
 * 描述：Canvas 操作辅助类，封装Canvas 容器，及常见的图形（线段，圆弧，扇形，矩形，文字）
 *      为图元对象提供事件及常见的动画机制，配合地上地下全资源系统 区域总览功能完成复杂的
 *      饼图，折线图，柱状图，并加入动画
 * 日期：2018-07-11
 * 版本：1.0.0.0
 * 作者：蔡 猛
 * 备注：1、暂未做缓存优化
        2、代码书写格式有待优化,
        3、关于hasPoint事件，此段代码中只为用到的“扇形”对象，重写了此方法，其余对象若需要注册
        事件，请重写此方法
 */
;
(function () {
    function CanvasUtility() {
        this._init();
    }

    CanvasUtility.prototype = {
        _init: function () {
            var _this = this;

            /* 容器对象 */
            _this.Container = function (canvas) {
                if (canvas == null) {
                    throw Error('canvas 对象不能为空！');
                }
                this.canvas = canvas;
                this.context = canvas.getContext('2d');
                this.context.globalAlpha = 1;
                this._children = [];
                this.initMouseMove();
            }
            _this.Container.prototype = {
                constructor: _this.Container,
                add: function (graphic) {
                    graphic.canvas = this.canvas;
                    graphic.context = this.context;
                    this._children.push(graphic);
                },
                remove: function (groupId) {
                    this._children = this._children.filter(function (item) { return item.groupId != groupId })
                },
                getGroup: function (groupId) {
                    return this._children.filter(function (item) { return item.groupId == groupId })
                },
                repaint: function () {
                    this._children.forEach(function (child) {
                        child.draw();
                    });
                },
                clear: function (x, y, width, height) {
                    x = x || 0;
                    y = y || 0;
                    width = width || this.canvas.width;
                    height = height || this.canvas.height;
                    var context = this.context;
                    context.clearRect(x,y,width,height);
                },
                initMouseMove: function () {
                    var self = this;
                    this.canvas.addEventListener('mousemove', function (event) {
                        self._handlerMouseMove(event, self);
                    }, false);
                },
                _handlerMouseMove: function (event, container) {
                    var point = container._getCoordinate(event.clientX, event.clientY);
                    var array = _this.EventManager.getTarget('mousemove');
                    var current = null;
                    for (var i = 0, item; item = array[i++];) {
                        if (item.hasPoint(point) && item.hasListeners('mousemove')) {
                            item.Container = container;
                            item.inBounds = true;
                            current = item;
                            var _event = new _this.Event(point.x, point.y, 'mousemove', item);
                            item.fire(_event);
                        }
                    }
                    for (var type in _this.EventManager._targets) {
                        if (type == 'mousemove') continue;
                        var arr = _this.EventManager._targets[type];
                        for (var i = 0, item; item = arr[i++];) {
                            if (item != current && item.inBounds) {
                                item.inBounds = false;
                                if (item.hasListeners('mouseout')) {
                                    var _event = new _this.Event(point.x, point.y, 'mouseout', item);
                                    item.fire(_event);
                                }
                            }
                        }
                    }
                },
                _getCoordinate: function (x, y) {
                    var box = this.canvas.getBoundingClientRect();
                    return {
                        x: x - box.left,
                        y: y - box.top
                    }
                }
            };

            /* 事件对象 */
            _this.Event = function (x, y, type, target) {
                this.x = x || null;
                this.y = y || null;
                this.type = type || null;
                this.target = target || null;
            }
            /* 事件管理 */
            _this.EventManager = new  function () {
                this._targets = {};
                this.addTarget = function (type, target) {
                    if (!type || target == null) {
                        return;
                    }
                    if (!this._targets.hasOwnProperty(type)) {
                        this._targets[type] = [];
                    }
                    this._targets[type].push(target);
                }
                this.getTarget = function (type) {
                    if (!this._targets.hasOwnProperty(type)) {
                        return [];
                    } else {
                        return this._targets[type];
                    }
                }
            }

            /* 事件监听对象 */
            _this.EventTarget = function () {
                this._listeners = {}; //事件处理函数列表
                this.inBounds = false;
            }
            _this.EventTarget.prototype = {
                constructor: _this.EventTarget,
                /* 添加事件监听 */
                addListener: function (type, listener) {
                    if (!this._listeners.hasOwnProperty(type)) {
                        this._listeners[type] = [];
                    }
                    this._listeners[type].push(listener);
                    _this.EventManager.addTarget(type, this);
                },
                /* 判断事件是否具有监听函数 */
                hasListeners: function (type) {
                    if (this._listeners.hasOwnProperty(type)) {
                        return true;
                    } else {
                        return false;
                    }
                },
                /* 触发事件 */
                fire: function (event) {
                    if (event == null || event.type == null) {
                        return;
                    }
                    if (Array.isArray(this._listeners[event.type])) {
                        var listeners = this._listeners[event.type];
                        for (var i = 0, item; item = listeners[i++];) {
                            item.call(this, event);
                        }
                    }
                },
                /* 移除监听 */
                removeListener: function () {

                },
                extend: function (obj) {
                    for (var key in obj) {
                        this[key] = obj[key];
                    }
                }
            }

            /* 图元对象 */
            _this.Graphic = function () {
                _this.EventTarget.call(this);
                this.canvas = null;
                this.context = null;
                this.groupId = null;
                this.id = null;
            }
            _this.Graphic.prototype = Object.create(_this.EventTarget.prototype);
            _this.Graphic.constructor = _this.Graphic;
            _this.Graphic.prototype.hasPoint = function (point) {
                return null;
            }

            /* 圆弧对象 */
            _this.Arc = function (x, y, radius, startAngle, endAngle, anticlockwise, isFill, bgColor) {
                _this.Graphic.call(this);
                this.x = x || null;
                this.y = y || null;
                this.radius = radius || null;
                this.startAngle = startAngle || null;
                this.endAngle = endAngle || null;
                this.anticlockwise = anticlockwise || null;
                this.isFill = isFill || null;
                this.bgColor = bgColor || null;
            }
            _this.Arc.prototype = Object.create(_this.Graphic.prototype);
            _this.Arc.constructor = _this.Arc;
            _this.Arc.prototype.extend({
                draw: function () {
                    var context = this.context;
                    if (this.isFill) {
                        context.fillStyle = this.bgColor;
                        context.beginPath();
                        context.moveTo(this.x, this.y)
                        context.arc(this.x, this.y, this.radius, _this._getAngle(this.startAngle), _this._getAngle(this.endAngle), this.anticlockwise);
                        context.closePath();
                        context.fill();
                    } else {
                        context.strokeStyle = this.bgColor;
                        context.beginPath();
                        context.moveTo(this.x, this.y)
                        context.arc(this.x, this.y, this.radius, _this._getAngle(this.startAngle), _this._getAngle(this.endAngle), this.anticlockwise);
                        context.closePath();
                        context.stroke();
                    }

                },
                hasPoint: function (point) {
                    var isIn = false;
                    var context = this.context;
                    context.beginPath();
                    context.moveTo(this.x, this.y)
                    context.arc(this.x, this.y, this.radius, _this._getAngle(this.startAngle), _this._getAngle(this.endAngle), this.anticlockwise);
                    context.closePath();
                    if (context.isPointInPath(point.x, point.y)) {
                        isIn = true;
                    }
                    context.restore();
                    return isIn;
                }
            })

            /* 文字对象 */
            _this.Text = function (x, y, text, fontFamily, fontColor, fontSize, textAlign) {
                _this.Graphic.call(this);
                this.x = x || null;
                this.y = y || null;
                this.text = text || null;
                this.fontFamily = fontFamily || null;
                this.fontColor = fontColor || null;
                this.fontSize = fontSize || null;
                this.textAlign = textAlign || null;
            }
            _this.Text.prototype = Object.create(_this.Graphic.prototype);
            _this.Text.constructor = _this.Text;
            _this.Text.prototype.extend({
                draw: function () {
                    var context = this.context;
                    context.beginPath();
                    context.font = this.fontSize + ' ' + this.fontFamily;
                    context.fillStyle = this.fontColor;
                    context.textAlign = this.textAlign;
                    context.fillText(this.text, this.x, this.y);
                },
                hasPoint: function () {

                }
            });

            /* 扇形对象 */
            _this.Sector = function (x, y, innerRadius, outRadius, startAngle, endAngle, bgColor) {
                _this.Graphic.call(this);
                this.x = x || null;
                this.y = y || null;
                this.innerRadius = innerRadius || null;
                this.outRadius = outRadius || null;
                this.startAngle = _this._getAngle(startAngle) || null;
                this.endAngle = _this._getAngle(endAngle) || null;
                this.bgColor = bgColor || null;
            }
            _this.Sector.prototype = Object.create(_this.Graphic.prototype);
            _this.Sector.constructor = _this.Sector;
            _this.Sector.prototype.extend({
                draw: function () {
                    var context = this.context;
                    context.beginPath();
                    var startx = Math.cos(this.startAngle) * this.innerRadius + this.x;
                    var startY = Math.sin(this.startAngle) * this.innerRadius + this.y;
                    var startx2 = Math.cos(this.endAngle) * this.outRadius + this.x;
                    var startY2 = Math.sin(this.endAngle) * this.outRadius + this.y;
                    context.moveTo(startx, startY);
                    context.fillStyle = this.bgColor;
                    context.arc(this.x, this.y, this.innerRadius, this.startAngle, this.endAngle, false);
                    context.lineTo(startx2, startY2);
                    context.arc(this.x, this.y, this.outRadius, this.endAngle, this.startAngle, true);
                    context.lineTo(Math.cos(this.startAngle) * this.innerRadius + this.x, Math.sin(this.startAngle) * this.innerRadius + this.y);
                    context.fill();
                },
                hasPoint: function (point) {
                    var context = this.context;
                    var isIn = false;
                    context.save();
                    context.beginPath();
                    var startx = Math.cos(this.startAngle) * this.innerRadius + this.x;
                    var startY = Math.sin(this.startAngle) * this.innerRadius + this.y;
                    var startx2 = Math.cos(this.endAngle) * this.outRadius + this.x;
                    var startY2 = Math.sin(this.endAngle) * this.outRadius + this.y;
                    context.moveTo(startx, startY);
                    context.fillStyle = this.bgColor;
                    context.arc(this.x, this.y, this.innerRadius, this.startAngle, this.endAngle, false);
                    context.lineTo(startx2, startY2);
                    context.arc(this.x, this.y, this.outRadius, this.endAngle, this.startAngle, true);
                    context.lineTo(Math.cos(this.startAngle) * this.innerRadius + this.x, Math.sin(this.startAngle) * this.innerRadius + this.y);
                    context.closePath();
                    if (context.isPointInPath(point.x, point.y)) {
                        isIn = true;
                    }
                    context.restore();
                    return isIn;
                }
            });

            /* 线段对象 */
            _this.Line = function (startX, startY, endX, endY, lineWidth, bgColor) {
                _this.Graphic.call(this);
                this.startX = startX || null;
                this.startY = startY || null;
                this.endX = endX || null;
                this.endY = endY || null;
                this.lineWidth = lineWidth || null;
                this.bgColor = bgColor || null;
            }
            _this.Line.prototype = Object.create(_this.Graphic.prototype);
            _this.Line.constructor = _this.Line;
            _this.Line.prototype.extend({
                draw: function () {
                    var context = this.context;
                    context.beginPath();
                    context.strokeStyle = this.bgColor;
                    context.lineWidth = this.lineWidth;
                    context.moveTo(this.startX, this.startY);
                    context.lineTo(this.endX, this.endY);
                    context.closePath();
                    context.stroke();
                },
                hasPoint: function () {

                }
            });

            /* 矩形对象 */
            _this.Rect = function (x, y, width, height, isFill, bgColor) {
                _this.Graphic.call(this);
                this.x = x || null;
                this.y = y || null;
                this.width = width || null;
                this.height = height || null;
                this.isFill = isFill || null;
                this.bgColor = bgColor || null;
            }
            _this.Rect.prototype = Object.create(_this.Graphic.prototype);
            _this.Rect.constructor = _this.Rect;
            _this.Rect.prototype.extend({
                draw: function () {
                    var context = this.context;
                    context.beginPath();
                    if (this.isFill) {
                        context.fillStyle = this.bgColor;
                        context.fillRect(this.x, this.y, this.width, this.height);
                    } else {
                        context.strokeStyle = this.bgColor;
                        context.strokeRect(this.x, this.y, this.width, this.height);
                    }
                },
                hasPoint: function (point) {
                    var context = this.context;
                    var isIn = false;
                    context.save();
                    context.beginPath();
                    context.rect(this.x, this.y, this.width, this.height);
                    if (context.isPointInPath(point.x, point.y)) {
                        isIn = true;
                    }
                    context.closePath();
                    context.restore();
                    return isIn;
                }
            });

            /* 辅助工具 */
            _this.getArcCenter = function (arc, offsetx, offsety, radius) {
                radius = radius || arc.outRadius;
                var startAngle = arc.startAngle;
                var endAngle = arc.endAngle;
                var angle = startAngle + ((endAngle - startAngle) / 2);
                return {
                    x: radius * Math.cos(angle) + offsetx,
                    y: radius * Math.sin(angle) + offsety
                }
            }
            _this._getAngle = function (arc) {
                return Math.PI * (arc / 180);
            }
        }
    };
    window.CanvasUtility = CanvasUtility;
})();

