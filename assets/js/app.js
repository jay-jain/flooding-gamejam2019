// water fall animation https://codepen.io/visualcomposer/pen/PXPpWQ?page=1&

$(document).ready(function(){
  
  // event listeners
  $("#remaining-time").hide();
  $("#start").on('click', trivia.startGame);
  $(document).on('click' , '.option', trivia.guessChecker);
  // $(document).on('click','.nextbutton',trivia.guessResult;
  $("#nextb").on('click',trivia.guessResult); 
});

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
    q7: "How much moving water does it take to carry your car away?",
    q8: "Which states are safe from flooding?",
    q9: "Flash floods can bring walls of water from ",
    q10: "In preparation for a flood, it is important to stock up on ______,______, 3 gallons of water per person for 3 days, ______ radio for weather reports, extra batteries, personal ______ .",
    q11: "Since flood damage is _____ covered by homeowners insurance, flood insurance is important for people living in high-risk flood zones.",
    q12: "If your skin comes in contact with flood water, make sure to wash it with __________ because the contents are unknown.",
    q13: "Communities, particularly at risk, are those located in ",
    q14: "Standing flood water could be electrically charged and very dangerous if there are downed power lines.",
    q15: "Over recent decades, possibly due to global climate change, hundred-year floods have been occurring worldwide with frightening regularity.",
    q16: "Typically, flood processes are subdivided into three categories: ",
    q17: "The drivers of flood risk are influenced by human and economic development, climate change, and disaster risk management.",
    q18: "A large part of the population growth does not take place in flood-prone areas.",
    q19: "Flood risk assessment needs to take into account the dynamic nature of risk, which is constantly changing due to socioeconomic growth, climate change-induced changes in rainfall and sea levels, and disaster risk management",
  },
  options: {
    q1: ['A flood with a lot of mud in it', 'A flood caused by runoff on farmland', 'A flood caused by a landslide'],
    q2: ['14 %', '26 %', '48 %'],
    q3: ['Run as fast as you can.', 'Go limp and let the flood waters carry you.','Climb to higher ground any way you can.'],
    q4: ['3 inches (8 centimeters)', '6 inches (15 centimeters)', '1 foot (30 centimeters)'],
    q5: ['True','False'],
    q6: ['$2 billion','$4 billion','$6 billion','$8 billion'],
    q7: ['1 foot', '2 feet', '3 feet','4 feet'],
    q8: ['California, New York, Michigan','Nevada','None'],
    q9: ['10 to 20 feet high','30 to 40 feet high','50 to 60 feet high'],
    q10:['first aid items, non-perishable foods, battery operated, hygiene','beer, perishable foods, chargeable, belongings','gas, microwaveable foods, battery operated, picture frames'],
    q11:['almost always','almost never', 'mandatorily'],
    q12:['tomato juice','soap and disinfected water', 'water'],
    q13:['low-lying areas','high ground areas','suburbs'],
    q14:['True','False'],
    q15:['True','False'],
    q16:['coastal flooding, river flooding, and pluvial flooding.','floodplain flooding, flash flooding, water type.','flooding, overflow, torrent'],
    q17:['True','False'],
    q18:['True','False'],
    q19:['True','False']
  },
  answers: {
    q1: 'A flood caused by runoff on farmland',
    q2: '26 %',
    q3: 'Climb to higher ground any way you can.',
    q4: '6 inches (15 centimeters)',
    q5: 'True',
    q6: '$8 billion',
    q7: '2 feet',
    q8: 'None',
    q9: '10 to 20 feet high',
    q10: 'first aid items, non-perishable foods, battery operated, hygiene',
    q11: 'almost never',
    q12: 'soap and disinfected water',
    q13: 'low-lying areas',
    q14: 'True',
    q15: 'True',
    q16: 'coastal flooding, river flooding, and pluvial flooding.',
    q17: 'True',
    q18: 'False',
    q19: 'True'
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
    
    $('#nextb').html('<button id="nextbutton" class="btn btn-primary btn-lg" disabled>Next Question</button>');

    // ask first question
    trivia.nextQuestion();

     
  },

  // Method to loop through and display questions and options 
  nextQuestion : function(){
    
    // set timer to 20 seconds each question
    trivia.timer = 20;
    $('#timer').removeClass('last-seconds');
    $('#timer').text(trivia.timer);
    
    // to prevent timer speed up
    if(!trivia.timerOn){
      trivia.timerId = setInterval(trivia.timerRunning, 2000);
    }
    
    // gets all the questions then indexes the current questions
    var questionContent = Object.values(trivia.questions)[trivia.currentSet];
    $('#question').text(questionContent);
    
    // an array of all the user options for the current question
    var questionOptions = Object.values(trivia.options)[trivia.currentSet];
    
    // creates all the trivia guess options in the html
    $.each(questionOptions, function(index, key){
      $('#options').append($('<button class="option btn btn-info btn-lg">'+key+'</button>'));
    });

    if(trivia.currentSet < 19){
      $('#qnum').text('Question ' + (trivia.currentSet+1) +' / 19')   
    }
  },

  // Method to handle timer and count as unanswered if timer runs out before question is answered
  timerRunning : function(){
    // if timer still has time left and there are still questions left to ask
    if(trivia.timer > -1 && trivia.currentSet < Object.keys(trivia.questions).length){
      $('#timer').text(trivia.timer);
      trivia.timer--;
        if(trivia.timer === 4){
          $('#timer').addClass('last-seconds');
        }
    }
    // If time has run out, unanswered is incremented, run result
    else if(trivia.timer === -1){
      trivia.unanswered++;
      trivia.result = false;
      clearInterval(trivia.timerId);
      $('#options').find('button').attr('disabled','disabled');
      //resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<h3>Out of time! The answer was '+ Object.values(trivia.answers)[trivia.currentSet] +'</h3>');
      $('#nextb').html('<button id="nextbutton" class="btn btn-primary btn-lg">Next Question</button>');

    }
    // if all the questions have been shown end the game, show results
    else if(trivia.currentSet === Object.keys(trivia.questions).length){
      //$("#nextb").hide();
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
    
    // If the text of the option picked matches the answer of the current question, increment correct
    if($(this).text() === currentAnswer){
      // turn button green for correct answer
      $(this).addClass('btn-success').removeClass('btn-info');
      
      trivia.correct++;
      clearInterval(trivia.timerId);
      $('#options').find('button').attr('disabled','disabled');
      //resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<h3>Correct Answer!</h3>');
      $('#nextb').html('<button id="nextbutton" class="btn btn-primary btn-lg">Next Question</button>');

    }
    // User picks the wrong option; make wrong option red, and increment wrong answer var
    else{
      // turn button clicked red for incorrect answer
      $(this).addClass('btn-danger').removeClass('btn-info');
      
      trivia.incorrect++;
      clearInterval(trivia.timerId);
      $('#options').find('button').attr('disabled','disabled');
      //resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<h3>Better luck next time! The correct answer is:\n '+ currentAnswer +'</h3>');
      $('#nextb').html('<button id="nextbutton" class="btn btn-primary btn-lg">Next Question</button>');


    }
    
  },
  // Method to remove previous question results and options.
  guessResult : function(){
    
    // increment to next question set
    trivia.currentSet++;
    
    // remove the options and results
    $('.option').remove();
    $('#results h3').remove();
    // $("#nextb").remove();
    document.getElementById('nextbutton').remove();
    
    // begin next question
    trivia.nextQuestion();
     
  }

}