function arg(_a, ia, def, returnArray) {
    var v = null

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

        this.init.apply(this, arguments);
    }

    Gravel2.prototype = {

        init: function(title) {
            var element = arg(arguments, 0, null),
                title = arg(arguments, 1),
                body = arg(arguments, 2),
                buttons = arg(arguments, 3);
            var self = this;

            var _html = this.htmlTemplate(title, body, buttons)
            var callback = (function(){
                return function(){
                    self.options.onLoad();
                }
            })()

            this.htmlElement = $(_html).addClass('gravel2') 
                .bPopup(this.options, callback);

            $(_html).data(pluginName, this);
        },

        element: function(){
            return this.htmlElement;

        },

        bPopup: function(){
            return this.htmlElement.data('bPopup')
        },

        close: function(){
            this.close();
        },

        open: function(){
            this.optn();
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

            var titleElement = this.findUsedTitleElement()

            if( $titles.length >= 1) {
                title = ( $(titleElement).html().length > 0 )? 
                            $(titleElement).html(): 
                            title;
                // $($titles[0]).hide();
            }
 
            return title;
        },

        findUsedTitleElement: function(){
            // Title Fallthrough
            // Original code, template body
            // Falling through each to pass back the used titleElement.
            // This may not be the original html wrapped - When the 
            // popup is open, the used title is within the gravel body.
            
            // Original - jQuery wrapped html is left; a copy is used for the popup
            // Used - In the gravel body; not changed
            // Copied - for use as the gravel title. 

            debugger;
            var _element = this.htmlElement || $(this.element);

            var h2s = _element.find('.gravel-body h2');
            if(h2s.length == 0) {
                h2s = _element.find('h2');
            }

            $titles = h2s;

            // Check to ensure h2.title is unused
            if( h2s.length > 1 ) {
                var h2ts = _element.find('h2.title');
                if(h2ts.length >= 1) {
                    // .titles are thr h2's
                    $titles = h2ts;
                }
            }

            if($titles.length >= 1) {
                return this._titleElement = $titles[0];
            }
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
            var rbs = []
            for (var i = 0; i < buttonsArray.length; i++) {
                var b = buttonsArray[i]
                rbs.push(this.renderButton(b));
            };
            var buttons = rbs.join('')
            return '<div class="gravel-buttons">' + buttons + '</div>'
             
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
            var buttonHtml = this.htmlButtons(buttons);

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
            var _value = value || 'button';
            var _id = Math.random().toString(32).slice(2);
            var _name = name || 'name';
            var _color = color || 'green';
            var _html = '<input id="' + _id + '" type="button" data-color="' + _color + '" class="gravel-button %(buttonClass)s" name="' + _name + '" value="' + _value + '">'
            return _html;
        },


    };


    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "gravel_" + pluginName)) {
                $.data(this, "gravel_" + pluginName, new Gravel2( this, options ));
            } else {
                debugger;
                // refresh the content, or redisplat
                $.data(this, "gravel_" + pluginName)
            }
        });
    };

})( jQuery, window, document );