webpackJsonp(["app/js/courseset-manage/header/index"],[function(e,s,a){"use strict";function t(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(s,"__esModule",{value:!0}),s.publishCourseSet=void 0;var n=a("b334fd7e4c5a19234db2"),u=t(n),r=s.publishCourseSet=function(){$("body").on("click",".course-publish-btn",function(e){confirm(Translator.trans("course_set.manage.publish_hint"))&&$.post($(e.target).data("url"),function(e){e.success?((0,u.default)("success",Translator.trans("course_set.manage.publish_success_hint")),location.reload()):(0,u.default)("danger",Translator.trans("course_set.manage.publish_fail_hint")+":"+e.message,{delay:5e3})})})};r()}]);