new Vue({
    el: '#app',
    data: {
        mode: 0,
        title: 'Tafelspel',
        menu: [
            { title: 'Spelen' },
            { title: 'Instellingen' },
            { title: 'Statistieken' }
        ]
    },
    computed: {
        gameTitle: function() {
            return this.title + ' - ' + this.menu[this.mode].title;
        }        
    },
    methods: {
        switchMode: function(mode) {
            this.mode = mode;
        }
    }
});