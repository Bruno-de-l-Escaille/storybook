import zxcvbn from "zxcvbn";

export function validatePassword(password, userInputs) {
  let passwordValidator = new PasswordValidator();
  return passwordValidator.validate(password, userInputs);
}

/**
 * Contains rules for validating password
 *
 * Depends on zxcvbn
 * @link https://github.com/dropbox/zxcvbn
 */
var PasswordValidator = function (local) {
  var local =
    local && ["en_US", "fr_FR", "nl_BE"].includes(local) ? local : "en_US";

  var Obj = {
    /**
     * All messages with i18n support
     */
    messages: {
      en_US: {
        "The password is weak!": "", // Not in zxcvbn
        "Avoid personal information such as your name, email ...": "", // Not in zxcvbn
        "Use a few words, avoid common phrases": "",
        "No need for symbols, digits, or uppercase letters": "",
        "Add another word or two. Uncommon words are better.": "",
        "Straight rows of keys are easy to guess": "",
        "Short keyboard patterns are easy to guess": "",
        "Use a longer keyboard pattern with more turns": "",
        'Repeats like "aaa" are easy to guess': "",
        'Repeats like "abcabcabc" are only slightly harder to guess than "abc"':
          "",
        "Avoid repeated words and characters": "",
        "Sequences like abc or 6543 are easy to guess": "",
        "Avoid sequences": "",
        "Recent years are easy to guess": "",
        "Avoid recent years": "",
        "Avoid years that are associated with you": "",
        "Dates are often easy to guess": "",
        "Avoid dates and years that are associated with you": "",
        "This is a top-10 common password": "",
        "This is a top-100 common password": "",
        "This is a very common password": "",
        "This is similar to a commonly used password": "",
        "A word by itself is easy to guess": "",
        "Names and surnames by themselves are easy to guess": "",
        "Common names and surnames are easy to guess": "",
        "Capitalization doesn't help very much": "",
        "All-uppercase is almost as easy to guess as all-lowercase": "",
        "Reversed words aren't much harder to guess": "",
        "Predictable substitutions like '@' instead of 'a' don't help very much":
          "",
      },

      fr_FR: {
        "The password is weak!": "Le mot de passe est faible!", // Not in zxcvbn
        "Avoid personal information such as your name, email ...":
          "Evitez les informations personnelles telles que votre nom, votre email ...", // Not in zxcvbn
        "Use a few words, avoid common phrases":
          "Utilisez quelques mots, éviter des phrases courantes",
        "No need for symbols, digits, or uppercase letters":
          "Pas besoin de symboles, de chiffres ou de lettres majuscules",
        "Add another word or two. Uncommon words are better.":
          "Ajouter un autre mot ou deux. Les mots peu fréquents sont meilleurs.",
        "Straight rows of keys are easy to guess":
          "Les lignes droites de touches sont faciles à deviner",
        "Short keyboard patterns are easy to guess":
          "Les répétitions courtes de touches sont faciles à deviner",
        "Use a longer keyboard pattern with more turns":
          "Utiliser plus de caractères, avec plus de variation",
        'Repeats like "aaa" are easy to guess':
          'Les répétitions comme "aaa" sont faciles à deviner',
        'Repeats like "abcabcabc" are only slightly harder to guess than "abc"':
          'Les répétitions comme "abcabcabc" sont seulement un peu plus difficile à deviner que "abc"',
        "Avoid repeated words and characters":
          "Évitez les mots et les caractères répétés",
        "Sequences like abc or 6543 are easy to guess":
          "Les séquences comme abc ou 6543 sont faciles à deviner",
        "Avoid sequences": "Évitez les séquences",
        "Recent years are easy to guess":
          "Les années récentes, sont faciles à deviner",
        "Avoid recent years": "Évitez les dernières années",
        "Avoid years that are associated with you":
          "Évitez les années qui sont associées avec vous",
        "Dates are often easy to guess":
          "Les dates sont souvent faciles à deviner",
        "Avoid dates and years that are associated with you":
          "Évitez les dates et les années qui sont associées avec vous",
        "This is a top-10 common password":
          "Ce mot de passe fait partie du top-10 des mots de passe couramment utilisés",
        "This is a top-100 common password":
          "Ce mot de passe fait partie du top-100 des mots de passe couramment utilisés",
        "This is a very common password":
          "Ceci est un mot de passe très commun",
        "This is similar to a commonly used password":
          "Ceci est similaire à un mot de passe couramment utilisé",
        "A word by itself is easy to guess":
          "Un mot en lui-même est facile à deviner",
        "Names and surnames by themselves are easy to guess":
          "Les noms et prénoms par eux-mêmes sont faciles à deviner",
        "Common names and surnames are easy to guess":
          "Les noms et prénoms communs sont faciles à deviner",
        "Capitalization doesn't help very much":
          "Les majuscules n'aident pas beaucoup",
        "All-uppercase is almost as easy to guess as all-lowercase":
          "Tout en majuscules est presque aussi facile à deviner qu'en minuscules",
        "Reversed words aren't much harder to guess":
          "Les mots inversés ne sont pas plus difficile à deviner",
        "Predictable substitutions like '@' instead of 'a' don't help very much":
          "Les substitutions prévisibles comme '@' au lieu de 'a' n'aident pas beaucoup",
      },

      nl_BE: {
        "The password is weak!": "Het wachtwoord is zwak!", // Not in zxcvbn
        "Avoid personal information such as your name, email ...":
          "Vermijd persoonlijke informatie zoals uw naam, e-mail ...", // Not in zxcvbn
        "Use a few words, avoid common phrases":
          "Gebruik een paar woorden, vermijd voorkomende zinnen",
        "No need for symbols, digits, or uppercase letters":
          "Geen behoefte aan symbolen, cijfers of hoofdletters",
        "Add another word or two. Uncommon words are better.":
          "Voeg nog een woord of twee. Ongebruikelijke woorden zijn beter.",
        "Straight rows of keys are easy to guess":
          "Rechte rijen van de toetsen zijn makkelijk te raden",
        "Short keyboard patterns are easy to guess":
          "Kort toetsenbord patronen zijn makkelijk te raden",
        "Use a longer keyboard pattern with more turns":
          "Gebruik een groter toetsenbord patroon met meer bochten",
        'Repeats like "aaa" are easy to guess':
          'Herhalingen als "aaa" zijn makkelijk te raden',
        'Repeats like "abcabcabc" are only slightly harder to guess than "abc"':
          'Herhalingen zoals "abcabcabc" zijn slechts iets moeilijker te raden dan "abc"',
        "Avoid repeated words and characters":
          "Vermijd herhaalde woorden en tekens",
        "Sequences like abc or 6543 are easy to guess":
          "Sequenties zoals abc of 6543 zijn gemakkelijk te raden",
        "Avoid sequences": "Vermijd sequenties",
        "Recent years are easy to guess":
          "De afgelopen jaren zijn makkelijk te raden",
        "Avoid recent years": "Vermijd de afgelopen jaren",
        "Avoid years that are associated with you":
          "Vermijd jaar die worden geassocieerd met u",
        "Dates are often easy to guess": "Data zijn vaak makkelijk te raden",
        "Avoid dates and years that are associated with you":
          "Vermijd data en jaren die worden geassocieerd met u",
        "This is a top-10 common password":
          "Dit is een top-10 gemeenschappelijk wachtwoord",
        "This is a top-100 common password":
          "Dit is een top-100 gemeenschappelijk wachtwoord",
        "This is a very common password":
          "Dit is een veel voorkomende wachtwoord",
        "This is similar to a commonly used password":
          "Dit is vergelijkbaar met een algemeen gebruikte wachtwoord",
        "A word by itself is easy to guess":
          "Het woord zelf is makkelijk te raden",
        "Names and surnames by themselves are easy to guess":
          "Voor- en achternamen door zelf zijn makkelijk te raden",
        "Common names and surnames are easy to guess":
          "Populaire namen en achternamen zijn makkelijk te raden",
        "Capitalization doesn't help very much":
          "Kapitalisatie niet veel helpen",
        "All-uppercase is almost as easy to guess as all-lowercase":
          "All-in hoofdletters is bijna net zo makkelijk te raden als alle kleine letters",
        "Reversed words aren't much harder to guess":
          "Omgekeerde woorden zijn niet veel moeilijker te raden",
        "Predictable substitutions like '@' instead of 'a' don't help very much":
          "Voorspelbare vervangingen als '@' in plaats van 'a' niet erg veel helpen",
      },
    },

    /**
     * Validate password depending on other inputs
     *
     * @param {string} password
     * @param {array} userInputs eg. ['firstName', 'lastName', 'myEmail@gmail.com']
     *
     * @returns {Object.<{valid: Boolean, score: Integer, strength: Integer, message: String}>}
     */
    validate: function (password, userInputs) {
      var localMessages = this.messages[local];

      var inputsExploded = userInputs.slice(0); // Copy original array

      for (var i = 0; i < userInputs.length; i++) {
        var input = userInputs[i] || "";
        Array.prototype.push.apply(
          inputsExploded,
          input.split(/[\s,@.'"()_-]+/)
        );
      }

      var result = zxcvbn(password, inputsExploded);

      var message =
        localMessages["The password is weak!"] || "The password is weak!"; // Default message

      if (inputsExploded.includes(password)) {
        message =
          localMessages[
            "Avoid personal information such as your name, email ..."
          ] || "Avoid personal information such as your name, email ...";
      } else if (
        "feedback" in result &&
        "warning" in result.feedback &&
        result.feedback.warning.trim() !== ""
      ) {
        message =
          localMessages[result.feedback.warning] || result.feedback.warning;
      } else if (
        "feedback" in result &&
        "suggestions" in result.feedback &&
        result.feedback.suggestions.length > 0
      ) {
        message = "";
        for (var i = 0; i < result.feedback.suggestions.length; i++) {
          message +=
            " " +
            (localMessages[result.feedback.suggestions[i]] ||
              result.feedback.suggestions[i]);
        }
      }

      return {
        valid: result.score > 1,
        score: result.score,
        strength: result.score * 25, // 4 = 100%
        message: message,
      };
    },
  };

  return Obj;
};
