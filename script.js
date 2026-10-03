function GameBoard(){
    const row = 3;
    const column = 3;
    let board = []
    for (let i=0;i<row;i++){
        board[i] = []
        for(let j=0;j<column;j++){
            board[i][j]=cell();
        } 
    }
    function addSign(row,column,sign){
        if (sign!=="X" && sign!=="O"){
            console.log("wrong sign");
            return false;
        }
        if(row<1||row>3 ||column<0||column>3){
            console.log("index out of bounds");
            return false;
        }
        row -= 1;
        column -=1;
        if(board[row][column].getValue()!==" "){
            return "overwrite"
        }
        board[row][column].changeValue(sign);
    }
    function printState(){
        let boardwithValues= board.map((row)=>row.map((col)=>col.getValue()))
        console.log(boardwithValues);
    }
    function resetState(){
         board = []
        for (let i=0;i<row;i++){
        board[i] = []
        for(let j=0;j<column;j++){
            board[i].push(cell());
        } 
        }
    }
    function winning(player){
        for(let i=0;i<row;i++){
            const boardRow = board[i].filter((cell)=>cell.getValue()===player.sign)
            if (boardRow.length===3){
                return true;
            }
        }
        if(board[0][0]===board[1][0]===board[2][0]){
            return true
        }
        else if(board[0][1]===board[1][1]===board[2][1]){
            return true
        }
        else if(board[0][2]===board[1][2]===board[2][2]){
            return true
        }
        else if(board[0][0]===board[1][1]===board[2][2]){
            return true
        }
        else if(board[0][2]===board[1][1]===board[2][0]){
            return true
        }
        else {return false}
    }
    return {printState,addSign,resetState,winning}
}

function playGame(){
    const gameBoard = GameBoard();
    function player(name, sign){
        return {name,sign}
        }
    const player1 = player("player1","X");
    const player2 = player("player2","O");
    let activePlayer = player1;
    function switchActivePlayer(){
        activePlayer = activePlayer === player1 ? player2 : player1;
    }
    const getActivePlayer = () => activePlayer;
    const printNewRound = () => {
        gameBoard.printState();
        console.log(`${getActivePlayer().name}'s turn`)
    }
    const playRound = (row,column) => {
        const move = gameBoard.addSign(row,column,getActivePlayer().sign);
        if (move===false||move==="overwrite"){
            console.log("Invalid move taken, Please do a valid move");
            printNewRound();
            return;
        }
        const result = gameBoard.winning(getActivePlayer());
        if (result===true){
            console.log(`${getActivePlayer().name} won`);
        }else{
            switchActivePlayer()
            printNewRound()
        }
    }
    printNewRound()
    return {playRound,getActivePlayer}
}
         
function cell(){
    let value=" ";

    function changeValue(sign){
        value=sign;
    }
    let getValue = () => value;
    return {changeValue,getValue}
}