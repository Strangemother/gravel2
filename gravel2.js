function arg(_a, ia, def, returnArray) {
    var v = undefined

    // if ia is an array, find the
    // first correct definition
    if (ia.constructor  == Array) { 
        for(var i=0; i<ia.length; i++) {
            if(_a[ia[i]] || _a[ia[i]] === false ){
                v = _a[ia[i]];
                break;
            }
        }
    }
    else {
        if(_a[ia] || _a[ia] === false ) v = _a[ia];
    }

    if( (v == null) && (def != undefined) ) {
        v = def
    }

    if(returnArray){
        return [v, ia[i]]
    }
    else
    {
        return v
    }

}

// amsl                [int]               (50)                  Above Mean Sea Level. Vertical distance from the middle of the window, + = above, - = under.
// appendTo            [string]            (’body’)              Element to append popup (and modal overlay) to. For asp.net sites append to 'form'.
// appending           [bool]              (true)                Should the popup append to an element or just open where it is?  Version 0.7.0
// closeClass          [string]            ('b-close')           Class to bind the close event to. Version 0.3.3
// content             [string]            ('ajax')              Content of bpopup. Types: ['ajax', 'iframe', 'xlink', 'image' (Added in version 0.9.0)]. If loadUrl isn't defined it'll not use content type. Version 0.4.1
// contentContainer    [string]            (false)               Element which content should be added to. If undefined/null it will add it to $(this). Usage contentContainer:'.element' or contentContainer:'#element'.  Version 0.4.1
// easing              [string]            ('swing')             The easing of the popup when it opens. 'swing' and 'linear' are built-in in jQuery. If you want more you can use the jQuery Easing plugin. Version 0.9.0
// escClose            [bool]              (true)                Should popup close when press on escape?
// follow              [bool,bool]         ([true,true])         Should the popup follow the screen vertical and/or horizontal on scroll/resize? [horizontal, vertical, fixed on screen (see positionStyle instead)] Version 0.3.6. Changed in version 0.5.0 and again in version 0.6.0 and again in version 0.7.0.
// followEasing        [string]            ('swing')             The follow easing of the popup. 'swing' and 'linear' are built-in in jQuery. If you want more you can use the jQuery Easing plugin. Version 0.9.0
// followSpeed         [int/string]        (500)                 Animation speed for the popup on scroll/resize. Version 0.3.6
// loadData            [objectorstring]    (false)               LoadData is representing the data attribute in the jQuery.load() method. It gives you the opportunity to submit GET or POST values through the ajax request. Version 0.9.0
// loadUrl             [string]            (false)               External page or selection to load in popup. See loadCallback for callback. Version 0.3.4
// modal               [boolean]           (true)                Should there be a modal overlay behind the popup?
// modalClose          [bool]              (true)                Should the popup close on click on overlay? Version 0.4.0
// modalColor          [string]            ('#000')              What color should the overlay be? Version 0.3.5
// opacity             [float]             (0.7)                 Transparency, from 0.1 to 1.0 (filled). Version 0.3.3
// position            [int,int]           (['auto','auto'])     Defines the position where the popup should pop up. 'auto' = center, [horizontal, vertical]  Version 0.5.0. Changed in version 0.7.0, swapped positions so it's now x, y instead of y, x
// positionStyle       [string]            ('absolute')          The popup's position. 'absolute' or 'fixed'  Version 0.7.0
// scrollBar           [bool]              (true)                Should scrollbar be visible?
// speed               [int/string]        (250)                 Animation speed on open/close. Version 0.9.0
// transition          [string]            ('fadeIn')            The transition of the popup when it opens. Types: ['fadeIn', 'slideDown', 'slideIn']. Version 0.9.0
// zIndex              [int]               (9999)                Popup z-index, modal overlay = popup z-index - 1.


