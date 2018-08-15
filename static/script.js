var step2_act3_text = `As you\'ve seen, when \"Break on\" is enabled the JavaScript code stopped on button click,
                        you\'ve been redirected to "Sources" tab and shown a code causing an issue. Keep it im mind,
                        you would need it in the next step.`
var step2_act3_text2 = `This is valuable when you want to find a bug after some event,
                        as creating new element, clicking button etc.`
var step2_act3_text3 = `Now go straight to the step 3. How? Click Menu on the nav bar and select Step 3.
                        LOL, can\'t do it? Ok, hint: it\'s :hover event, so just use what you have learned so far.`

function addItemToList() {
    var div_text = document.getElementById("act2");
    var text_color = window.getComputedStyle(div_text).getPropertyValue("color");
    color_white = "rgb(255, 255, 255)"

    if(text_color == color_white){
        var list = document.getElementById("itemlist_step2");
        var li = document.createElement("li");
        li.appendChild(document.createTextNode("I) The Phantom Menace"));
        li.classList.add("list-group-item");
        list.appendChild(li);

        var act3 = document.getElementById("Instruction3");
        var p1 = document.createElement("p");
        var p2 = document.createElement("p");
        var p3 = document.createElement("p");
        p1.appendChild(document.createTextNode(step2_act3_text));
        p2.appendChild(document.createTextNode(step2_act3_text2));
        p3.appendChild(document.createTextNode(step2_act3_text3));
        act3.appendChild(p1);
        act3.appendChild(p2);
        act3.appendChild(p3);
    } else {
        console.log("not focused");
    }
}

function causeException() {
    // this is bad code
    throw new Error("I am bad button");
}

function getJson() {
    $.getJSON('/getjson', (data)=>{
        //do nothing
     });
}

$( document ).ready(()=>{
    try {
        if (/Android|Mobi|<Android/i.test(navigator.userAgent)){
            var andrHolder = document.getElementById("android_holder");
            var p = document.createElement("p");
            p.classList.add("dark_code");
            p.appendChild(document.createTextNode("You see it only with Android user agent. The dark code is 'sith'"));
            andrHolder.appendChild(p);
            console.log("android");
        } else {
            console.log("no android");
        }
    } catch (error) {
        console.log(error);
    }
});

function test() {
    var target = document.getElementById("performance_issue");
    var start = 99;
    for(var i=Math.pow(start, 4); i>=2; i--){
        start += Math.atan(start);
    }
    var p = document.createElement("p");
    p.appendChild(document.createTextNode("result is " + start +  "\n"));
    target.appendChild(p);
    start = 99;
}

function heavyLoad(){
    test();
    setInterval(test(), 5500)
}


