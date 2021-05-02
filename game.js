let canvas; //global canvas
let context; //global context
let player_num = 3; //tracks current player
let hori_int = 0; //global increment for horizontal 
let is_horizontal = false; //bool for if there is a horizonatal win
let vert_int = 1; //global increment for vertical
let is_vertical = false; //bool for if there is a vertical win
let diag_inc = 1; //incrementer for the diagonal checks
let is_diagonal = false; //bool for if there is a horizontal win
let isWon = false; //tracks if game is over or not
let isTied = false; //tracks if game is tied or not
let i = 0; //global i for board
let j = 0; //global j for board
let model = {
    //model for the game board
    board: "......./......./......./......./......./.......",
    next: "X"
}
let char_arr; //array implementation of the board when called

//what to do when content loads in
document.addEventListener("DOMContentLoaded", () => {
    canvas = document.querySelector("#myCanvas");
    context = canvas.getContext("2d");
    print_board();
})

//what to do when a click happens on screen
document.addEventListener("click", click_function);

//function associated to click
function click_function(e) {
    console.log("------------------")
    console.log("Click Recieved");
    const [i,j] = [e.x,e.y].map(roundMe);
    let ix = i + j * 8;
    if(model.board.charAt(ix) != '.') {
        return;
    }
    ix = check_below(ix); //returns the lowest possible space piece can go
    console.log("Piece placed at: " + ix);
    model.board =
        model.board.slice(0,ix) +
        model.next +
        model.board.slice(ix+1,47)

    if(model.next == 'X') {
        model.next = 'O';
    } else if (model.next == 'O') {
        model.next = 'X';
    }
    isWon = check_winner();
    if(!isWon) {
        player_num = player_num + 1;
        current_player(player_num);
    }
}

//requesting animation frame
function tick() {
    window.requestAnimationFrame(print_board);
}

//prints all content to the screen
function print_board() {
    context.clearRect(0,0,canvas.width,canvas.height);
    print_instructions();
    print_title();
    print_current_board(); //function for helping print board
    current_player(player_num);
    if(isWon) {
        win_print(false);
    } 
    else if(isTied) {
        win_print(true);
    }
    else {
        tick();
    }
}

//helper function to print current board to screen
function print_current_board() {
    context.fillStyle = '#000000';
    for(let i = 1; i <= 8; i++) {
        //Veritcal Lines
        context.beginPath();
        context.moveTo(120*i,120);
        context.lineTo(120*i,120*7);
        context.stroke();
        for(let j = 1; j <= 8; j++) {
            //Horizontal Lines
            context.beginPath();
            context.moveTo(120,120*j);
            context.lineTo(120*8,120*j);
            context.stroke();
        }
    }
    for(let i = 0; i <= 6; i++) {
        for(let j = 0; j <= 6; j++) {
            let box = model.board.charAt(i + j * 8);
            if (box != '.') {
                context.fillText(box,170 + i*120, 200 + j*120);
            }
        }
    }
}

//helper function to print the instructions
function print_instructions() {
    context.fillStyle = '#DC143C';
    context.font = "25pt Candara";
    context.fillText("Please Click",990,430);
    context.fillText("Anywhere",1000,470);
    context.fillText("Inside",1030,510);
    context.fillText("The Grid",1011,550);
}

//helper function to print title
function print_title() {
    context.fillStyle = '#000000'
    context.font = "40pt Candara";
    context.fillText("Connect Four", 400, 75);
    context.strokeStyle = '#1919FF';
    context.lineWidth = 8;
}

//rounder to help map the i and j of the board
function roundMe(x) {
    return Math.ceil((x-120)/120)-1
}

//tracks and prints the current player to screen
function current_player(player) {
    context.font = "35pt Candara";
    context.strokeStyle = '#DC143C';
    if (player % 2 == 1) {
        context.fillText("Player 1", 1000, 160);
    }
    else {
        context.fillText("Player 2", 1000, 160);
    }
    context.fillText("Turn", 1025, 210);
}

//checks if board is empty below index to help get pieces to bottom of board
function check_below(index) {
    for(let i = 0; i < 6; i++) {
        index = index + 8;
        if(model.board.charAt(index) != '.') {
            return index - 8;
        }
    }
}

//checks to see if someone has won yet
function check_winner() {
    char_arr = model.board.split('/');
    console.log(char_arr);
    //horizontal check
    if(check_horizonal()) {
        return true;
    }
    //vertical check
    if(check_vertical()) {
        return true;
    }
    //diagonal check
     if(check_diagonal()) {
         return true;
     }
    //checks for tie
    if(check_tied()) {
        isTied = true;
    }
    return false; //returns false otherwise
}

//checks all horizontal possibilities
function check_horizonal() {
    for(a = 0; a < 6; a++) {
        for(b = 0; b < 7; b++) {
            if(char_arr[a][b] == 'X' || char_arr[a][b] == 'O') {
                left_check(a,b,char_arr[a][b]);
                right_check(a,b,char_arr[a][b]);
                if(is_horizontal) {
                    return true;
                }
            }
        }
    }
    return false;
}

//checks left for horizontal
function left_check(a,b,game_piece) {
    if(isValidMove(a,b-1)) {
        if(char_arr[a][b-1] == game_piece && (game_piece == 'X' || game_piece == 'O')) {
            hori_int++;
            if(hori_int == 4) {
                is_horizontal = true;
            }
            left_check(a,b-1,game_piece);
        }
    }
    hori_int = 0;
}

//checks right for horizontal
function right_check(a,b,game_piece) {
    if(isValidMove(a,b+1)) {
        if(char_arr[a][b+1] == game_piece && (game_piece == 'X' || game_piece == 'O')) {
            hori_int++;
            if(hori_int == 4) {
                is_horizontal = true;
            }
            left_check(a,b+1,game_piece);
        }
    }
    hori_int = 1;
}