;(function ( $, window, document, undefined ) {

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = "gravel2",

        defaults = {
            amsl              : 50,
            appendTo          : 'body',
            appending         : true,
            closeClass        : 'gravel-close',
            content           : 'ajax', // 'ajax', 'iframe', 'xlink', 'image'
            contentContainer  : false,
            easing            : 'swing', //'swing', 'linear',
            escClose          : true,
            follow            : [true,true],
            followEasing      : 'swing', //'swing', 'linear'
            followSpeed       : 500,
            loadData          : false,
            loadUrl           : false,
            modal             : true,
            modalClose        : true,
            modalColor        : '#FFF',
            opacity           : 0.7,
            position          : ['auto','auto'], //'auto' = center, ['horizontal', 'vertical'] 
            positionStyle     : 'absolute',
            scrollBar         : true,
            speed             : 250,
            transition        : 'fadeIn', //['fadeIn', 'slideDown', 'slideIn']
            zIndex            : 9999,
            
            onLoad            : function(){
                console.log("Default on load called")
            }, // Event fires after the popup has loaded.Usage

            loadCallback      : function(){
                console.log("Default loadCallback called")
            }, //Callback for loadUrl, triggers when the loadUrl is loaded
            onOpen            : function(){
                console.log("Default onOpen called")
            }, //Event fires before the popup opens.Usage
            onClose           : function(){
                console.log("Default onClose called")
            }, // Event fires after the popup closes.Usage
            
            buttonClass: '', // Custom button class
            titleClass: '',
            bodyClass: '',
            title: null,
            bodyHtml: null,
            buttons: [],

        };

    // The actual plugin constructor
    function Gravel2( element, options ) {
        this.element = element;

        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.options = $.extend({}, defaults, options);
        
        this._defaults = defaults;
        this._name = pluginName;

        return this.init.apply(this, arguments);
    }

    Gravel2.prototype = {
        /*
        $('#selector').gravel2()               
        $('#selector').gravel2(title)
        $('#selector').gravel2(title, body)
        $('#selector').gravel2(title, body, button)  
        $('#selector').gravel2(title, buttons)  
        $('#selector').gravel2(buttons)        
        */
        init: function() {
            var element = arg(arguments, 0, null),
                title   = arg(arguments, 1, null),
                body    = arg(arguments, 2, null),
                buttons = arg(arguments, 3, null);
            var self = this;

            if(typeof(title) == 'object' && title != null) {
                buttons = title.buttons;
                body = title.body;
                self.__conf = title;
                title = title.title;
            }

            // Arg swapping
            
            // No wrapped jquery or title.
            // $('').gravel2()
            if((!element) && (!title)) return false;

            // $('#selector').gravel2(title, buttons)
            if($.isArray(body) && (!buttons)) {
                buttons = body; 
                body = null;
            }

        
            // $('#selector').gravel2(buttons)
            if($.isArray(title) && (!body) && (!buttons)) {
                buttons = title;
                title = body = null;
            }

            var _html = this.htmlTemplate(title, body, buttons)
            var callback = (function(){
                return function(){
                    self.options.onLoad();
                }
            })()

            this.htmlElement = this.firstRender(_html, callback);
            return this
        },

        element: function(){
            return this.htmlElement;

        },

        close: function(){
            this.close();
        },

        open: function(){
            /* If previously closed and still exists, show()
                else redraw() */

        },
        firstRender: function(_html,callback){
            this.__cache = $(_html);
            var self = this;
            this.__cache.addClass('gravel2').bPopup(this.options, (function(){
                self.activateButtons('#' + self.__buttonident);
                return callback
            }) );
            this.__cache.data(pluginName, this);
            
            return this.__cache
        },

        getTitle: function(){
            /*
            Traverse fallthough list until a correct title is applied
            Fall through list:

            1. options.text     Passed at config
            2. passed argument  Passed at method call
            3. h2.title         Collected from element
            4. h2               Collected from element
            5. default          Built in default 'Title'
            */
           
            var title  = this.options.text || arg(arguments, 0, 'Title');

            // Title Fallthrough
            var h2s = $(this.element).children('h2');
            $(this.element).find('h2').length;
            $titles = h2s;

            // Check to ensure h2.title is unused
            if( h2s.length > 1 ) {
                var h2ts = $(this.element).find('h2.title');
                if(h2ts.length >= 1) {
                    // .titles are thr h2's
                    $titles = h2ts;
                }
            }

            if( $titles.length >= 1) {
                title = ( $($titles[0]).html().length > 0)? $($titles[0]).html(): title;
                // $($titles[0]).hide();
            }
 
            return title;
        },

        htmlClose: function() {
            return '<div class="gravel-close">&#215;</div>';

        },

        htmlTitle: function(text){
            /*
            Return the HTML for the title object
             */
            return '<h2 class="gravel-title %(titleClass)s">' + text + '</h2>';
        },

        htmlBody: function(html) {
            /*
            Return the HTML body
             */
            return '<div class="gravel-body %(bodyClass)s">' + html + '</div>'
        },

        htmlButtons: function(buttonsArray){
            /*
            return html for the button container.
            
             */
            var rbs = [],
                __cache = [],
                rendered,
                button;

            for (var i = 0; i < buttonsArray.length; i++) {
                button = buttonsArray[i];
                rendered = this.renderButton(button);
                
                __cache.push(button);
                if(rendered.type == 'GravelButton') {
                    rbs.push(rendered.html());
                } else {
                    rbs.push(rendered);
                }

            };
            this.__buttonCache = __cache
            var buttons = rbs.join('')
            return '<div class="gravel-buttons">' + buttons + '</div>'
             
        },

        activateButtons: function(parent){
            /*
            Perforn an activation method for the GravelButtons
             */
            if(this.__buttonCache)
            for (var i = 0; i < this.__buttonCache.length; i++) {
                if( this.__buttonCache[i].hasOwnProperty('render') ) {
                    this.__buttonCache[i].render(parent)
                }
            };
        },


        htmlTemplate: function(){
            /* return the HTML template  used for the gravel popup */
            var title  = this.getTitle( arg(arguments, 0, 'oh Hai!') );

            
            var body    =  this.options.bodyHtml || arg(arguments, 1, $(this.element).html());
            var buttons = (this.options.buttons.length > 0)? this.options.buttons: arg(arguments, 2, ['close']);

            var gClass = pluginName;

            var closeHtml = this.htmlClose();
            var titleHtml = this.htmlTitle(title);
            var bodyHtml = this.htmlBody(body);
            this.__buttonident = Math.random().toString(32).slice(2);
            var buttonHtml = '<div id="' + this.__buttonident + '"></div>'



            var _html = '<div class=' + gClass + '>'
                + closeHtml + titleHtml + bodyHtml + buttonHtml
                + '</div>'

            var _rendered = this.renderHtml(_html, this.options);
            return _rendered;

        },

        renderHtml: function(html, options) {
            /*
            render the given template HTML using sprintf with the supplied options.
            Returned is standard HTML string to add to the interface.
            */
            return sprintf(html, options)
        },


        renderButton: function(value, name, color){
            /* Valid values:
            string -  used as 'value'
            GravelButton
            object - with options required for GravelButton
            DOM Element | $(element) - jquery element to be used
            */
            var button;

            if(typeof(value) == 'string') {
                button = new GravelButton({
                    value: value,
                    name: name,
                    color: color,
                    click: function() {
                        debugger;
                        console.log("Button clicked")
                    }
                })
            } else {
                if(value.type == 'GravelButton') {
                    button = value;
                } else if(typeof(value) == 'object' && value.hasOwnProperty('value') ){
                    button = new GravelButton(value)
                } else {
                    var _value = value || 'button';
                    var _id = Math.random().toString(32).slice(2);
                    var _name = name || 'name';
                    var _color = color || 'green';
                    var _html = '<input id="' + _id + '" type="button" data-color="' + _color + '" class="gravel-button %(buttonClass)s" name="' + _name + '" value="' + _value + '">'
                }
            }

            if(button) {
                _html = button;
            }
            return _html;

        },
    };


    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new Gravel2( this, options ));
            } else {
                var d = $.data(this, pluginName);
                if(!options) options = {}
                options.__data = d;
                $.data(this, pluginName, new Gravel2( this, options ));
            }
        });
    };

})( jQuery, window, document );

