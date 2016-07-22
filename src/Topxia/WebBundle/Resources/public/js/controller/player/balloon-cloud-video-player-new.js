define(function(require, exports, module) {

    var Widget = require('widget');
    require("video-player-new");

    var BalloonCloudVideoPlayer = Widget.extend({
        attrs: {
            url: '',
            fingerprint: '',
            watermark: '',
            agentInWhiteList: '',
            timelimit: 10,
            remeberLastPos: true,
            disableControlBar: false,
            disableProgressBar: false,
            questions: [],
            enablePlaybackRates: false,
            playbackRatesMP4Url: ''
        },

        events: {},

        setup: function() {
            var elementId = this.element.attr("id");
            var self = this;

            var extConfig = {};

            if(self.get('watermark') != '') {
                extConfig = $.extend(extConfig, {
                    watermark: {
                        file: self.get('watermark'),
                        pos : 'top.right',//top.right, bottom.right, bottom.left, center
                        xrepeat: 0,
                        opacity: 0.5
                    }
                });
            }

            if(self.get('fingerprint') != '') {
                extConfig = $.extend(extConfig, {
                    fingerprint: {
                        html: self.get('fingerprint'),
                        duration: 100
                    }
                })
            }

            if(self.get('timelimit') != '') {
                extConfig = $.extend(extConfig, {
                    pluck: {
                        timelimit: self.get('timelimit'),
                        text: "免费试看结束，购买后可完整观看",
                        display: true
                    }
                })
            }

            var questions = self.getQuestions();
            if(questions) {
                extConfig = $.extend(extConfig, {
                    exam: { 
                        popupExam : {
                            config : {
                                "mode" : "middle"
                            },
                            questions : questions
                        }
                    }
                });
            }
            var isIE = navigator.userAgent.toLowerCase().indexOf('msie')>0;
            function needMp4ForPlaybackRate(){
                // IE9以下不支持倍数播放，IE9及以上不支持HLS
                if (isIE && !$('html').hasClass('lt-ie9')) {
                    return true;
                }
                // 低版本(47以下)的 chrome使用mp4方式倍速播放
                var re = /Chrome\/(\d{0,3})/i;
                var found = navigator.userAgent.match(re);
                return found && found[1] < 47;

            }
            var needMp4ForPlaybackRate = needMp4ForPlaybackRate();
            function getPlaybackRatesSrc() {
                if (isIE && $('html').hasClass('lt-ie9') ) {
                    return '';
                }
                if (needMp4ForPlaybackRate) {
                    if (self.get('playbackRatesMP4Url') == '') {
                        return '';
                    }
                    return [{src : self.get('playbackRatesMP4Url'), type : 'video/mp4', label : '高清'}];
                }
                return self.get('url');
            }

            if(self.get('enablePlaybackRates') != false && getPlaybackRatesSrc() != '') {
                extConfig = $.extend(extConfig, {
                    playbackRates: {
                        enable : true,
                        source : needMp4ForPlaybackRate ? 'mp4' : 'hls',
                        rates : [ 0.75, 1, 1.2, 1.3, 1.5, 1.8, 2],
                        src : getPlaybackRatesSrc()
                    }
                });
            }

            var player = new VideoPlayerSDK($.extend({
                id: elementId,
                disableControlBar: self.get('disableControlBar'),
                disableProgressBar: self.get('disableProgressBar'),
                playlist: self.get('url'),
                remeberLastPos : self.get('remeberLastPos')
            }, extConfig));

            player.on('ready', function(e){
                self.trigger("ready", e);
            });

            player.on("timeupdate", function(e){
                self.trigger("timechange", e);
            });

            player.on("ended", function(e){
                self.trigger("ended", e);
            });

            player.on("playing", function(e){
                self.trigger("playing", e);
            });

            player.on("paused", function(e){
                self.trigger("paused", e);
            });

            player.on("answered", function(e){
                var data = e.data;
                data['answer'] = data.result.choosed;
                data['type'] = self.convertQuestionType(data.type, 'cloud');
                self.trigger("answered", data);
            });
            
            self.set('player', player);

            BalloonCloudVideoPlayer.superclass.setup.call(self);

            // window.BalloonPlayer = this;
        },

        play: function(){
            this.get("player").play();
        },

        pause: function(){
            this.get("player").pause();
        },

        isPlaying: function() {
            if(this.get("player") && this.get("player").paused){
                return !this.get("player").paused();
            }
            return false;
        },

        getQuestions: function() {
            var questions = this.get('questions');

            if(questions == '' || questions.length == 0) {
                return null;
            }

            for (var i in questions) {
                questions[i]['type'] = this.convertQuestionType(questions[i].type, 'es');
            }

            return questions;
        },

        //todo delete
        convertQuestionType: function(source, from) {
            var map = [ //云播放器弹题的字段值跟ES不太一致
                {
                    es: 'choice',
                    cloud: 'multiChoice'
                }, {
                    es: 'single_choice',
                    cloud: 'choice'
                }, {
                    es: 'determine',
                    cloud: 'judge'
                }
            ];

            for (var i in map) {
                if (from == 'es' && map[i]['es'] == source) {
                    return map[i]['cloud'];
                }
                if (from == 'cloud' && map[i]['cloud'] == source) {
                    return map[i]['es'];
                }
            }

            return source;
        }

    });

    module.exports = BalloonCloudVideoPlayer;
});