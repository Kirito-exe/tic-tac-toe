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
    function getBoard(){
        return board;
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
        if(board[0][0].getValue()===board[1][0].getValue() && board[0][0].getValue()===board[2][0].getValue() && board[0][0].getValue()===player.sign){
            return true
        }
        else if(board[0][1].getValue()===board[1][1].getValue() && board[0][1].getValue()===board[2][1].getValue() && board[0][1].getValue()===player.sign){
            return true
        }
        else if(board[0][2].getValue()===board[1][2].getValue() && board[0][2].getValue()===board[2][2].getValue() && board[0][2].getValue()===player.sign){
            return true
        }
        else if(board[0][0].getValue()===board[1][1].getValue() && board[0][0].getValue()===board[2][2].getValue() && board[0][0].getValue()===player.sign){
            return true
        }
        else if(board[0][2].getValue()===board[1][1].getValue() && board[0][2].getValue()===board[2][0].getValue() && board[0][2].getValue()===player.sign){
            return true
        }
        else{
            let drawStatus = true;
            for(let i=0;i<row;i++){
                for(let j=0;j<column;j++){
                    if(board[i][j].getValue()===" "||board[i][j].getValue()===""){
                        drawStatus=false;
                        }
                    }
                }
            if(drawStatus){
                return "draw";
                }else{
                    return false;
                }
            }
        }
   return {printState,addSign,resetState,winning,getBoard}
}

function playGame(){
    const gameBoard = GameBoard();
    function player(name, sign){
        return {name,sign}
        }
    const player1 = player("Player 1","X");
    const player2 = player("Player 2","O");
    function setName(name1,name2){
        player1.name =name1;
        player2.name=name2
    }
    let winStatus = false;
    let activePlayer = player1;
    function switchActivePlayer(){
        activePlayer = activePlayer === player1 ? player2 : player1;
    }
    const getActivePlayer = () => activePlayer;
    const printNewRound = () => {
        gameBoard.printState();
        console.log(`${getActivePlayer().name}'s turn`)
    }
    const getWinStatus = () => winStatus;
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
            winStatus=true;
        }else if(result==="draw"){
            console.log("It's a draw");
            winStatus="draw";
        }
        else{
            switchActivePlayer()
            printNewRound()
        }
    }
    printNewRound()
    return {playRound,getActivePlayer,getboard:gameBoard.getBoard,getWinStatus,setName}
}
         
function cell(){
    let value=" ";

    function changeValue(sign){
        value=sign;
    }
    let getValue = () => value;
    return {changeValue,getValue}
}

function screenController(){
    let pg = playGame();
    let activePlayerDiv = document.querySelector(".turn");
    let boardDiv = document.querySelector(".board");
    let winningPlayer = document.querySelector(".winner");
    let submitDialog = document.querySelector("button[type='button']")

    let dialog = dialogControls()
    dialog.openDialog();
    function updateScreen(){
        boardDiv.textContent="";
        pg.setName(player1name,player2name);
        const board= pg.getboard();
        const activePlayer = pg.getActivePlayer().name;
        activePlayerDiv.textContent = `${activePlayer}'s turn`;
        board.forEach((row,rowIndex)=>{
            row.forEach((cell,columnIndex)=>{
                let cellButton = document.createElement("button");
                cellButton.setAttribute("class","cell");
                cellButton.dataset.row=rowIndex;
                cellButton.dataset.column=columnIndex;
                cellButton.textContent=cell.getValue();
                boardDiv.appendChild(cellButton);
            })
        })
        const winStatus = pg.getWinStatus();
        if (winStatus===true){
            winningPlayer.textContent=`${activePlayer} won!!!`
            boardDiv.removeEventListener("click",clickHandler)
        }else if(winStatus==="draw"){
            winningPlayer.textContent="it's a draw"
            boardDiv.removeEventListener("click",clickHandler)
        }else{
            winningPlayer.textContent="FIGHT";
        }
    }
        function clickHandler(e){
            const selectedRow = parseInt(e.target.dataset.row)+1;
            const selectedColumn = parseInt(e.target.dataset.column)+1;
            console.log(selectedRow);
            console.log(selectedColumn);
            if(!selectedColumn){
                return;
            }
            pg.playRound(selectedRow,selectedColumn);
            updateScreen();
        }
        boardDiv.addEventListener("click",clickHandler);
        updateScreen();
        submitDialog.addEventListener("click",updateScreen)
}
function dialogControls(){
    let dialogButton = document.querySelector("#open-dialog");
    let dialog = document.querySelector("#playerName")
    function openDialog(){
        dialogButton.addEventListener("click",()=>{
        dialog.showModal()
        })
    }
    
    let player1Input = dialog.querySelector("#player1");
    let player2Input = dialog.querySelector("#player2");
    let submitButton = dialog.querySelector("button[type='button']");
    submitButton.addEventListener("click",()=>{
        player1name = player1Input.value;
        player2name = player2Input.value;
        dialog.close()
    })
    player1name = player1name.trim()==="" ? "Player 1" : player1name;
    player2name = player2name.trim()==="" ? "Player 2" : player2name;
    function getPlayerNames(){
        return {player1name,player2name}
    }
    return{getPlayerNames,openDialog}
}
function reset(){
    const resetButton = document.querySelector("#restart")
    resetButton.addEventListener("click",screenController)
}
let player1name="Player 1";
let player2name="Player 2";
reset();
screenController();