Vue.directive('focus', {
    inserted: function (el) {
      el.focus()
    }
});

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}