//checks all vertical possibilities
function check_vertical() {
    for(a = 0; a < 6; a++) {
        for(b = 0; b < 7; b++) {
            if(char_arr[a][b] == 'X' || char_arr[a][b] == 'O') {
                up_check(a,b,char_arr[a][b]);
                down_check(a,b,char_arr[a][b]);
                if(is_vertical) {
                    return true;
                }
            }
        }
    }
    return false;
}

//checks up for vertical
function up_check(a,b,game_piece) {
    if(isValidMove(a-1,b)) {
        if(char_arr[a-1][b] == game_piece && (game_piece == 'X' || game_piece == 'O')) {
            vert_int++;
            if(vert_int == 4) {
                is_vertical = true;
            }
            up_check(a-1,b,game_piece);
        }
    }
    vert_int = 1;
}

//checks down for vertical
function down_check(a,b,game_piece) {
    if(isValidMove(a+1,b)) {
        if(char_arr[a+1][b] == game_piece && (game_piece == 'X' || game_piece == 'O')) {
            vert_int++;
            if(vert_int == 4) {
                is_vertical = true;
            }
            down_check(a+1,b,game_piece);
        }
    }
    vert_int = 0;
}

//checks all diagonal possibilities by calling below functions
function check_diagonal() {
    for(let a = 0; a < 6; a++) {
        for(let b = 0; b < 7;b++) {
            if(char_arr[a][b] == 'X' || char_arr[a][b] == 'O') {
                check_north_east(a,b,char_arr[a][b]);
                check_north_west(a,b,char_arr[a][b]);
                check_south_east(a,b,char_arr[a][b]);
                check_south_west(a,b,char_arr[a][b]);
                if(is_diagonal) {
                    return true;
                }
            }
        }
    }
    return false;
}

//checks the northeast diagonal possibility
function check_north_east(a,b,game_piece) {
    if(isValidMove(a-1,b+1)) {
        if(char_arr[a-1][b+1] == game_piece && (game_piece == 'X' || game_piece == 'O')) {
            diag_inc++;
            if(diag_inc == 4) {
                is_diagonal = true;
            }
            check_north_east(a-1,b+1,game_piece);
        }
    }
    diag_inc = 1;
}

//checks the northwest diagonal possibility
function check_north_west(a,b,game_piece) {
    if(isValidMove(a-1,b-1)) {
        if(char_arr[a-1][b-1] == game_piece && (game_piece == 'X' || game_piece == 'O')) {
            diag_inc++;
            if(diag_inc == 4) {
                is_diagonal = true;
            }       
            check_north_west(a-1,b-1,game_piece);
        }
    }
    diag_inc = 1;
}

//checks the southeast diagonal possibility
function check_south_east(a,b,game_piece) {
    if(isValidMove(a+1,b+1)) {
        if(char_arr[a+1][b+1] == game_piece && (game_piece == 'X' || game_piece == 'O')) {
            diag_inc++;
            if(diag_inc == 4) {
                is_diagonal = true;
            }       
            check_south_east(a+1,b+1,game_piece);
        }
    }
    diag_inc = 1;
}

//checks the southwest diagonal possibility
function check_south_west(a,b,game_piece) {
    if(isValidMove(a+1,b-1)) {
        if(char_arr[a+1][b-1] == game_piece && (game_piece == 'X' || game_piece == 'O')) {
            diag_inc++;
            if(diag_inc == 4) {
                is_diagonal = true;
            }       
            check_south_west(a+1,b-1,game_piece);
        }
    }
    diag_inc = 1;
}

//checks to see if the current point is valid for the board
function isValidMove(a,b) {
    if(a >= 0 && a < 6 && b >= 0 && b < 7) {
        return true;
    } else {
        return false;
    }
}

//checks if it is a tie game
function check_tied() {
    for(let a = 0; a < 6; a++) {
        for(let b = 0; b < 7; b++) {
            if(char_arr[a][b] == '.') {
                return false;
            }
        }
    }
    return true;
}

//final print if someone wins
function win_print(tie_check) {
    //learned about removeEventListener at https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener
    document.removeEventListener("click", click_function);
    context.clearRect(0,0,canvas.width,canvas.height);
    context.font = "50pt Candara"
    let player = player_num % 2;
    if(player == 0) {player = 2}
    if(tie_check) {
        context.fillText("It's a Tie!",400,80);
    } else {
        context.fillText("Player " + player + " Won!",400,80);
    }
    context.strokeStyle = "#1919FF";
    context.font = "40pt Candara";
    print_current_board(); //function for helping print board
    context.font = "30pt Candara";
    context.fillStyle = "#DC143C";
    context.fillText("To Play",1010,160);
    context.fillText("Again",1020,210);
    context.fillText("Please",1015,260);
    context.fillText("Click",1030,310);
    context.fillText("Anywhere",985,360);
    context.fillText("^_^",1042,410);
    document.addEventListener("click",final_click)
}

//what to do on the final click
function final_click() {
    reset_all();
    print_board();
}

//helps reset the game by making globals original values and swapping click event listeners
function reset_all() {
    document.addEventListener("click",click_function);
    player_num = 3;
    hori_int = 0;
    is_horizontal = false;
    vert_int = 1;
    is_vertical = false;
    diag_inc = 1;
    is_diagonal = false;
    isWon = false;
    isTied = false;
    i = 0;
    j = 0;
    model.board = "......./......./......./......./......./.......";
    model.next = "X";
    console.clear();
    document.removeEventListener("click",final_click);
}