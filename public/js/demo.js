var Demo = (function () {
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
      console.log('loadjibe');
      $("#jibe-container").jibe({
        template: "/templates/editor.html",
        defaultText: "Default text"
      });
    });
  }

  return {
    init: function () {
      console.log('init');
      var username = readCookie('username');

      if (!username) {

        // the user has not been here before
        // give/solicit a username, give some information

        // TODO generate better prepopulated usernames
        username = 'suggested_username';
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
