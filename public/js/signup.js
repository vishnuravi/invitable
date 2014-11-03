$(document).ready(function() {
    $('#signupForm').bootstrapValidator({
        container: 'popover',
    	feedbackIcons: {
            required: 'glyphicon glyphicon-asterisk',
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            email: {
                validators: {
                    emailAddress: {
                        message: 'Please enter a valid e-mail address.'
                    },
                    notEmpty: {
                        message: 'An e-mail address is required.'
                    }
                }
            },
            password: {
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
            confirmPassword: {
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