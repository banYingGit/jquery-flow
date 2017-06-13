+function ($) {

    var _default = {};

    var ModalFloat = function (element, options) {

        this.$element = $(element);

        this.options = $.extend({}, _default, options);

        _createElement.call(this);

        _event.call(this);

    };

    //创建元素

    function _createElement() {

        this.$element.addClass('modal-box modalFlow').attr({'data-role': 'modal'});

        var title = $('<h2  class="modal-title"><a href="javascript:void(0)" data-role="close">X 关闭</a><span data-role="title"></span></h2>'),

            body = $('<div class="modal-body" data-role="body">'),

            button = $('<div class="modal-btn" data-role="button">');

        this.$element.append(title).append(body).append(button);


        //自动创建元素落地
        if ($('body').has(this.$element).size() == 0) {

            $('body').append(this.$element);

        }

    }


    // 创建私有方法

    function _event() {

        var $this = this;

        this.$element.on('click', '[data-role=close]', function () {

            $this.hide()

        });

        $this.title()

    }

    //添加load 方法

    ModalFloat.prototype.load = function (url, params, fn) {

        var $this = this,

            _url,

            _params,

            _fn;

        if (typeof url == 'string') {

            // $.type(url) == 'string'

            _url = url

        } else if ($.isPlainObject(url)) {

            _url = $this.options.url;

            _params = url

        } else if ($.isFunction(url)) {

            _url = $this.options.url;

            _params = $this.options.params;

            _fn = url

        }

        if ($.isPlainObject(params)) {

            _params = params

        } else if ($.isFunction(params)) {

            _params = $this.options.params;

            _fn = params
        }

        if (!_url) {

            return false

        }

        this.$element.trigger('load');

        $('[data-role=body]', this.$element).append('正在加载。。。').load(_url, _params, function (data) {

            $this.$element.trigger('done', [data]);

            _fn && _fn.call(data)

        })


    };

    //设置modal title

    ModalFloat.prototype.title = function (title) {

        var _title = title || this.options.title || '';

        _title && $('[data-role=title]', this.$element).text(_title)

    };

    //设置modal body

    ModalFloat.prototype.body = function (body) {

        var _body = body || '';

        _body && $('[data-role=body]', this.$element).empty().append(_body)

    };

    // 设置modal 清除body方法

    ModalFloat.prototype.clear = function () {

        this.$element.empty();

    };

    //设置modal button

    ModalFloat.prototype.button = function (button) {

        var $this = this;

        $('[data-role=button]', $this.$element).empty()

        $.each(button || [], function () {

            $('[data-role=button]', $this.$element).append(this)

        })

    };


    // 添加公开显示方法

    ModalFloat.prototype.show = function () {

        this.$element.trigger('show');

        var $this = this;

        var bodyValue = $.trim($this.$element.html()).length;


        if (this.options.url && bodyValue == 0) {

            //实际使用

            //  $this.$element.load($this.options.url , $this.options.params || params || {})

            //测试用法

            $this.$element.load($this.options.url)

        }

        this.$element.addClass(function () {

            setTimeout($.proxy(function () {

                this.trigger('shown');

            }, $this.$element), 500)

            return 'modal-into'

        });

    };

    // 添加公开隐藏方法

    ModalFloat.prototype.hide = function () {

        this.$element.trigger('hide');


        var $this = this;

        this.$element.removeClass(function () {

            setTimeout($.proxy(function () {

                this.trigger('hidden');


            }, $this.$element), 500)

            return 'modal-into'

        })

    };


    //下面的看不懂了，等我长大我就看懂了
    function Plugin(option) {

        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function () {

            var $this = $(this);

            var data = $this.data('by.modalFloat');

            var options = typeof option == 'object' && option;

            if (!data) {

                $this.data('by.modalFloat', (data = new ModalFloat(this, options)))

            }

            if (typeof option == 'string') {

                data[option].apply(data, args)


            }

            return data;

        })

    };

    var old = $.fn.modalFloat;

    $.fn.modalFloat = Plugin;

    $.fn.modalFloat.Constructor = ModalFloat;

    $.fn.modalFloat.noConflict = function () {

        $.fn.modalFloat = old;

        return this

    }

}(jQuery)