var applicationState = {};

if(localStorage.state) {
    applicationState = JSON.parse(localStorage.state);
} else {
    applicationState.config = {
        enableSums: false,
        sums: [
            {
                id: '+10',
                title: '+ tot 10',
                enabled: true,
                maxScore: 60
            },
            {
                id: '-10',
                title: '- tot 10',
                enabled: true,
                maxScore: 60
            },
            {
                id: '+20',
                title: '+ tot 20 zonder brug',
                enabled: true,
                maxScore: 60
            },
            {
                id: '-20',
                title: '- tot 20 zonder brug',
                enabled: true,
                maxScore: 60
            },
            {
                id: '+20brug',
                title: '+ tot 20 met brug',
                enabled: true,
                maxScore: 60
            },
            {
                id: '-20brug',
                title: '- tot 20 met brug',
                enabled: true,
                maxScore: 60
            }
        ],
        enableTables: true,
        tables: [
            {
                arg: 1,
                enabled: true,
                maxScore: 60
            },
            {
                arg: 2,
                enabled: true,
                maxScore: 60
            },
            {
                arg: 3,
                enabled: false,
                maxScore: 60
            },
            {
                arg: 4,
                enabled: false,
                maxScore: 60
            },
            {
                arg: 5,
                enabled: true,
                maxScore: 60
            },
            {
                arg: 6,
                enabled: false,
                maxScore: 60
            },
            {
                arg: 7,
                enabled: false,
                maxScore: 60
            },
            {
                arg: 8,
                enabled: false,
                maxScore: 60
            },
            {
                arg: 9,
                enabled: false,
                maxScore: 60
            },
            {
                arg: 10,
                enabled: true,
                maxScore: 60
            }
        ],
        maxTimeInM: 1,
        maxNrOfErrors: 10,
    };
    applicationState.stats = {
        nrOfGamesPlayed: 0,
        highestScore: 0,
        playerWithHighestScore: ''
    }
}

function saveStateToStorage() {
    localStorage.state = JSON.stringify(applicationState);
}