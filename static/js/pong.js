  // amended from https://github.com/crossphd/pong-js?tab=readme-ov-file
  
  var canvas;
  var canvasContext;
  var canvasWidth;
  var ballY = 50;
  var ballX = 50;
  var ballSpeedY = 10;
  var ballSpeedX = 4;
  var paddle1X = 250;
  var paddle2X = 250;
  const PADDLE_WIDTH = 100;
  const PADDLE_HEIGHT = 10;
  const BUFFER = 10;
  const BALL_RADIUS = 5;
  var score = 0;
  var running = false;

  // function calcMousePos(evt) {
  //   var rect = canvas.getBoundingClientRect();
  //   var root = document.documentElement;
  //   var mouseY = evt.clientY - rect.left - root.scrollLeft;
  //   var mouseX = evt.clientX - rect.top - root.scrollTop;
  //   return {
  //     y:mouseY,
  //     x:mouseX
  //   };
  // }

  function assert(condition, message) {
    if (!condition) {
        throw "error headPos: " + message || "Assertion failed";
    }
}

function movePaddle(headPosUrl) {
    $.ajax({          
            txpe: "GET",
            url: headPosUrl, 
            // cache: false, 
            // dataTxpe: 'application:json',
            success: function(response) 
            {   
              // console.log("movePaddle", response, canvasWidth);
              var headPos = response.headPos;
              assert((headPos >= 0) && (headPos <= 1)); 
              paddle1X = headPos * canvasWidth;
            },
            error: function(jxxhr, status, exception) {
              console.log('Exception:' + exception);
            }
        });
  }


  window.onload = () => {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    canvasWidth = canvas.width;
    var framesPerSecond = 40;
    setInterval(function(){
      moveEverything();
      drawEverything();
    }, 1000/framesPerSecond);
    console.log(headPosUrl, "url");
    console.log(updateHighScoreUrl, "url");
    setInterval(movePaddle, 1000, headPosUrl) //1000/framesPerSecond, headPosUrl)

    // canvas.addEventListener('mousemove',
    //   function(evt) {
    //     var mousePos = calcHeadPos(evt);//calcMousePos(evt);
    //     paddle1X = mousePos.x - (PADDLE_HEIGHT/2);
    //   });
     // 25=1000/40=40FPS

  }

  function drawNet(){
    for(var i = 0; i < canvas.width; i+=15){
      colorRect(i, canvas.height/2, 5, 2,'gray');
    }
  }

  function drawEverything(){
    // black background
    colorRect(0, 0, canvas.width, canvas.height, 'black');
    // draws ball
    colorCircle(ballX, ballY, BALL_RADIUS*2, 'yellow');
    // bottom paddle = player
    colorRect(paddle1X, canvas.height - (BUFFER + PADDLE_HEIGHT), PADDLE_WIDTH, PADDLE_HEIGHT, 'red');
    // top paddle = computer, tracks the ball
    colorRect(ballX - (PADDLE_WIDTH/2), BUFFER, PADDLE_WIDTH, PADDLE_HEIGHT, 'blue');
    //  drawScore();
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
    // slow down ball after computer hit
    if((ballY - BALL_RADIUS) <= (BUFFER + PADDLE_HEIGHT)) {
      ballSpeedY = -ballSpeedY;
    }
    // near player side
    if((ballY + BALL_RADIUS) >= (canvas.height - (BUFFER + PADDLE_HEIGHT))){
      // if ball hits paddle, else reset
      if(ballX > paddle1X && ballX < (paddle1X + PADDLE_WIDTH)){
        ballSpeedY = -ballSpeedY;
        var deltaX = ballX - (paddle1X+PADDLE_WIDTH/2);
        ballSpeedX = deltaX * 0.25;
        score += 1;
        ballSpeedY += .8;
      }else{
        ballReset();
        if(score > highScore){
          highScore = score;
          $.ajax({
            type : 'POST',
            url : updateHighScoreUrl,
            // contentType: 'application/json;charset=UTF-8',
            data : {'highscore': highScore},
            success : function(data, status){
              console.log("Data: " + highScore + "\nStatus: " + status);
            },
            error: function(data, status){
              alert("Data: " + highScore + "\nStatus: " + status);
            },
          });
        }
        score = 0;
        ballSpeedY = 10;
        ballSpeedX = 4;
      }
    }
    // wall bounces
    if(ballX >= canvas.width) {
      ballSpeedX = -ballSpeedX;
    }
    if(ballX <= 0){
      ballSpeedX = -ballSpeedX;
    }
  }

  function drawScore(){
    canvasContext.lineWidth=1;
    canvasContext.fillStyle='white';
    // canvasContext.lineStxle="#ffff00";
    canvasContext.font="20py sans-serif";
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
