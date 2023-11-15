/*

KeyDown -> processa_tasto(*)

processa_tasto
se è una cifra -> inserisci_cifra
se è operatore -> processa operatore


*/
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
    //cell.innerHTML = Number(stack[i].toFixed(6));
    cell.innerHTML = stack[i].toLocaleString();
    if (decimal_point==1 && i==stack.length-1) {
      cell.innerHTML += ','
    }
  }
}


let operatori = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  '+', '-', '*', '/', '.',
  'Enter',
  'Backspace', // cancella cifra in fase di edit o ultimo elem stack
  'Delete', // cancella tutto lo stack
  'P', // Pi
  'ArrowLeft', 'ArrowRight', // inverti gli ultimi due elementi dello stack
  'o', 'i', // opposto e inverso
  '^', // elevazione a potenza Y^X
  'ArrowUp', 'ArrowDown', // scorrimento stack
  's', // somma tutti gli elementi dello stack
  'h', // visualizza finestra di help
  'l', // lastx
  ':', // enter command
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
        lastx = b;
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
        lastx = b;
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
        lastx = b;
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
        lastx = b;
        edit_mode = false;
        enter_pressed = false;
        break;    
      case 'Backspace':
        /* se sono in fase di inserimento, elimino l'ultima cifra */
        if (edit_mode && stack[stack.length-1]!=0.){
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
          lastx = stack.pop();
          if (!stack.length){
            stack.push(0.);
          }
          edit_mode = false;
          enter_pressed = false;
        }
        break;
      case 'Delete':
        /* svuoto lo stack */
        while (stack.length){
          lastx = stack.pop();
        }
        stack.push(0.);
        enter_pressed = true;
        break;
      case 'P':
        /* pi greco */
        if (enter_pressed){
          stack.pop();
          enter_pressed = false;
        }
        stack.push(Math.PI);
        edit_mode = false;
        break;
      case 'ArrowLeft':
      case 'ArrowRight':
        /* XY swap */
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
      case 'o':
        /* opposto +/- */
        stack.push(-stack.pop())
        enter_pressed = false;
        edit_mode = false;
        break;
      case 'i':
        /* inverso "1/X" */
        b = stack.pop()
        if (b == 0){
          console.log('DIV 0 ERROR');
          edit_mode = false;
          enter_pressed = false;
          break;
        }
        stack.push(1/b);
        edit_mode = false;
        enter_pressed = false;
        break;
      case '^':
        /* elevazione a potenza Y^X*/
        x = stack.pop();
        stack.push(stack.pop()**x);
        lastx = x;
        edit_mode = false;
        enter_pressed = false;
        break;
      case 'ArrowDown':
        /* scorrimento stack */
        a = stack.pop();
        stack.unshift(a);
        edit_mode = false;
        enter_pressed = false;
        break;
      case 'ArrowUp':
        /* scorrimento stack */
        a = stack.shift(a);
        stack.push(a)
        edit_mode = false;
        enter_pressed = false;
        break; 
      case 's':
        /* sommatoria */
        lastx = stack.pop();
        a = lastx;
        while (stack.length) { a += stack.pop() };
        stack.push(a);
        edit_mode = false;
        enter_pressed = false;
        break;
      case 'l':
        /* last x */
        stack.push(lastx);
        edit_mode = false;
        enter_pressed = false;
        break;
      case ':':
        comando_input = true;
        box = document.getElementById("cmd");
        box.classList.add("showme");
        box.focus();
        break;
      default:
        console.log(tasto, ' *not processed*')      
    }
    if (tasto!='Backspace' & tasto!='.'){
      // per tutti i tasti che non siano Backspace e . devo resettare il punto decimale
      // altrimenti mi inserisce numeri dopo la virgola.
      decimal_point = 0;
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

function comando(){
  var box = document.getElementById("cmd");
  let cmd = box.value
  if (cmd.startsWith(':')){
    cmd = cmd.substring(1)
  }
  // inserire azioni corrispondenti ai comandi
  switch (cmd){
    case 'exp':
      lastx = stack.pop()
      stack.push(Math.exp(lastx))
      clear_command();
      break;
    case 'help':
      show_help();
    default:
      box.value = 'command '+cmd+' not found!';
      setTimeout(function(){ 
        clear_command(); 
        }, 1000);
    }
}


function clear_command(){
  box.value = ''
  comando_input = false;
  box.classList.remove("showme");
  enter_pressed = false;
  stack_print();
}


// Prevenire il refresh al submit del form
var form=document.getElementById("cmdForm");
function submitForm(event){

   //Preventing page refresh
   event.preventDefault();
}

//Calling a function during form submission.
form.addEventListener('submit', submitForm);

/*** main code ***/
let stack = [0.0, ];
let edit_mode = false;
let enter_pressed = true;
let decimal_point = 0;
let comando_input = false;
let lastx = 0;

stack_print();
window.addEventListener('keydown', function (event){
  console.log(event.key);
  if (operatori.includes(event.key) & !comando_input){
    processa_tasto(event.key)}
  }
  );

