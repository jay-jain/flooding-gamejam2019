$(document).ready(function(){
  
  // event listeners
  $("#remaining-time").hide();
  $("#start").on('click', trivia.startGame);
  $(document).on('click' , '.option', trivia.guessChecker);
  
})

var trivia = {
  // trivia properties
  correct: 0,
  incorrect: 0,
  unanswered: 0,
  currentSet: 0,
  timer: 20,
  timerOn: false,
  timerId : '',
  // questions options and answers data
  // https://restorationmasterfinder.com/restoration/flood-facts-prevent-flood-damage/
  questions: {
    q1: 'What\'s a muddy flood?',
    q2: 'According to the National Flood Insurance Program, what\'s the chance of the average American home sustaining flood damage in the course of a 30-year mortgage?',
    q3: 'What should you do if a flash flood is approaching you?',
    q4: 'How much rapidly moving water can knock a person down?',
    q5: "Flooding is the most common natural disaster in the U.S.",
    q6: 'Over the past 30 years, flooding in the US has caused how much in damage on average every year? ',
    q7: "How much moving water does it take to carry your car away?"
  },
  options: {
    q1: ['A flood with a lot of mud in it', 'A flood caused by runoff on farmland', 'A flood caused by a landslide'],
    q2: ['14 %', '26 %', '48 %'],
    q3: ['Run as fast as you can.', 'Go limp and let the flood waters carry you.','Climb to higher ground any way you can.'],
    q4: ['3 inches (8 centimeters)', '6 inches (15 centimeters)', '1 foot (30 centimeters)'],
    q5: ['True','False'],
    q6: ['$2 billion','$4 billion','$6 billion','$8 billion'],
    q7: ['1 foot', '2 feet', '3 feet','4 feet']
  },
  answers: {
    q1: 'A flood caused by runoff on farmland',
    q2: '26 %',
    q3: 'Climb to higher ground any way you can.',
    q4: '6 inches (15 centimeters)',
    q5: 'True',
    q6: '$8 billion',
    q7: '2 feet'
  },
  
  //==========================
  //      Trivia methods      
  //==========================

  // Initialize game method
  startGame: function(){
    // restarting game results
    trivia.currentSet = 0;
    trivia.correct = 0;
    trivia.incorrect = 0;
    trivia.unanswered = 0;
    clearInterval(trivia.timerId);
    
    // show game section
    $('#game').show();
    
    //  empty last results
    $('#results').html('');
    
    // show timer
    $('#timer').text(trivia.timer);
    
    // remove start button
    $('#start').hide();

    $('#remaining-time').show();
    
    // ask first question
    trivia.nextQuestion();
    
  },

  // Method to loop through and display questions and options 
  nextQuestion : function(){
    
    // set timer to 20 seconds each question
    trivia.timer = 10;
    $('#timer').removeClass('last-seconds');
    $('#timer').text(trivia.timer);
    
    // to prevent timer speed up
    if(!trivia.timerOn){
      trivia.timerId = setInterval(trivia.timerRunning, 1000);
    }
    
    // gets all the questions then indexes the current questions
    var questionContent = Object.values(trivia.questions)[trivia.currentSet];
    $('#question').text(questionContent);
    
    // an array of all the user options for the current question
    var questionOptions = Object.values(trivia.options)[trivia.currentSet];
    
    // creates all the trivia guess options in the html
    $.each(questionOptions, function(index, key){
      $('#options').append($('<button class="option btn btn-info btn-lg">'+key+'</button>'));
    })
    
  },
  // method to decrement counter and count unanswered if timer runs out
  timerRunning : function(){
    // if timer still has time left and there are still questions left to ask
    if(trivia.timer > -1 && trivia.currentSet < Object.keys(trivia.questions).length){
      $('#timer').text(trivia.timer);
      trivia.timer--;
        if(trivia.timer === 4){
          $('#timer').addClass('last-seconds');
        }
    }
    // the time has run out and increment unanswered, run result
    else if(trivia.timer === -1){
      trivia.unanswered++;
      trivia.result = false;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<h3>Out of time! The answer was '+ Object.values(trivia.answers)[trivia.currentSet] +'</h3>');
    }
    // if all the questions have been shown end the game, show results
    else if(trivia.currentSet === Object.keys(trivia.questions).length){
      
      // adds results of game (correct, incorrect, unanswered) to the page
      $('#results')
        .html('<h3>Thank you for playing!</h3>'+
        '<p>Correct: '+ trivia.correct +'</p>'+
        '<p>Incorrect: '+ trivia.incorrect +'</p>'+
        '<p>Unanswered: '+ trivia.unanswered +'</p>'+
        '<p>Please play again!</p>');
      
      // hide game sction
      $('#game').hide();
      
      // show start button to begin a new game
      $('#start').show();
    }
    
  },
  // method to evaluate the option clicked
  guessChecker : function() {
    
    // timer ID for gameResult setTimeout
    var resultId;
    
    // the answer to the current question being asked
    var currentAnswer = Object.values(trivia.answers)[trivia.currentSet];
    
    // if the text of the option picked matches the answer of the current question, increment correct
    if($(this).text() === currentAnswer){
      // turn button green for correct
      $(this).addClass('btn-success').removeClass('btn-info');
      
      trivia.correct++;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<h3>Correct Answer!</h3>');
    }
    // User picks the wrong option; make wrong option red, and increment wrong answer var
    else{
      // turn button clicked red for incorrect
      $(this).addClass('btn-danger').removeClass('btn-info');
      
      trivia.incorrect++;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<h3>Better luck next time! The correct answer is:\n '+ currentAnswer +'</h3>');
      //$('#next').html('<button class="btn btn-secondary btn-lg">');
    }
    
  },
  // method to remove previous question results and options
  guessResult : function(){
    
    // increment to next question set
    trivia.currentSet++;
    
    // remove the options and results
    $('.option').remove();
    $('#results h3').remove();
    
    // begin next question
    trivia.nextQuestion();
     
  }

}