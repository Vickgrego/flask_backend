var step2_act3_text = `Now go straight to the step 3. How? Click Menu and select Step 3. Just use what you have learned so far`

function addItemToList() {
    var div_text = document.getElementById("act2");
    var text_color = window.getComputedStyle(div_text).getPropertyValue("color");
    color_white = "rgb(255, 255, 255)"

    if(text_color == color_white){
        var list = document.getElementById("itemlist_step2");
        var li = document.createElement("li");
        li.appendChild(document.createTextNode("I The Phantom Menace"));
        list.appendChild(li);

        var act3 = document.getElementById("Instruction3");
        act3.appendChild(document.createTextNode(step2_act3_text));
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
            //todo
     });
}