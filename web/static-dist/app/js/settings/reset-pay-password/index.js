webpackJsonp(["app/js/settings/reset-pay-password/index"],[function(r,s){"use strict";var a=$("#settings-pay-password-form").validate({rules:{"form[oldPayPassword]":{required:!0,minlength:5,maxlength:20},"form[newPayPassword]":{required:!0,minlength:5,maxlength:20},"form[confirmPayPassword]":{required:!0,equalTo:"#form_newPayPassword"}}});$("#password-save-btn").on("click",function(r){var s=$(r.currentTarget);a.form()&&(s.button("loading"),$("#settings-pay-password-form").submit())})}]);