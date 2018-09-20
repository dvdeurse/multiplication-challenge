new Vue({
    el: '#app',
    data: {
        mode: 0,
        title: 'Tafels van vermenigvulding',
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
            if(this.mode == 1 && mode !== 1) {
                saveStateToStorage()
            }
            this.mode = mode;
        }
    }
});