# Gravel2.

jQuery popups for modern use.

This is in beta phase. Hence the untidy integration and public API

## What does it do?

Make a popup by wrapping an element with `jquery.gravel2()` the information will be presented in a clean, responsive popup. Thanks to some of the frameworks gravel2 is built upon, gravel2 has the following features:

+ **Super response** will center itself with a lovely animation
+ **background fog** to apply focus to the new popup. Clickable for popup dismissal.
+ **Integrated close** automatically handling popups
+ **buttons** with a simple API to write actions
+ **button auto colouring** for correct text contrast on any colour button

## How does it work.

Implement the libraries.

    <script src="/js/gravel2/color.js"></script>
    <script src="/js/gravel2/jquery.bpopup.js"></script>
    <script src="/js/gravel2/sprintf.js"></script>
    <script src="/js/gravel2/gravel2.js"></script>
    <link rel="stylesheet" href="/js//gravel2/gravel2.css">

I know it's a few - I intend to implement a live loader.

### Quick guide

Wrap an existing element and gravel it. This element contains pretty much anything. text for example.

    $('#basic-example').gravel2();

Without an existing element:

    g= $('<div/>', {
        html: 'An error took place whilst talking to the server.'
    }).gravel2('New popup');


Give your popup a title

    $('#title-example').gravel2('Custom Title');

Give your popup a title based upon the wrapped content:

    $('#auto-title-example').gravel2();

proving HTML:
    
    <div id="auto-title-example">
        <div class="h2">Auto title</div>
        <p>Titles can be automatic! using the most available h2 element within your jQuery wrapped element.</p>
    </div>


With a Button

g= $('<div/>', {
 html: 'An error took place whilst talking to the server.'
}).gravel2('alaps', [GravelButton('boo'), GravelButton('Argh', 'red')])