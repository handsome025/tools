angular.module('ued').factory('BigWheel', function () {

    /**
     * 大转盘
     * @depend：jQuery, jQueryRotate
     * @param：selector(转盘选择器), prizes(奖品code数组)
     */
    function BigWheel(selector, prizes) {
        selector = selector || "";
        prizes = prizes || [];

        var arr = [];
        var len = prizes.length;
        for (var i = 0; i < len; i++) {
            arr.push(360 / len * i);
        }

        /**
         * 抽奖
         * @param code    奖品code
         * @param callback  转盘结束的回调
         * @returns {boolean}  是否执行成功
         */
        this.lottery = function(code, callback) {
            var animateTo, i;
            try {
                for (i = 0; i < len; i++) {
                    if (prizes[i] == code) {
                        break;
                    }
                }
                if (i == len) {
                    return false;
                }
                animateTo = arr[i] + (parseInt(Math.random() * 10) + 10) * 360;
            } catch (e) {
                return false;
            }
            $(selector).rotate({
                duration: 5000,
                angle: 0,
                center: ["50%", "50%"],
                animateTo: animateTo,
                callback: function() {
                    typeof callback == "function" ? callback() : $.noop;
                }
            });
            return true;
        }
    };

    return BigWheel;
})