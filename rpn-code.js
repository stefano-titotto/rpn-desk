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
    cell.innerHTML = stampa_numero(stack[i]);
  }
}

let modalita = 0; // modalità di visualizzazione
let cifre = 4; // cifre decimali 
let e_mode = false; // flag per la modalità di inserimento di una potenza di 10

function stampa_numero(n){
  // converte il numero in stringa secondo la modalità di visualizzazione
  // Modalità di visualizzazione:
  // 0: standard US
  // 1: scientifica
  // 2: ingegneristica
  // 3: fixed

  switch (modalita){
    case 0:
      return n.toLocaleString('en-US', {maximumFractionDigits: 6});
    case 1:
      return n.toExponential(cifre);
    case 2:
      return n.toPrecision(cifre);
    case 3:
      return n.toFixed(6);
  }
}

function cambia_modalita(){
  // cambia la modalità di visualizzazione
  modalita = (modalita + 1) % 4;
  stack_print();
}


function aggiorna_numero(c){
  // aggiorna il numero visualizzato nell'ultima riga della tabella aggiungendo il carattere c
  const rows = document.getElementById("tableBody").rows;
  if (rows.length) {
    var row = rows[rows.length-1];
    let testo = row.cells[0].innerHTML;
    // rimuovi ","
    testo = testo.replace(/,/g, '');
    // se c'è un punto decimale non lo aggiungo
    testo += c;
    // se non c'è un punto decimale e testo ha più di 3 caratteri, 
    // aggiungo separatore migliaia sulle cifre intere
    //if (c != '.' && testo.length > 3) {
      if (testo.length > 3) {
      let parts = testo.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      testo = parts.join('.');
    }
    row.cells[0].innerHTML = testo;
  }
}

function aggiorna_stack(){
  // controlla se sono in edit mode e se sì aggiorna lo stack
  if (edit_mode){
    // legge in numero visualizzato nell'ultima riga della tabella e lo aggiorna nello stack
    const rows = document.getElementById("tableBody").rows;
    if (rows.length) {
      let testo = rows[rows.length-1].cells[0].innerHTML;
      /* rimuovi "," */
      testo = testo.replace(/,/g, '');
      stack.push(Number(testo));
    }
  }
}

function clear_prompt(){
  // cancella il prompt di input e l'ultimo elemento dello stack
  const rows = document.getElementById("tableBody").rows;
  if (rows.length) {
    stack.pop();
    stack.push(0);
  }
  edit_mode = false;
  enter_pressed = true;
  stack_print();
}

function resetta_riga_input(){
  // cancella il prompt di input
  const rows = document.getElementById("tableBody").rows;
  if (rows.length) {
    rows[rows.length-1].cells[0].innerHTML = '';
  }
}

function inserisci_cifra(c){
  if (!edit_mode){
    /* se ho appena premuto enter cancello il numero ed inizia
       ad inserire il nuovo */
    if (!enter_pressed){
      // crea una nuova riga 
      stack.push(0);
      stack_print();
    }
    stack.pop();
    enter_pressed = false;
    resetta_riga_input();
    edit_mode = true;

    console.log(typeof c);

    if (c=='.'){
      aggiorna_numero('0');
    } else if (c.lowerCase=='e'){
      aggiorna_numero('1');
    }
  }
  aggiorna_numero(c);
  if (c.toLowerCase()=='e'){
    e_mode = true;
  }
}

function visualizza_prompt(prompt){
  // visualizza un messaggio sulla riga di edit sche scompare alla prossima digitazione
  const rows = document.getElementById("tableBody").rows;
  if (rows.length) {
    rows[rows.length-1].cells[0].innerHTML = prompt;
  }
}


