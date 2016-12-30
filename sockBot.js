/*
 * Based off of ETHproduction's bot template: https://github.com/ETHproductions/SE-chatbot/blob/master/ETHbot.js
 */
function post(x) {
    document.getElementById('input').value = x;
    document.getElementById("sayit-button").click()
}
var last_message = "";
var commands = {};
var messages=[];
var messageIds=[];
var learning = false;
var wantsToLearn = false;
var user = "FEED";
var learnWord = "";
var dictionary = [];
var questions =  ["what","how","who","why","when","where"];
var pronouns =   ["i","he","she","they","you","we","this","that"];
var verbs =      ["is","learn","restart","eat","shut","process"];
var proadjs=     ["too","very","quite"];
var adjs  =      ["happy","sad","angry","amazing","red","green","blue","fine"];
var nouns=       ["bot","food","computer","apple","windows","ethbot","zalgo","life","earth"];
var articles=    ["a","the"];
var expressions= ["oh","yes","no","hi","hello","nice","yeah","nope","so","ok","indeed","bye"];
var conjunctions=["and","but","because"];
var emojis      =["xd",":P",":)"];
var trashs      =[];
var propernouns =[];
var grammarItems=["questions","pronouns","verbs","proadjs","adjs","nouns","articles","expressions","conjunctions","emojis","trashs","propernouns"];
for(item of grammarItems){
  load(item);
}
for(item of grammarItems){
  eval(`dictionary=dictionary.concat(${item})`);
}

post("Restarted");

var a = [].slice.call(document.getElementsByClassName("content")).slice(-1)[0].textContent;
//if (a === last_message) return;
last_message = a;
messages.push(last_message);
messageIds.push([].slice.call(document.getElementsByClassName("message")).slice(-1)[0].id.match(/\d+/).slice(-1)[0]);
console.log(messageIds[0]);

function AI(messageOriginal) {
  message = messageOriginal.toLowerCase();
  message=message.replace(/[\,\`\"\.]/g,"");
  var words = message.split(" ");
  var wordsIndex = 0;
  var testWord = words[wordsIndex].toLowerCase();
  while(/^[@\:]/.test(testWord) && wordsIndex<words.length-1) testWord = words[++wordsIndex].toLowerCase();
  if(learning) { //learning
    var r = new RegExp("@Sock.*"+learnWord+" is (an? )?"+"([a-z]+) ?","i");
    if(r.test(message) && /Kritixi/.test(user)) {
      testWord = r.exec(message)[2];
      dictionary.push(learnWord);
      eval(`${testWord}s.push("${learnWord}")`);
      learning = false;
      return "Learned: "+learnWord+" is a "+testWord;
    }else{
      return "I still don't know what " + learnWord + " is";
    }
  }
  if (!dictionary.includes(testWord)&&testWord.length>=1&&!/\d/.test(testWord) && wantsToLearn) {
    learning = true;
    learnWord = testWord.toLowerCase();
    return "What is a " + testWord + "?";
  }else{
    if (/what is (.*)\??/i.test(message)) {
      return evaluate(message.match(/what is (.*)\??/i)[1].toLowerCase());
    }else{//random sentence generator
      var r = Math.random();
      var selectedPronoun= word("pronouns");
      var selectedVerb   = word("verbs");
      var selectedAdj    = word("adjs");
      var selectedArticle= word("articles");
      var selectedNoun   = word("nouns");
      selectedAdj=selectedVerb=="is"?selectedAdj:selectedAdj.replace(/(y?)$/,q=w=>w?"ily":"ly")
      selectedArticle+=(/^[aeiou]/.test(selectedNoun)&&selectedArticle=="a"?"n":"");
      //conjugation
      if (selectedVerb == "is") {
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
        }
      }else{
        switch(selectedPronoun) {
          case "i":
            //selectedVerb = "am";
            break;
          case "you":
            //selectedVerb = "are";
            break;
          case "we":
            //selectedVerb = "are";
            break;
          case "they":
            //selectedVerb = "are";
            break;
          case "he":
            selectedVerb+=selectedVerb.endsWith("s")?"es":"s";
            break;
          case "she":
            selectedVerb+=selectedVerb.endsWith("s")?"es":"s";
            break;
          default:
            selectedVerb+=selectedVerb.endsWith("s")?"es":"s";
        }
      }
      var stem = selectedPronoun+" "+selectedVerb+" ";
      if(r<0.5) {
        stem = stem+word("proadjs")+" "+selectedAdj;
      }else{
        stem = stem+selectedArticle+" "+selectedNoun;
      }
      if(Math.random()<0.5) {
        return word("expressions") + ", " + stem;
      }else{
        return stem + " " + word("emojis").toUpperCase();
      }
    }
  }
}
//return word for grammar
function word(type) {
  return eval(`${type}[parseInt(Math.random()*${type}.length)]`);
}

//What is ...
function evaluate(evalStuff) {
  if(/[a-z]/g.test(evalStuff)) {
    if (grammarItems.includes(evalStuff)||evalStuff=="dictionary")
      return eval(evalStuff+".join(\", \")");
    else
      return "Nope, not evaluating that :)";
  }else{
    return eval(evalStuff);
  }
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


    var AIed = AI(last_message)+"";
    AIed = AIed.replace(/^(.)/,q=w=>w.toUpperCase()).replace(/ i /g," I ");
    var x=":"+message_id+" "+AIed;
    setTimeout(function(yup){post(x);},500,x);
}

setInterval(f, 500);

function end() {
  for(item of grammarItems) {
    save(item);
  }
  post("Sock is out");
  window.location.reload(false);
}

function save(item) {
  eval(`localStorage.setItem("${item}",JSON.stringify(${item}));`);
}

function load(item) {
  eval(`if(localStorage.hasOwnProperty("${item}"))${item}=JSON.parse(localStorage.getItem("${item}"));`);
}
