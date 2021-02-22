function form(){
    var elements = document.getElementById("myForm").elements;
    var data = {};

    for (var i=0; i<elements.length; i++){
        var item = elements.item(i);
        obj[item.name] = item.value;
    }
}