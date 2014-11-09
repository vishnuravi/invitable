$(document).ready(function() {
$('#loginForm')
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
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                email: {
                    validators: {
                        emailAddress: {
                            message: 'Please enter a valid e-mail address.'
                        }
                    }
                },
            }
        });
});