function stack_print(){
  var TableBody = document.getElementById("tableBody");
  const rows = TableBody.rows;
  if (rows) {
    while (rows.length>0) {
      TableBody.deleteRow(0)
    }
  }
  for(let i = 0; i < stack.length; i++ ){
    var row = TableBody.insertRow();
    var cell = row.insertCell();
    cell.innerHTML = Number(stack[i].toFixed(6));
  }
}


let operatori = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  '+', '-', '*', '/', '.',
  'Enter',
  'Backspace', // cancella cifra in fase di edit o ultimo elem stack
  'Delete', // cancella tutto lo stack
  'P', // Pi
  '<', // inverti gli ultimi due elementi dello stack
]

/* processa la pressione di un tasto */
function processa_tasto(tasto){
  cifra = parseFloat(tasto);
  if (!isNaN(cifra) ){
    inserisci_cifra(cifra);
  }
  else{
    switch (tasto){
      case 'Enter':
        a = stack.pop()
        stack.push(a);
        stack.push(a);
        edit_mode = false;
        decimal_point = 0;
        enter_pressed = true;
        break;
      case '.':
        if (decimal_point == 0){
          decimal_point++
        };
        break;
      case '+':
        b = stack.pop()
        a = 0.;
        if (stack.length){
          a = stack.pop();
        }
        stack.push(a + b);
        edit_mode = false;
        enter_pressed = false;
        break;
      case '-':
        b = stack.pop()
        a = 0.;
        if (stack.length){
          a = stack.pop();
        }
        stack.push(a - b);
        edit_mode = false;
        enter_pressed = false;
        break;    
      case '*':
        b = stack.pop()
        a = 0.;
        if (stack.length){
          a = stack.pop();
        }
        stack.push(a * b);
        edit_mode = false;
        enter_pressed = false;
        break;    
      case '/':
        /* implementare controllo divisione zero */
        b = stack.pop()
        if (b == 0){
          console.log('DIV 0 ERROR');
          edit_mode = false;
          enter_pressed = false;
          break;
        }
        a = 0.;
        if (stack.length){
          a = stack.pop();
        }
        stack.push(a / b);
        edit_mode = false;
        enter_pressed = false;
        break;    
      case 'Backspace':
        /* se sono in fase di inserimento, elimino l'ultima cifra */
        if (edit_mode){
          if (decimal_point==0){
            stack.push(Math.trunc(stack.pop()/10))
          }
          else { // rimuovi l'ultima cifra dopo la virgola
            decimal_point--;
            stack.push(Math.trunc(stack.pop() * 10**(decimal_point-1))/10**(decimal_point-1))
          }
        }
        else{
          /* se non sono in fase di inserimento, 
             elimino ultimo elemento dello stack */
          stack.pop();
          if (!stack.length){
            stack.push(0.);
          }
        }
        break;
      case 'Delete':
        /* svuoto lo stack */
        while (stack.length){
          stack.pop();
        }
        stack.push(0.);
        enter_pressed = true;
        break;
      case 'P':
        if (enter_pressed){
          stack.pop();
          enter_pressed = false;
        }
        stack.push(Math.PI);
        edit_mode = false;
        break;
      case '<':
        b = stack.pop()
        a = 0.
        if(stack.length){
          a = stack.pop();
        }
        stack.push(b);
        stack.push(a);
        edit_mode = false;
        enter_pressed = false;
        break;

      default:
        console.log(tasto, ' *not processed*')      
    }
  }
  stack_print();
}

function inserisci_cifra(c){
  if (!edit_mode){
    /* se ho appena premuto enter cancello il numero ed inizia
       ad inserire il nuovo */
    if (enter_pressed){
      stack.pop();
      enter_pressed = false;
    }
    stack.push(0.);
    edit_mode = true;
  }
  if (decimal_point==0){
    /* inserisci la cifra */
    stack.push(stack.pop()*10 + c);
  }
  else{
    /* se il punto decimale è attivo, inserisci la cifra sulla
    posizione del decimale */
    stack.push(stack.pop() + c * 10**-decimal_point++);
  }
}

/*** main code ***/
let stack = [0.0, ];
let edit_mode = false;
let enter_pressed = true;
let decimal_point = 0;

