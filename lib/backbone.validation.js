// Backbone.Validation v0.1.3
//
// Copyright (C)2011 Thomas Pedersen
// Distributed under MIT License
//
// Documentation and full license availabe at:
// http://github.com/thedersen/backbone.validation
// ----------------------------
// Backbone.Validation
// ----------------------------
Backbone.Validation = (function(Backbone, _) {

    var getValidators = function(model, attr) {

        var validationElements = model.validation, validators = [], validationElement, validation;

        if( ! _.isArray(validationElements)) {
            validationElements = [validationElements];
        }

        for (var i = 0, l = validationElements.length; i < l; i++) {
            validationElement = validationElements[i];

            validation = validationElement[attr];
         
            if (_.isFunction(validation)) {
                return validation;
            } else {
                for (var validator in validation) {
                    if (validator !== 'msg' && validation.hasOwnProperty(validator)) {

                        validators.push({
                            fn: Backbone.Validation.validators[validator],
                            val: validation[validator],
                            msg: validation.msg
                        });
                    }
                }
            }
        }
        
        return validators;
    };

    var validateAttr = function(model, attr, value) {

        var validators = getValidators(model, attr),
            errors = [],
            validator, 
            result;

        if (_.isFunction(validators)) {
            return validators(value);
        } else {
            for (var i = 0; i < validators.length; i++) {
                validator = validators[i];
                result = validator.fn(value, attr, validator.msg, validator.val);
                if (result) {
                    errors.push( result);
                }
            };
            if( errors.length > 0) return errors;
        }
    };

    return {
        version: '0.1.3',

        bind: function(view, options) {
            options = options || {};
            var model = view.model,
                validFn = options.valid || Backbone.Validation.callbacks.valid,
                invalidFn = options.invalid || Backbone.Validation.callbacks.invalid;

            model.validate = function(attrs) {
                var invalidAttr = false,
                    isValid = true,
                    errors;

                for (var changedAttr in attrs) {
                    if (changedAttr === 'isValid') {
                        return false;
                    }

                    errors = validateAttr(model, changedAttr, attrs[changedAttr]);
                    if (errors) {
                        invalidAttr = true;
                        invalidFn(view, changedAttr, errors);
                    } else {
                        validFn(view, changedAttr);
                    }
                }

                if (invalidAttr) {
                    model.set({
                        isValid: false},
                        {silent:true});
					
					model.trigger('isInvalid', model);
					
                } else {
                    for (var validatedAttr in model.validation) {
                        if (_.isUndefined(attrs[validatedAttr]) && validateAttr(model, validatedAttr, model.get(validatedAttr))) {
                            isValid = false;
                            break;
                        }
                    }
                    model.set({
                        isValid: isValid},
                        {silent:true});
					
					if( isValid === true)
                    {
                        model.trigger('isValid', model);
                    }
                    else
                    {
                        model.trigger('isInvalid', model);
                    }
                }

                return invalidAttr;
            };
        },

        unbind: function(view) {
            view.model.validate = undefined;
        }
    };
} (Backbone, _));

Backbone.Validation.callbacks = {
    valid: function(view, attr) {
        view.$('#' + attr).removeClass('invalid');
        view.$('#' + attr).removeAttr('data-error');
    },

    invalid: function(view, attr, error) {
        view.$('#' + attr).addClass('invalid');
        view.$('#' + attr).attr('data-error', error);
    }
};

Backbone.Validation.patterns = {
    number: /^\d+$/,
    email: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
    url: /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i
};

Backbone.Validation.validators = (function(patterns, _, $) {
    var numberPattern = patterns.number;
    var isNumber = function(value){
        return _.isNumber(value) || (_.isString(value) && value.match(numberPattern));
    };
    
    return {
        required: function(value, attr, msg) {
            var isEmptyString = _.isString(value) && $.trim(value) === '';
            var isFalseBoolean = _.isBoolean(value) && value === false;

            if (_.isNull(value) || _.isUndefined(value) || isEmptyString || isFalseBoolean) {
                return msg || attr + ' is required';
            }
        },
        min: function(value, attr, msg, minValue) {
            if (!isNumber(value) || value < minValue) {
                return msg || attr + ' must be larger than or equal to ' + minValue;
            }
        },
        max: function(value, attr, msg, maxValue) {
            if (!isNumber(value) || value > maxValue) {
                return msg || attr + ' must be less than or equal to ' + maxValue;
            }
        },
        minLength: function(value, attr, msg, minLength) {
            value = $.trim(value);
            if (_.isString(value) && value.length < minLength) {
                return msg || attr + ' must be longer than or equal to ' + minLength + ' characters';
            }
        },
        maxLength: function(value, attr, msg, maxLength) {
            value = $.trim(value);
            if (_.isString(value) && value.length > maxLength) {
                return msg || attr + ' must be shorter than or equal to' + maxLength + ' characters';
            }
        },
        pattern: function(value, attr, msg, pattern) {
            pattern = patterns[pattern] || pattern;
            if (_.isString(value) && !value.match(pattern)) {
                return msg || attr + ' is not a valid ' + pattern;
            }
        }
    };
} (Backbone.Validation.patterns, _, jQuery));