let operatori = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  '+', '-', '*', '/', '.', 'e',
  'Enter',
  'Backspace', // cancella cifra in fase di edit o ultimo elem stack
  'Delete', // cancella tutto lo stack
  'P', // Pi greco
  'r', // radice quadrata
  'ArrowLeft', 'ArrowRight', // inverti gli ultimi due elementi dello stack
  'o', 'i', // opposto e inverso
  '^', // elevazione a potenza Y^X
  'ArrowUp', 'ArrowDown', // scorrimento stack
  's', // somma tutti gli elementi dello stack
  'h', // visualizza finestra di help
  'l', // lastx
  ':', // enter command
  'v', // cambia modalità di visualizzazione
  'c', // imposta il numero di cifre
]

/* processa la pressione di un tasto */
function processa_tasto(tasto){
  if (!isNaN(tasto) || tasto=='.' || tasto.toLowerCase()=='e'){
    inserisci_cifra(tasto);
    return;
  }
  // inserimento di una potenza di 10
  if ((tasto=='-' || tasto=='+') && e_mode){ 
    inserisci_cifra(tasto);
    return;
  }
  e_mode=false;
  if (tasto=='Backspace'){
      /* se sono in fase di inserimento, elimino l'ultima cifra */
      const rows = document.getElementById("tableBody").rows;
      const cell = rows[rows.length-1].cells[0];
      if (edit_mode && cell.innerHTML.length > 0){
        cell.innerHTML = cell.innerHTML.substring(0, cell.innerHTML.length-1);
        if (cell.innerHTML.length == 0){
          stack.push(0.);
          edit_mode = false;
          enter_pressed = true;
        } else {
          return;
        }
      } else {
      /* se non sono in fase di inserimento, 
         elimino ultimo elemento dello stack */
      lastx = stack.pop();
      }
  
      if (enter_pressed ){
        if (lastx == 0){
          stack.pop();
        }
        stack.push(0.);
        //enter_pressed = false;
      }
    
      // clear_prompt();
      stack_print();
      edit_mode = false;
      return;
    }
  aggiorna_stack(); // legge il testo in edit mode e lo aggiorna nello stack
  switch (tasto){
    case 'Enter':
      a = stack.pop()
      stack.push(a);
      stack.push(a);
      edit_mode = false;
      enter_pressed = true;
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
        visualizza_prompt('DIV 0 ERROR');
        edit_mode = false;
        enter_pressed = true;
        stack.push(0.);
        return;
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

    case 'Delete':
      /* svuoto lo stack */
      while (stack.length){
        lastx = stack.pop();
      }
      stack.push(0.);
      enter_pressed = true;
      edit_mode = false;
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
    case 'r': // radice quadrata
      if (stack[stack.length-1]<0){
        console.log('SQRT NEGATIVE ERROR');
        edit_mode = false;
        enter_pressed = false;
        break;
      }
      stack.push(Math.sqrt(stack.pop()));
      edit_mode = false;
      enter_pressed = false;
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
    case 'h': // help
      show_help();
      break;
    case 'v': // modalità di visualizzazione
      cambia_modalita();
      break;
    case 'c': // modifica il n di cifre decimali
      cifre = Math.round(stack.pop());
      cifre = Math.max(0, cifre);
      cifre = Math.min(9, cifre);
      edit_mode = false;
      enter_pressed = false;
    default:
      console.log(tasto, ' *not processed*');      
  }
  stack_print();
}

function comando(){
  /* Funzione richiamata da elemento "cmd" defiito nel file html
   * viene chiama da evento onsubmit del form
   * processa i prompt inseriti dopo il tasto ":"
   */
  var box = document.getElementById("cmd");
  let cmd = box.value;
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
let comando_input = false;
let lastx = 0;

stack_print();
window.addEventListener('keydown', function (event){
  console.log(event.key);
  if (operatori.includes(event.key) & !comando_input){
    processa_tasto(event.key)}
  }
  );

function show_help(){ // mostra una finestra popup di help visualizzando il file help.html
  var myWindow = window.open("help.html", "Help", "width=400, height=400");
}
