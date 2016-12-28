function post(x) {
    document.getElementById('input').value = x;
    document.getElementById("sayit-button").click()
}
var last_message = "";
var commands = {};
var messages=[];
var learning = false;
var learnWord = "";
var dictionary = ["i","he","she","they","you","we","is","am","are","happy","bot","sad","angry","amazing","what"];
var nouns = ["i","he","she","they","you","we","what"];
var verbs = ["is","am","are"];
var adjs  = ["happy","bot","sad","angry","amazing"];

post("Restarted");

function AI(messageOriginal) {
  message = messageOriginal.toLowerCase();
  message=message.replace(/[\\"\$]/g,"");
  var words = message.split(" ");
  var testWord = words[0].toLowerCase();
  if(/^[@\:]/.test(words[0])) testWord = words[1].toLowerCase();
  if(learning) {
    var r = new RegExp(learnWord+" is "+"([a-z]+) ?","i");
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
      return nouns[parseInt(Math.random()*nouns.length)]+" "+verbs[parseInt(Math.random()*verbs.length)]+" "+adjs[parseInt(Math.random()*nouns.length)];
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
    for (var i of document.getElementsByClassName("pending"))
        for (var j of i.children)
            for (var k of j.children)
                if (k.innerHTML == "retry") k.click();

    var e = [].slice.call(document.getElementsByClassName("message")).slice(-1)[0];
    console.log(e.children);
    var a = [].slice.call(document.getElementsByClassName("content")).slice(-1)[0].textContent;
    if (a == last_message) return;
    last_message = a;
    messages.push(last_message);

    var username = "Feeds";
    for (var i of document.getElementsByClassName("username")) username = i.innerHTML;
    var message_id = e.id.match(/\d+/).slice(-1)[0];

    console.log(a);
    //if (/@(?!Kritixi)/i.test(a)) return;
    if (/Sock/i.test(username)) {console.log("Kritixi posted that stop!"); return;}
    //if (a.match(/http/) && !a.match(/Kritixi/i)) return;

    var x=":"+message_id+" "+AI(last_message);
    setTimeout(function(yup){post(x);},2000,x);
}

setInterval(f, 500);
