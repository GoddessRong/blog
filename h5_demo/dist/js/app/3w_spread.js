define('js/app/3w_spread.js', function (require, exports, module) {
    var $ = require('jquery'),
        Swiper = require('swiper.jquery'),
        SimpleImgPreloader = require('mod/simpleImgPreloader'),
        ProgressBar = require('mod/progressBar'),
        StateManager = require('mod/stateManager');

    require('mod/transition');

    var PRE_LEAVE_DURATION = 300,
        Conf = {
            firstPreloadRes: [
                '/img/3w_spread/bg.jpg',
                '/img/3w_spread/flash_1.png',
                '/img/3w_spread/flash_2.png',
                '/img/3w_spread/star.png',
                '/img/3w_spread/zhiwen.png',
                '/img/3w_spread/page_1/1.png',
                '/img/3w_spread/page_1/2.png',
                '/img/3w_spread/page_1/3.png',
            ],
            secondPreloadRes: []
        };

    function Video (options) {
        var opts = $.extend({
            onPlay: $.noop
        }, options);

        var video = document.getElementById('video'),
            playing = false,
            docE = document.documentElement;

        function requestFullScreen(video) {
            if (video.requestFullscreen) {
                video.requestFullscreen();
            } else if (video.mozRequestFullScreen) {
                video.mozRequestFullScreen();
            } else if (video.webkitRequestFullScreen) {
                video.webkitRequestFullScreen();
            }
        }

        video.addEventListener('playing', opts.onPlay, false);

        var fullscreenchangeEvent;
        ['onfullscreenchange', 'onwebkitfullscreenchange', 'onmozfullscreenchange', 'onmsfullscreenchange'].forEach(function (eventName) {
            if (!fullscreenchangeEvent && (eventName in docE)) {
                fullscreenchangeEvent = eventName;
            }
        });

        //监听全屏切换的事件
        docE[fullscreenchangeEvent] = function (event) {
            playing = !playing;

            if (!playing) {
                _pause()
            } else {

            }
        };

        var _pause = function () {
            video.load();
            video.pause();
        };

        return {
            play: function () {
                requestFullScreen(video);
                video.play();
            },
            pause: _pause
        }
    }

    function main() {
        var swiper = new Swiper('#swiper', {
            direction: 'vertical',
            preloadImages: false,
            lazyLoading: true,
            lazyLoadingInPrevNext: true,
            lazyLoadingInPrevNextAmount: 2,
            slidesPerView: 1
        });

        $('#btn_play_video').on('tap', function (e) {
            //video.play();
            swiper.slideTo(1);
        });

        var video = new Video({
            onPlay: function(){
                swiper.slideTo(1);
            }
        });
    }

    //页面初始化状态管理
    var initState = new StateManager({
        preload: false
    }, function () {
        $('#main').addClass('in').one($.transitionEnd.end, function () {
            $('#loader_wrap').remove();
            loader.destroy();
            main();
            $('#main').addClass('main_init');
        }).emulateTransitionEnd(PRE_LEAVE_DURATION);
    });

    //进度加载条
    var loader = new ProgressBar('#loader', {
        onComplete: function () {
            //告诉initState，预加载的资源已经OK了
            initState.set('preload', true);
        },
        duration: 1000
    });

    //资源预加载
    SimpleImgPreloader(Conf.firstPreloadRes, function (percentage) {
        loader.setValue(percentage);
    });
});