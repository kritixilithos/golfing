function post(x) {
    document.getElementById('input').value = x;
    document.getElementById("sayit-button").click()
}
var last_message = "";
var commands = {};
var messages=[];
var messageIds=[];
var learning = false;
var learnWord = "";
var dictionary = ["i","he","she","they","you","we","is","am","are","happy","bot","sad","angry","amazing","what","bot","food","computer","apple","windows","a","an","the",,"how","who","why"];
var nouns =      ["i","he","she","they","you","we","what","how","who","why"];
var verbs =      ["is","am","are"];
var adjs  =      ["happy","bot","sad","angry","amazing"];
var adjNouns=    ["bot","food","computer","apple","windows"];
var helpNouns=   ["a","an","the"];

post("Restarted");

var a = [].slice.call(document.getElementsByClassName("content")).slice(-1)[0].textContent;
//if (a === last_message) return;
last_message = a;
messages.push(last_message);
messageIds.push([].slice.call(document.getElementsByClassName("message")).slice(-1)[0].id.match(/\d+/).slice(-1)[0]);
console.log(messageIds[0]);

function AI(messageOriginal) {
  message = messageOriginal.toLowerCase();
  message=message.replace(/[\\"\$]/g,"");
  var words = message.split(" ");
  var testWord = words[0].toLowerCase();
  if(/^[@\:]/.test(words[0])) testWord = words[1].toLowerCase();
  if(learning) {
    var r = new RegExp("@Sock.*"+learnWord+" is "+"([a-z]+) ?","i");
    if(r.test(message)) {
      testWord = r.exec(message)[1];
      dictionary.push(learnWord);
      switch(testWord) {
        case "noun":
          nouns.push(learnWord);
          break;
        case "verb":
          verbs.push(learnWord);
          break;
        case "adj":
          adjs.push(learnWord);
          break;
        case "adjnoun":
          adjNouns.push(learnWord);
          break;
        case "helpnoun":
          helpNouns.push(learnWord);
          break;
        default:
          nouns.push(learnWord);
      }
      learning = false;
      return "Learned: "+learnWord+" is a "+testWord;
    }else{
      return "I still don't know what " + learnWord + " is";
    }
  }
  if (!dictionary.includes(testWord)) {
    learning = true;
    learnWord = testWord.toLowerCase();
    return "What is a " + testWord + "?";
  }else {
    if (/what is (.*)/i.test(message)) {
      return evaluate(message.match(/what is (.*)/i)[1].toLowerCase());
    }else{
      var r = Math.random();
      var stem = nouns[parseInt(Math.random()*nouns.length)]+" "+verbs[parseInt(Math.random()*verbs.length)]+" ";
      if(r<0.5) {
        return stem+adjs[parseInt(Math.random()*adjs.length)];
      }else{
        return stem+helpNouns[parseInt(Math.random()*helpNouns.length)]+" "+adjNouns[parseInt(Math.random()*adjNouns.length)];
      }
    }
  }
}

function evaluate(evalStuff) {
  if(/[a-z]/g.test(evalStuff))
    return "Nope, not evaluating that :)";
  else
    return eval(evalStuff);
}

function f() {
    var currIndex = messages.length-1;
    for (var i of document.getElementsByClassName("pending"))
        for (var j of i.children)
            for (var k of j.children)
                if (k.innerHTML === "retry") k.click();

    var e = [].slice.call(document.getElementsByClassName("message")).slice(-1)[0];
    //console.log(e.children);
    /*
    var recent_messages = [];
    var recent_ids      = [];
    for(var elem of [].slice.call(document.getElementsByClassName("content")).slice(-5)) {
      recent_messages.push(elem.textContent);
    }
    for(var elem of [].slice.call(document.getElementsByClassName("message")).slice(-5)) {
      recent_ids.push(elem.id.match(/\d+/).slice(-1)[0]);
    }
    if(messageIds.indexOf(recent_ids[0])!==-1) {
      var firstIndex = messageIds.indexOf(recent_ids[0]) - recent_ids.length;
      if(firstIndex!==1) {
        currIndex++;
        for(var i = firstIndex; i < recent_ids.length;i ++) {
          messageIds.push(recent_ids[i]);
          messageIds.push(recent_messages[i]);
        }
      }else{return;}
    }else{
      for(var elem of recent_ids) {
        messageIds.push(elem);
      }
      for(var elem of recent_messages) {
        messages.push(elem);
      }
    }
    */
    var a = [].slice.call(document.getElementsByClassName("content")).slice(-1)[0].textContent;
    if (a === last_message) return;
    last_message = a;
    messages.push(last_message);

    var username = "Feeds";
    for (var i of document.getElementsByClassName("username")) username = i.innerHTML;
    var message_id = e.id.match(/\d+/).slice(-1)[0];
    //message_id = messageIds[currIndex];
    //last_message=messages[currIndex];
    console.log(last_message);
    console.log(a);
    //if (/@(?!Kritixi)/i.test(a)) return;
    if (/Sock/i.test(username)) {console.log("Kritixi posted that stop!"); return;}
    //if (a.test(/http/) return;

    var x=":"+message_id+" "+AI(last_message);
    setTimeout(function(yup){post(x);},500,x);
}

setInterval(f, 500);
