$(document).ready(function(){

    $('.run-example').on('click', function(){
        examples[$(this).data('hook')]();
    })
})

examples = {
    basicExample: function(){
        $('#basic-example').gravel2();
    },
    titleExample: function(){
        $('#title-example').gravel2('Custom Title');  
    },
    autoTitleExample: function(){
        $('#auto-title-example').gravel2();  
    },
    manyTitleExample: function(){
        $('#many-title-example').gravel2();  
    },
}