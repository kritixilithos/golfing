function post(x) {
    document.getElementById('input').value = x;
    document.getElementById("sayit-button").click()
}
var last_message = "";
var commands = {};
var messages=[];
var messageIds=[];
var learning = false;
var user = "FEED";
var learnWord = "";
var dictionary = ["i","he","she","they","you","we","is","am","are","happy","bot","sad","angry","amazing","what","bot","food","computer","apple","windows","a","an","the","too","very","how","who","why","oh","yes","no","hi","hello",,"when","where","red","green","blue"];
var questions =  ["what","how","who","why","when","where"];
var pronouns =   ["i","he","she","they","you","we"];
var verbs =      ["is","am","are"];
var proadjs=     ["too","very","quite"];
var adjs  =      ["happy","bot","sad","angry","amazing","red","green","blue"];
var nouns=       ["bot","food","computer","apple","windows"];
var articles=    ["a","an","the"];
var expressions= ["oh","yes","no","hi","hello"];
var conjunctions=["and","but","because"];

post("Restarted");

var a = [].slice.call(document.getElementsByClassName("content")).slice(-1)[0].textContent;
//if (a === last_message) return;
last_message = a;
messages.push(last_message);
messageIds.push([].slice.call(document.getElementsByClassName("message")).slice(-1)[0].id.match(/\d+/).slice(-1)[0]);
console.log(messageIds[0]);

function AI(messageOriginal) {
  message = messageOriginal.toLowerCase();
  message=message.replace(/[\\"\$\,\.]/g,"");
  var words = message.split(" ");
  var testWord = words[0].toLowerCase();
  if(/^[@\:]/.test(words[0])) testWord = words[1].toLowerCase();
  if(learning) { //learning
    var r = new RegExp("@Sock.*"+learnWord+" is (an? )?"+"([a-z]+) ?","i");
    if(r.test(message) && /Kritixi/.test(user)) {
      testWord = r.exec(message)[2];
      dictionary.push(learnWord);
      switch(testWord) {
        case "pronoun":
          pronouns.push(learnWord);
          break;
        case "conjunction":
          conjunctions.push(learnWord);
          break;
        case "question":
          questions.push(learnWord);
          break;
        case "verb":
          verbs.push(learnWord);
          break;
        case "adj":
          adjs.push(learnWord);
          break;
        case "noun":
          nouns.push(learnWord);
          break;
        case "article":
          articles.push(learnWord);
          break;
        case "expression":
          expressions.push(learnWord);
          break;
        case "proadj":
          proadjs.push(learnWord);
          break;
        default:
          //nouns.push(learnWord);
      }
      learning = false;
      return "Learned: "+learnWord+" is a "+testWord;
    }else{
      return "I still don't know what " + learnWord + " is";
    }
  }
  if (!dictionary.includes(testWord)&&testWord.length>=1&&!/\d/.test(testWord)) {
    learning = true;
    learnWord = testWord.toLowerCase();
    return "What is a " + testWord + "?";
  }else {
    if (/what is (.*)/i.test(message)) {
      return evaluate(message.match(/what is (.*)/i)[1].toLowerCase());
    }else{//random sentence generator
      var r = Math.random();
      var selectedPronoun=pronouns[parseInt(Math.random()*pronouns.length)];
      var selectedVerb = "";
      switch(selectedPronoun) {
        case "i":
          selectedVerb = "am";
          break;
        case "you":
          selectedVerb = "are";
          break;
        case "we":
          selectedVerb = "are";
          break;
        case "they":
          selectedVerb = "are";
          break;
        case "he":
          selectedVerb = "is";
          break;
        case "she":
          selectedVerb = "is";
          break;
        default:
          selectedVerb = verbs[parseInt(Math.random()*verbs.length)];
      }
      var stem = expressions[parseInt(Math.random()*expressions.length)]+", "+selectedPronoun+" "+selectedVerb+" ";
      if(r<0.5) {
        return stem+proadjs[parseInt(Math.random()*proadjs.length)]+" "+adjs[parseInt(Math.random()*adjs.length)];
      }else{
        return stem+articles[parseInt(Math.random()*articles.length)]+" "+nouns[parseInt(Math.random()*nouns.length)];
      }
    }
  }
}
//What is ...
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
    user = username;
    if (!/Kritixi/.test(username) && learning) return;

    var x=":"+message_id+" "+AI(last_message);
    setTimeout(function(yup){post(x);},500,x);
}

setInterval(f, 500);

function end() {
localStorage.dictionary=dictionary;
localStorage.verbs=verbs;
localStorage.adjs=adjs;
window.location.reload(false);
}