/*
Setting up a button can be done like:

// Just the text.
GravelButton('okay')

// text, color
GravelButton('okay', 'green')
GravelButton('cancel', '#808080')

// text, callback
GravelButton('okay', onClick)

// text, color, callback
GravelButton('okay', 'green', onClick)


GravelButton({
    value: 'okay',
    label: 'Button Text', // optional - Default 'value'
    color: '#FFEEDD',
    click: function(){}   
})


 */
var GravelButton = function(){


    var __val, // Default values and setup
        label,
        Color           = net.brehaut.Color,
        defaultValue    = 'Okay',
        defaultId       = Math.random().toString(32).slice(2),
        defaultColor    = 'green',
        defaultCall     = function(){},
        defaultPosition = 'left';

    // User passed values
    var value    = arg(arguments, 0, defaultValue),     // GravelButton('okay')
        color    = arg(arguments, 1, null),             // GravelButton('cancel', '#808080')
        callback = arg(arguments, 2, null),             // GravelButton('okay', 'green', onClick)
        position = arg(arguments, 3, defaultPosition),  // GravelButton('okay', 'green', onClick, 'left')
        _id      = arg(arguments, 4, defaultId);        // GravelButton('okay', 'green', onClick, 'left', randomId)


    // Has the user passed an object instead of arguments
    if(typeof(value) == 'object') {
        __val    = value;
        value    = value.value    || defaultValue;
        color    = value.color    || defaultColor;
        callback = value.click    || defaultCall;
        label    = value.label    || value;
        position = value.position || position;
        _id      = value.id       || _id;
    }

    // If a specific label has not been passed, used the give value
    if(!label) label = value;

    // GravelButton('okay', onClick)
    if(typeof(color) == 'function') {
        callback = color;
        color = 'green' // default color.
    }

    if(!callback) {
        // auto mapping the close method.
        if(value == 'close') {
            // Gravel scope
            callback = function(){
                this.close();
            }
        } else {
            // does nothing :)
            callback = function(){
                return false;
            }
        }
    }

    if(!color) {
        color = defaultColor
    }

    // Scope used by the button.
    var pluginScope = {
        value:    value,
        color:    color,
        label:    label,
        callback: callback,
        position: position,
        _Color:   Color,
        _id:      _id
    }

    var scope = (function(){
        var Color   = net.brehaut.Color,
            context = this;

        var hook = {
            type: 'GravelButton',
            context: context,

            text: function(){
                // get + set the text
                // Change the text on the button
                /*
                >>> b = GravelButton('ted')
                >>> b.text() // ted
                >>> 'ted'
                >>> b.text('bill')
                >>> b.text()
                >>> 'bill'
                >>> b.text(null)
                >>> b.text()
                >>> null
                 */
                var val = arg(arguments, 0, undefined);

                if(val === undefined) {
                    // calc color.
                    return this._label || this.context.label;
                }

                this._label = val;
                return this;
            },
            getId: function(){
                return this.context._id;
            },
            buttonColor: function(){
                // get, set the color of the buttons.
                // Text color (.dark or .light) and border color will be automatically
                // altered to compensate.
                // Pass 'false' as a second argument to not do the updates.
                // You can alter backgroundColor() and borderColor()
                // seperately.
                var val = arg(arguments, 0, undefined);

                if(val === undefined) {
                    // calc color.
                    return this.backgroundColor()
                }

                this.backgroundColor(val);

                var Color = this.context._Color;
                var _bc = this.calculateBorderColor(val)

                if(!this._borderColor) {
                    this.borderColor(_bc);
                }

                this.textColor( (this._textColor || null) )
                //Determine borderColor based upon the new backgroundColor;
                

            },

            calculateBorderColor: function(){
                var val = arg(arguments, 0, this.backgroundColor());
                return Color(val).darkenByAmount(.2).toString();
            },

            borderColor: function(){
                // change the borderColor to the user defined.
                // Passing 'null' will reset the button to auto set the border
                // color
                /*
                >>> s=GravelButton('bob')
                >>> // Change the background only
                >>> s.backgroundColor('red')

                >>> // check they are the same before change
                >>> (s.backgroundColor() == s.borderColor())

                >>> // Change the border only
                >>> s.borderColor('blue')

                >>> (s.borderColor() != s.backgroundColor() )
                >>> s.borderColor(null)
                >>> (s.borderColor() == s.backgroundColor() )
                 */
                var val = arg(arguments, 0, undefined);

                if(val === undefined) {

                    return this._borderColor || this.calculateBorderColor( this.backgroundColor() );
                }

                this._borderColor = val;

                // visual elements exist, apply live.
                if(this.element) {
                    // save into the data attribute
                    this.element.data('bordercolor', val);
                    // Change text color
                    this.element.css('border-color', val)
                }


                return this;
            },
            backgroundColor: function(){
                // Change the background color of the button without affecting
                // text color or border color.
                /*
                >>> b = GravelButton('ted')
                >>> b.backgroundColor() // ted
                >>> 'green'
                >>> b.backgroundColor('red')
                >>> b.backgroundColor()
                >>> 'red'
                >>> b.backgroundColor(null)
                >>> b.backgroundColor()
                >>> 'green'
                */
                var val = arg(arguments, 0, undefined);

                if(val === undefined) {
                    return this._backgroundColor || this.context.color;
                }
                
                this._backgroundColor = val;

                // visual elements exist, apply live.
                if(this.element) {
                    // save into the data attribute
                    this.element.data('color', val);
                    // Change text color
                    this.element.css('background-color', val)
                }

                return this;
            },
            textColor: function(){
                // Change the color of the text. Set 'null' for the
                // button to do this automatically based on the backgroundColor state
                // set 'false' to remove this feature; to be handled by CSS
                // styles alone.
                var val = arg(arguments, 0, undefined);
                var cl = this.getTextColorClass();
                var clc = ( (cl=='dark')? 'black': 'white' );
                
                // Nothing passed, return current color
                if(val === undefined) return this._textColor || clc;

                // Reset - apply calculated value instead.
                // if(val == null) val = clc; 

                this._textColor = val;

                // visual elements exist, apply live.
                if(this.element) {
                    // save into the data attribute
                    this.element.data('textcolor', clc);
                    // Change text color
                    this.element.css('color', clc)
                }

                return this;
            },
            click: function() {
                /*
                Provide a new click function by passing a new click method
                this.click(function(){}) // return this
                this.click(e, ... )      // calls event
                this.click()            // return click function
                 */
                
                var val = arg(arguments, 0, undefined);

                if(val === undefined) {
                    // nothing passed
                    return this._click = this.context.callback;
                } else if(val.type == 'click'){
                    // new click handler
                    var callFunc = this._click || this.context.callback;
                    callFunc.apply(this, arguments);
                }

                this._click = val;
                
                return this;
            },
            position: function(){
                /*
                The position is applied via css attribute 'left' or 'right'.
                By default this is left.
                */
               
                var val = arg(arguments, 0, undefined)
                if(val === undefined) {
                    // calc color. 
                    return this._position || this.context.position
                }

                this._position = val;
                return this;
            },
            html: function(){
                /*
                Return dom ready HTML
                 */
                 var _col = this.backgroundColor(),
                    _tc  = this.textColor(),
                    _bc  = this.borderColor(),
                    _tx  = this.text(),
                    _pos = this.position(),
                    _con = this.getTextColorClass()


                var s = '<input id="' + this.getId() + '" '
                    + 'data-color="' + _col + '" ' 
                    + 'data-borderColor="' + _bc + '" ' 
                    + 'data-textColor="' + _tc + '" ' 
                    + 'name="gravel2_'  + this.context.value + '" '
                    + 'value="' + _tx + '" '
                    + 'class="gravel-button ' + _pos + ' ' + _con + '" '
                    + 'type="button" >';
            
                return s;
            },
            render: function(parent) {
                /*
                Add this element to the passed parent, apply active styles
                and click handler
                 */
                var $html = $(this.html());
                // add to parent

                // border color
                $html.css('border-color', $html.data('bordercolor'))
                $html.css('background-color', $html.data('color'))
                $html.css('color', $html.data('textcolor'))

                // click handler
                var self = this;
                $html.on('click', function(e){
                    // call internal function
                    self.click(e)
                })
                
                this.element = $html.appendTo(parent);

            },
            getContrastYIQ: function(r,g,b){

                var a = arguments;
                var yiq = ((r*299)+(g*587)+(b*114)) / 1000;
                return (yiq >= .5) ? 'dark' : 'light';
            },


            // Correct color button text.
            getTextColorClass: function(){
                // return 'dark', 'light' responding the current background color
                var _color = this.context._Color( 
                        arg(arguments, 0, this.backgroundColor() ) 
                    );
                return this.getContrastYIQ(_color.red, _color.green, _color.blue);
            },



        };
        return hook;
    }).apply(pluginScope)

    return scope;
}
