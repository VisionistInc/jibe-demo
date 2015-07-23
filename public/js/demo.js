var Demo = (function () {

  // from http://www.esolcourses.com/content/exercises/grammar/adjectives/personality/more-words-for-describing-personality.html
  var adjectives = [
    "affectionate", "aggressive", "ambitious", "anxious", "artistic", "bad-tempered",
    "big-headed", "boring", "bossy", "charismatic", "creative", "courageous",
    "dependable", "devious", "dim", "extroverted", "egotistical", "gregarious",
    "impulsive", "intelligent", "introverted", "industrious", "joyful", "reliable",
    "sociable", "sympathetic", "talkative", "upbeat"
  ];

  // from https://www.randomlists.com/nouns
  var nouns = [
    "spoon", "cannon", "riddle", "air", "transport", "ducks", "food", "clown",
    "voice", "elephant", "coast", "pan", "field", "committee", "ring", "trampoline", "men",
    "rings", "hat", "fire", "turkey", "hot pocket", "flavor", "cup", "test", "pet",
    "mom", "cook", "spade", "shake", "turtle"
  ];

  function generateUsername() {
    var adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    var noun = nouns[Math.floor(Math.random() * nouns.length)];

    return adj + ' ' + noun;
  }

  function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  }

  function setCookie(name, value) {
    document.cookie= name + "=" + value + ";";
  }

  function loadTemplate(file, template, callback) {
    $.ajax({
      //async: false,
      url: '/templates/' + file + '.html',
      dataType: 'html',
      success: function(templateFile) {
        $('body').append(templateFile);

        var templateHTML = $('#template-' + template).html();
        var compiledTemplate = Handlebars.compile(templateHTML);

        callback(compiledTemplate);
      }
    });
  }

  function loadJibe() {
    $(function () {
      $("#jibe-container").jibe({
        template: "/templates/editor.html",
        defaultText: "Default text"
      });
    });
  }

  return {
    init: function () {
      var username = readCookie('username');

      if (!username) {

        // the user has not been here before
        // give/solicit a username, give some information

        username = generateUsername();
        setCookie('username', username);

        loadTemplate('demo_modals', 'username-modal', function (template) {
          var renderedTemplate = template({generated_username: username});

          $('body').append(renderedTemplate);
          $('body').children().last().modal()
            .on('shown.bs.modal', function(e) {
              $('#usernameField').focus();
            })
            .on('hidden.bs.modal', function (e) {
              $(this).remove();

              //loadJibe();
              location.reload();
            });

          $('#usernameModal .btn-primary').click(function (event) {
            var enteredUsername = $('#usernameField').val();

            if (enteredUsername) {
              username = enteredUsername;
            }

            setCookie('username', username);

            // TODO because of where jibe reads the cookie, this won't work
            //  at the moment ... it reads it before this gets set.
            //  Just reload the page for now, probably change jibe later.
            //$('#usernameModal').modal('hide');
            location.reload();
          });
        });
      } else {
        loadJibe();
      }
    }
  };
})();
