$(document).ready(function() {
    $('#signupForm').bootstrapValidator({
    	feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            email: {
                validators: {
                    emailAddress: {
                        message: 'The value is not a valid email address.'
                    }
                }
            },
            password: {
                validators: {
                    identical: {
                        field: 'confirmPassword',
                        message: 'The password and its confirm are not the same.'
                    }
                }
            },
            confirmPassword: {
                validators: {
                    identical: {
                        field: 'password',
                        message: 'The password and its confirm are not the same.'
                    }
                }
            }
        }
    });
});