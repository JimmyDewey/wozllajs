define(function() {

    return function(construct, superConstruct) {
        construct._super = superConstruct;
        return construct.prototype = Object.create(superConstruct.prototype, {
            constructor : {
                value : construct,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
    }
});