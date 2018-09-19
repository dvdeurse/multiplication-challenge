Vue.component('stats', {
    data: function() {
        return {
            state: applicationState
        };
    },
    template:`
    <b-container fluid>
        <b-row>
            <b-col offset-sm="2" cols="8">
                <table align="center" class="result">
                    <tr>
                        <td>Aantal games gespeeld</td><td class="text-right">{{state.stats.nrOfGamesPlayed}}</td>
                    </tr>
                    <tr>
                        <td>Hoogste score</td><td class="text-right">{{state.stats.highestScore}}</td>
                    </tr>
                    <tr>
                        <td>Speler met hoogste score</td><td class="text-right">{{state.stats.playerWithHighestScore}}</td>
                    </tr>
                </table>
            </b-col>    
        </b-row>
    </b-container>    
    `
});