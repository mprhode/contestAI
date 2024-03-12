  // amended from https://github.com/crossphd/pong-js?tab=readme-ov-file
  
  var canvas;
  var canvasContext;
  var ballX = 50;
  var ballY = 50;
  var ballSpeedX = 10;
  var ballSpeedY = 4;
  var paddle1Y = 250;
  var paddle2Y = 250;
  const PADDLE_HEIGHT = 100;
  const PADDLE_WIDTH = 10;
  const BUFFER = 10;
  var score = 0;
  var highScore = 0;
  var running = false;

  // function calcMousePos(evt) {
  //   var rect = canvas.getBoundingClientRect();
  //   var root = document.documentElement;
  //   var mouseX = evt.clientX - rect.left - root.scrollLeft;
  //   var mouseY = evt.clientY - rect.top - root.scrollTop;
  //   return {
  //     x:mouseX,
  //     y:mouseY
  //   };
  // }

  function assert(condition, message) {
    if (!condition) {
        throw "error headPos: " + message || "Assertion failed";
    }
}

function movePaddle(headPosUrl) {
  console.log("making request...")
    $.ajax({          
            type: "GET",
            url: headPosUrl, 
            // cache: false, 
            // dataType: 'application:json',
            success: function(response) 
            {   
              console.log("movePaddle", response);
              var headPos = response.headPos;
              assert((headPos >= 0) && (headPos <= 1)); 
              paddle1Y = headPos * PADDLE_HEIGHT;
            },
            error: function(jqxhr, status, exception) {
              alert('Exception:' + exception);
            }
        });
  }


  window.onload = () => {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    var framesPerSecond = 40;
    setInterval(function(){
      moveEverything();
      drawEverything();
    }, 1000/framesPerSecond);
    console.log(headPosUrl, "url");
    setInterval(movePaddle, 1000, headPosUrl) //1000/framesPerSecond, headPosUrl)

    // canvas.addEventListener('mousemove',
    //   function(evt) {
    //     var mousePos = calcHeadPos(evt);//calcMousePos(evt);
    //     paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);
    //   });
     // 25=1000/40=40FPS

  }

  function drawNet(){
    for(var i = 0; i < canvas.height; i+=15){
      colorRect(canvas.width/2-1, i, 2, 5,'gray');
    }
  }

  function drawEverything(){
    // black background
    colorRect(0, 0, canvas.width, canvas.height, 'black');
    // draws ball
    colorCircle(ballX, ballY, 10, 'yellow');
    // left paddle
    colorRect(BUFFER, paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'red');
    // right paddle
    colorRect(canvas.width - (PADDLE_WIDTH + BUFFER), ballY - (PADDLE_HEIGHT/2), PADDLE_WIDTH, PADDLE_HEIGHT, 'blue');
     drawScore();
     drawNet();
    
  }

  function ballReset(){
    ballX = canvas.width/2;
    ballY = canvas.height/2;
    ballSpeedX = -ballSpeedX;
    ballSpeedY = -ballSpeedY;
  }

  function moveEverything(){
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    if((ballX + 5) >= (canvas.width - BUFFER - PADDLE_WIDTH)) {
      ballSpeedX = -ballSpeedX;
    }
    if((ballX - 5) <= (BUFFER + PADDLE_WIDTH)){
      // if ball hits paddle, else reset
      if(ballY > paddle1Y && ballY < (paddle1Y + PADDLE_HEIGHT)){
        ballSpeedX = -ballSpeedX;
        var deltaY = ballY - (paddle1Y+PADDLE_HEIGHT/2);
        ballSpeedY = deltaY * 0.25;
        score += 1;
        ballSpeedX += .8;
      }else{
        ballReset();
        if(score > highScore){
          highScore = score;
        }
        score = 0;
        ballSpeedX = 10;
        ballSpeedY = 4;
      }
    }
    if(ballY >= canvas.height) {
      ballSpeedY = -ballSpeedY;
    }
    if(ballY <= 0){
      ballSpeedY = -ballSpeedY;
    }
  }

  function drawScore(){
    canvasContext.lineWidth=1;
    canvasContext.fillStyle='white';
    // canvasContext.lineStyle="#ffff00";
    canvasContext.font="20px sans-serif";
    var scoretext = "Current Score: " + score.toString();
    canvasContext.fillText(scoretext, canvas.width - 750, 40);
    var highscoretext = "High Score: " + highScore.toString();
    canvasContext.fillText(highscoretext, canvas.width - 200, 40);
  }

  function colorRect(leftX, topY, width, height, drawColor){
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height)
  }

  function colorCircle(centerX, centerY, radius, color){
    canvasContext.fillStyle = color;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
    canvasContext.fill();

  }