stack_print();
window.addEventListener('keydown', function (event){
  console.log(event.key);
  if (operatori.includes(event.key)){
    processa_tasto(event.key)}
  }
  );


/*
function rpn(expression){
  expression = expression.toLowerCase()
  if (expression === '') {
    message("Stringa vuota");
    return;
  }
  //message(expression)
  let tokens = expression.match(/\d+.\d+|.\d+|\d+|n|radq|somma|d|[\+\-\*\/\ \^]/g);
  if (!tokens){
    message("Espressione \""+expression+"\" non riconosciuta");
    return;
  }
  if (tokens.length === 0) {
    message("Espressione non riconoscuta: '"+ expression + "'")
  }
  //message(tokens);
  for (let token of tokens) {
    if (token === '' || token === ' ') continue;
    if (isNaN(token)) {
      // Operatori unari
      if (stack.length === 0) {
        message("Stack vuota!");
        return;
      };      
      switch (token) {
        case "d":
            stack.pop();
            continue;
        case "radq":
            let a = stack.pop();
            stack.push(Math.sqrt(a));
            continue;
        case "n":
          stack.push(-stack.pop());
          continue;
        case "somma":
          sommatoria();
          continue;
      };
      // Operatori binari
      if (stack.length < 2) {
        message("Stack insufficiente!");
        return;
        }
      let b = stack.pop();
      let a = stack.pop();
      switch (token) {
        case "+":
          stack.push(a + b);
          break;
        case "-":
          stack.push(a - b);
          break;
        case "*":
          stack.push(a * b);
          break;
        case "/":
          stack.push(a / b);
          break;
        case "^":
            stack.push(a ** b);
            break;
        default:
            message("Operatore '"+token+"' non riconosciuto.")
      }
    } else {
      stack.push(parseFloat(token));
    }
  }
}

function calculate() {
  let expression = document.getElementById("expression");
  rpn(expression.value);
  expression.value = "" ;
  stack_print();
}
/*
function stack_print() {
  let list = [ "c0", "c1", "c2", "c3"];
  let celle = [];
  const max_rows = 4
  for (let idc of list) { 
    celle.push( document.getElementById(idc))
  };

  mr = Math.min(stack.length, max_rows);
  for (let i = 0; i < mr; i++){
    celle[i].innerHTML = stack[i]
  }
}
*/

/*
function message(msg){
    document.getElementById("message").innerHTML = '=> ' + msg 
}

function show(kc){
  message('Keycode = '+kc)
}

function pop(){
  stack.pop()
}

function sommatoria(){
  let acc = 0;
  while (stack.length){
    acc += stack.pop();
  }
  stack.push(acc);
  stack_print();
}

function potenza(){
  if (stack.length < 2){
    message("Stack insufficiente!");
    return;
  }
  let y = stack.pop()
  let x = stack.pop()
  if (y<0 && x===0){
    message("Divisione per 0.")
    return;
  }
  stack.push(x**y);
  stack_print();
}

function inverso(){
  if (stack.length === 0){
    message("Stack vuota!");
    return;
  }
  let x = stack.pop()
  if (x===0){
    message("Divisione per 0.")
    return;
  }
  stack.push(1/x);
  stack_print();
}

function cancella_elemento(){
  if (stack.length > 0){
    stack.pop();
  }
  stack_print();
}

function cancella_stack(){
  while (stack.length){
    stack.pop()
  }
  stack_print();
}

function scambiaxy(){
  x = stack.pop()
  y = stack.pop()
  stack.push(x)
  stack.push(y)
  stack_print();
}

const keyboard = document.querySelector(".keyboard");
const output = document.getElementById("expression");

keyboard.addEventListener("click", function(event) {
  if (event.target.tagName === "BUTTON") {
    const value = event.target.textContent;
    message(value)
    switch (value) {
      case "C":
        output.value = "";
        break;
      case "=":
        try {
          calculate();
        } catch (error) {
          message("Error");
        }
        break;
        case "+":
          output.value += value;
          try {
            calculate();
          } catch (error) {
            message("Error");
          };
          //message('resetting')
          output.value = "";
          output.focus();
          break;
      default:
        output.value += value;
        output.focus()
        break;
    }
  }
});
*/