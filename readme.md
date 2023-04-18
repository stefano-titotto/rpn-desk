# RPN-Desk
Versione minimale per desktop di calcolatrice RPN implementata completamente nel browser.

## Struttura della pagina
- la schermata contiene 
    - `header`
        - titolo
    - `main`
        - stack con 4 posizioni visibili
        - casella di input è la prima posizione (in basso) dello stack
        - tastiera (7r X 5c)
    - `footer`
        - console
        
### Stack
- altezza N righe
- creare costruttore stack

## Funzionalità
- i numeri digitati sono costruiti nella casella input
- se premo [enter] faccio un push e ricopio il numero nella casella input
- se premo un operatore lo applico alla stack 
- se inizio a digitare un numero dopo aver premuto enter, prima cancello il valore in input poi entro in fase digitazione
- se inizio a digitare dopo aver fatto un'operazione, faccio un pop del numero che sto digitando.

## Todo
### Versione light
- costruttore stack
- funzionalità tastierino numerico/tastiera
- creare app minimale per desktop/laptop

### nuove funzionalità
- ':' per inserire funzioni varie
    - Funzioni: sqrt, log, ln, exp, sin, cos, tan, asin, acos, atan

- nuovi tasti: 
- 'o' opposto
- 'i' inverso
- '^' per elevare a potenza X^Y
 
- rotazione stack con tasti alto e basso
    - 'h' per visualizzare finestra con lista funzioni
    - implementare formato visualizzazione numeri


*Stefano Titotto*
