$(document).ready(function() {

  function checkDeck(sets, targetDeckId) {

    var requests = sets.map(function(set) {
      return $.ajax({
        url: 'http://netrunnerdb.com/api/set/' + set
      });
    });
    $.when.apply($, requests).then(function() {

      // convert the arguments array, where each argument is in the form
      // [data, textStatus, jqXHR], into an array of just the data values
      var allData = [].map.call(arguments, function(arg) {
        return arg[0];
      });

      var ownedSetCodes = [];
      if (sets.length == 1) {
        for (var i = 0; i < arguments[0].length; i++) {
          ownedSetCodes.push(arguments[0][i].code);
        };
      } else {
        for (var i = 0; i < arguments.length; i++) {
          for (var j = 0; j < arguments[i][0].length; j++) {
            ownedSetCodes.push(arguments[i][0][j].code);
          }
        };
      }
      $.when(
        $.getJSON('http://netrunnerdb.com/api/decklist/' + targetDeckId),
        $.getJSON("http://netrunnerdb.com/api/cards/")
      ).done(function(targetDeckData, allCardData) {

        var targetDeckName = targetDeckData[0].name;
        var targetDeck = [];
        var missingCardCodes = [];
        var tempArr = [];
        var missingCards = [];
        var missingCardTitles = [];
        var allCardCodes = [];
        var displayedList = ['<h2>' + targetDeckName + '</h2>'];

        function Card(code, title, type) {
          this.code = code;
          this.title = title;
          this.type = type;
        }

        for (var key in targetDeckData[0].cards) {
          targetDeck.push(key);
        };
        for (var i = 0; i < targetDeck.length; i++) {
          if (ownedSetCodes.indexOf(targetDeck[i]) == -1) {
            missingCardCodes.push(targetDeck[i]);
          };
        };
        for (var i = 0; i < allCardData[0].length; i++) {
          allCardCodes.push(allCardData[0][i].code);
        }
        for (var i = 0; i < missingCardCodes.length; i++) {
          tempArr.push(allCardCodes.indexOf(missingCardCodes[i]));
        }
        for (var i = 0; i < tempArr.length; i++) {
          var currentMissingCard = allCardData[0][tempArr[i]];
          var code = currentMissingCard.code;
          var title = currentMissingCard.title;
          var type = currentMissingCard.type;
          missingCards.push(new Card(code, title, type));

        }
        if (missingCards.length == 0) {
          displayedList = '<h2>' + targetDeckName + '</h2><p>You already own all the necessary cards.</p>';
        } else {
          for (var i = 0; i < missingCards.length; i++) {
            displayedList += '<li><a href="http://netrunnerdb.com/en/card/' + missingCards[i].code + '">' + missingCards[i].title + '</a></li>';
          }
        }
        console.log(missingCards);
        $('#missing-cards').html(displayedList);
   

      }); /**********End of second ajax request*************/

    }); /**********End of first ajax request*************/

  }; /*************End of checking function**************/

  /*********** Select/deselect All ***********/
  $('#select-all').click(function(event) {
    event.preventDefault();
    $(':checkbox').each(function() {
      this.checked = true;
    })
  });

  $('#deselect-all').click(function(event) {
    event.preventDefault();
    $(':checkbox').each(function() {
      this.checked = false;
    })
  });

  $('#check-deck').click(function() {
    var selected = [];
    var targetDeckId = $('#targetDeckInput').val();

    $('input:checked').each(function() {
      selected.push($(this).attr('name'));
    });
    checkDeck(selected, targetDeckId);
  })

});