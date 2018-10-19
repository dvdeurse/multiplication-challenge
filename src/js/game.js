Vue.component('game', {
    data: function() {
        return {
            state: applicationState,
            playerName: '',
            mode: 0,

            exercise: {},
            showError: false,
            answer: null,
            previousAnswer: null,
            totalScore: 0,
            nrOfErrors: 0,
            nrOfExercisesCorrect: 0,

            timeLeft: '',
            deadlineApproaching: false,
            interval: undefined,
            scoreInterval: undefined
        };
    },
    computed: {
        tables: function() {
            return this.state.config.tables.filter(function(x) {
                return x.enabled;
            });
        },
        sums: function() {
            return this.state.config.sums.filter(function(x) {
                return x.enabled;
            });
        }        
    },
    methods: {
        startGame: function() {
            this.mode = 1;
            this.next();        
            this.startTimer(this.state.config.maxTimeInM*60);
        },
        startTimer: function (duration) {
            var timer = duration, minutes, seconds;
            this.deadlineApproaching = false;
            var that = this;
            function setTime() {
                minutes = parseInt(timer / 60, 10)
                seconds = parseInt(timer % 60, 10);        
                that.deadlineApproaching = minutes === 0 && seconds <= 10;    
                minutes = minutes < 10 ? '0' + minutes : minutes;
                seconds = seconds < 10 ? '0' + seconds : seconds;
                that.timeLeft = minutes + ':' + seconds;
                if (--timer < 0) {
                    that.endGame();
                }
            }
            setTime();
            this.interval = setInterval(setTime, 1000);            
        },  
        startScoreCounter: function() {
            if(this.scoreInterval) {
                clearInterval(this.scoreInterval);
            }
            var that = this;
            this.scoreInterval = setInterval(function() {
                that.exercise.score -= 5;
                if(that.exercise.score == 0) {
                    clearInterval(that.scoreInterval);
                }
            }, 1000);
        },  
        evaluate: function() {
            if(this.answer === this.previousAnswer) {
                return;
            }
            this.previousAnswer = this.answer;
            var correctAnswer;
            switch(this.exercise.operator) {
                case 'x':
                    correctAnswer = this.exercise.left * this.exercise.right;
                    break;
                case '+':
                    correctAnswer = this.exercise.left + this.exercise.right;
                    break;
                case '-':
                    correctAnswer = this.exercise.left - this.exercise.right;
                    break;            
            }            
            var answerGiven = parseInt(this.answer);
            if(correctAnswer === answerGiven) {                
                this.totalScore += this.exercise.score;
                this.nrOfExercisesCorrect++;
                this.$refs.answerInput.$el.blur();
                this.next();
            } else {
                this.showError = true;
                this.nrOfErrors++;
            }
            this.exercise.evaluated = true;
            if(this.nrOfErrors >= this.state.config.maxNrOfErrors) {
                this.endGame();
            }
        },
        next: function() {
            if(this.$refs.answerInput) {
                this.$refs.answerInput.$el.focus();
            }
            this.answer = null;
            this.previousAnswer = null;

            var modes = [];
            if(this.state.config.enableSums) {
                modes.push('sums');
            }
            if(this.state.config.enableTables) {
                modes.push('tables');
            }
            var modeIndex = randomInt(0, modes.length);
            var mode = modes[modeIndex];
            switch(mode) {
                case 'sums':
                    var sumIndex = randomInt(0, this.sums.length);
                    switch(this.sums[sumIndex].id) {
                        case '+10':
                            this.exercise.operator = '+';
                            this.exercise.left = randomInt(0, 11);
                            this.exercise.right = randomInt(0, 11 - this.exercise.left);
                            break;
                        case '-10':
                            this.exercise.operator = '-';
                            this.exercise.left = randomInt(0, 11);
                            this.exercise.right = randomInt(0, this.exercise.left + 1);
                            break;
                        case '+20':
                            this.exercise.operator = '+';
                            this.exercise.left = randomInt(1, 20);
                            var lowerBound = this.exercise.left < 10 ? 10 : 1
                            var upperBound = 20 - this.exercise.left;
                            this.exercise.right = randomInt(lowerBound, upperBound + 1);
                            break;
                        case '-20':
                            this.exercise.operator = '-';
                            this.exercise.left = randomInt(11, 21);
                            var candidates = [randomInt(10, this.exercise.left), randomInt(1, this.exercise.left-10)];
                            this.exercise.right = candidates[randomInt(0, candidates.length)];
                            break;
                        case '+20brug':
                            this.exercise.operator = '+';
                            this.exercise.left = randomInt(2, 10);
                            var lowerBound = 11 - this.exercise.left;
                            var upperBound = 9;
                            this.exercise.right = randomInt(lowerBound, upperBound + 1);
                            break;
                        case '-20brug':
                            this.exercise.operator = '-';
                            this.exercise.left = randomInt(11, 19);
                            var lowerBound = this.exercise.left - 9;
                            var upperBound = 9;
                            this.exercise.right = randomInt(lowerBound, upperBound + 1);
                            break;
                    }
                    this.exercise.score = this.sums[sumIndex].maxScore;    
                    break;
                case 'tables': 
                    var step = randomInt(1, 11);
                    var tableIndex = randomInt(0, this.tables.length);            
                    this.exercise.operator = 'x';
                    this.exercise.left = step;
                    this.exercise.right = this.tables[tableIndex].arg;
                    this.exercise.score = this.tables[tableIndex].maxScore;    
                    break;
            } 
            this.showError = false;
            this.startScoreCounter();
        },
        nameInputKeydownHandler: function(event) {
            if (event.which === 13) {
               this.startGame();
            }
        },
        answerInputKeydownHandler: function(event) {
            if (event.which === 13) {
               this.evaluate();
            }
        },
        endGame: function() {
            clearInterval(this.interval);
            clearInterval(this.scoreInterval);
            this.state.stats.nrOfGamesPlayed++;
            if(this.state.stats.highestScore < this.totalScore) {
                this.state.stats.highestScore = this.totalScore;
                this.state.stats.playerWithHighestScore = this.playerName;
            }
            saveStateToStorage()
            this.mode = 2;            
        },
        retry: function() {
            this.playerName = '';
            this.totalScore = 0;
            this.showError = false;
            this.nrOfErrors = 0;
            this.nrOfExercisesCorrect = 0;
            this.mode = 0;
        }
    },
    template:`
    <b-container fluid>
        <div v-if="mode == 0" class="text-center">
            <h2 style="margin-bottom: 60px;">Start een nieuw spel</h2>
            <b-form-input autofocus v-focus class="mt-3" type="text" v-model="playerName" placeholder="Naam" style="text-align: center;" @keydown.native="nameInputKeydownHandler"></b-form-input>
            <b-button class="mt-5" size="lg" variant="primary" @click="startGame()">Start</b-button>            
        </div>
        <div v-if="mode == 1">
            <b-row>
                <b-col offset-sm="9" sm="3">
                    <div :class="[{'border-danger': deadlineApproaching}, {'border-dark': !deadlineApproaching}, 'border', 'border-5', 'pt-2', 'pb-2', 'pl-3', 'pr-3', 'float-right']"
                        style="width: 90px; text-align: center;">
                        <span :class="{'text-danger': deadlineApproaching}">{{timeLeft}}</span>
                    </div>                    
                </b-col>
            </b-row>
            <b-row style="font-size: 50pt; text-align: right; margin-top: 100px;">
                <b-col sm="4">
                    <div>{{exercise.left}} {{exercise.operator}} {{exercise.right}}</div>
                </b-col>
                <b-col style="text-align: center;" sm="1">
                    <div>=</div>    
                </b-col>
                <b-col sm="4">
                    <b-form-input v-focus ref="answerInput" type="number" v-model="answer" style="text-align: center; font-size: 50pt; height: 100px; margin-top: 0px;" @keydown.native="answerInputKeydownHandler"></b-form-input>
                </b-col>
                <b-col sm="3"><div v-if="showError" style="font-size: 30pt; color: red; margin-top: 20px;">Fout!</div></b-col>
            </b-row>
            <b-row style="margin-top: 150px;">
                <b-col sm="4">
                    <div class="border border-dark pt-2 pb-2 pl-3 pr-3 text-center" style="margin-top: 1px;">
                        Te verdienen: {{exercise.score}}
                    </div>
                </b-col>    
                <b-col sm="4">
                    <div class="border border-dark pt-2 pb-2 pl-3 pr-3 text-center" style="margin-top: 1px;">
                        {{playerName}}
                    </div>
                </b-col>    
                <b-col sm="4">
                    <div class="border border-dark pt-2 pb-2 pl-3 pr-3 text-center" style="margin-top: 1px;">
                        Totaal: {{totalScore}}
                    </div>
                </b-col>    
            </b-row>
        </div>
        <div v-if="mode == 2">
            <b-row>
                <b-col class="text-center">
                    <h3>GAME OVER</h3>
                </b-col>
            </b-row>
            <b-row class="mt-4">
                <b-col offset-sm="2" cols="8">
                    <table align="center" class="result">
                        <tr>
                            <td>Speler</td><td class="text-right">{{playerName}}</td>
                        </tr>
                        <tr>
                            <td>Score</td><td class="text-right">{{totalScore}}</td>
                        </tr>
                        <tr>
                            <td>Aantal oefeningen juist</td><td class="text-right">{{nrOfExercisesCorrect}}</td>
                        </tr>
                        <tr>
                            <td>Aantal oefeningen fout</td><td class="text-right">{{nrOfErrors}}</td>
                        </tr>
                    </table>
                </b-col>
            </b-row>
            <b-row>
                <b-col class="text-center">
                    <b-button class="mt-5" size="lg" variant="primary" @click="retry()">Opnieuw spelen</b-button>
                </b-col>
            </b-row>
        </div>
    </b-container>
    `
});