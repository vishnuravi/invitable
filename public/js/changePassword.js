$(document).ready(function() {
    $('#changePasswordForm')
      .on('init.field.bv', function(e, data) {
            var $parent    = data.element.parents('.form-group'),
                $icon      = $parent.find('.form-control-feedback[data-bv-icon-for="' + data.field + '"]'),
                options    = data.bv.getOptions(),
                validators = data.bv.getOptions(data.field).validators;

            if (validators.notEmpty && options.feedbackIcons && options.feedbackIcons.required) {
                $icon.addClass(options.feedbackIcons.required).show();
            }
        })
    .bootstrapValidator({
        container: 'popover',
    	feedbackIcons: {
            required: 'glyphicon glyphicon-asterisk',
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            confirmPassword: {
                validators: {
                    identical: {
                        field: 'confirmPassword',
                        message: 'The two password fields must be the same.'
                    },
                    notEmpty: {
                        message: 'Please confirm the password.'
                    }
                },
            },
            newPassword: {
                validators: {
                    identical: {
                        field: 'password',
                        message: 'The two password fields must be the same.'
                    },
                    notEmpty: {
                        message: 'Please enter a password.'
                    }
                }
            }
        }
    });
});