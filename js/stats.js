Vue.component('stats', {
    data: function() {
        return {
            state: applicationState
        };
    },
    template:`
    <b-container fluid>
        <p>Aantal games gespeeld: {{state.stats.nrOfGamesPlayed}}</p>
        <p>Hoogste score: {{state.stats.highestScore}}</p>
        <p>Speler met hoogste score: {{state.stats.playerWithHighestScore}}</p>
    </b-container>    
    `
});