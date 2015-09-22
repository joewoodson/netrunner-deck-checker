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

        var targetDeck = [];
        var missingCards = [];
        var tempArr = [];
        var missingCardTitles = [];
        var allCardCodes = [];
        var displayedList = [];

        for (var key in targetDeckData[0].cards) {
          targetDeck.push(key);
        };
        for (var i = 0; i < targetDeck.length; i++) {
          if (ownedSetCodes.indexOf(targetDeck[i]) == -1) {
            missingCards.push(targetDeck[i]);
          };
        };
        for (var i = 0; i < allCardData[0].length; i++) {
          allCardCodes.push(allCardData[0][i].code);
        }

        for (var i = 0; i < missingCards.length; i++) {
          tempArr.push(allCardCodes.indexOf(missingCards[i]));
        }
        for (var i = 0; i < tempArr.length; i++) {
          missingCardTitles.push(allCardData[0][tempArr[i]].title);
        }
        if (missingCardTitles.length == 0) {
          displayedList = '<p>You already own all the necessary cards.</p>';
        } else {
          for (var i = 0; i < missingCardTitles.length; i++) {
            displayedList += '<li><a href="http://netrunnerdb.com/en/card/' + missingCards[i] + '">' + missingCardTitles[i] + '</a></li>';
          }
        }
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