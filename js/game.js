Vue.component('game', {
    data: function() {
        return {
            state: applicationState,
            playerName: '',
            mode: 0,

            exercise: {},
            answer: null,
            previousAnswer: null,
            totalScore: 0,
            nrOfErrors: 0,
            nrOfExercisesCorrect: 0,

            timeLeft: '',
            deadlineApproaching: false,
            interval: undefined            
        };
    },
    computed: {
        tables: function() {
            return this.state.config.tables.filter(function(t) {
                return t.enabled;
            });
        }        
    },
    methods: {
        startGame: function() {
            this.mode = 1;
            this.next();        
            this.startTimer(this.state.config.maxTimeInM*60);
            
        },
        startTimer: function startTimer(duration) {
            var timer = duration, minutes, seconds;
            this.deadlineApproaching = false;
            var that = this;
            function setTime() {
                minutes = parseInt(timer / 60, 10)
                seconds = parseInt(timer % 60, 10);        
                that.deadlineApproaching = minutes === 0 && seconds <= 50;    
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
        evaluate: function() {
            if(this.answer === this.previousAnswer) {
                return;
            }
            this.previousAnswer = this.answer;
            var correctAnswer = this.exercise.left * this.exercise.right;
            var answerGiven = parseInt(this.answer);
            if(correctAnswer === answerGiven) {                
                this.totalScore += this.exercise.score;
                this.nrOfExercisesCorrect++;
                this.$set(this.exercise, 'correct', true);                    
                this.$refs.answerInput.$el.blur();
                this.next();
            } else {
                this.$set(this.exercise, 'correct', false);
                this.nrOfErrors++;
            }
            this.$set(this.exercise, 'evaluated', true);

            //TODO: wait a brief moment here to continue (?)

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
            var step = 1 + Math.floor(Math.random() * 10);
            var tableIndex = Math.floor(Math.random() * this.tables.length);
            this.$set(this.exercise, 'left', step);
            this.$set(this.exercise, 'right', this.tables[tableIndex].arg);
            this.$set(this.exercise, 'score', this.tables[tableIndex].maxScore);
            this.$set(this.exercise, 'evaluated', false);
            this.$set(this.exercise, 'correct', false);
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
            this.mode = 2;            
        }
    },
    template:`
    <b-container fluid>
        <div v-if="mode == 0" class="text-center">
            <h2>Start een nieuw spel</h2>
            <b-form-input autofocus class="mt-3" type="text" v-model="playerName" placeholder="Naam" style="text-align: center;" @keydown.native="nameInputKeydownHandler"></b-form-input>
            <b-button class="mt-3" size="lg" variant="primary" @click="startGame()">Start</b-button>            
        </div>
        <div v-if="mode == 1">
            <b-row>
                <b-col sm="3">
                    <div class="border border-dark pt-2 pb-2 pl-3 pr-3" style="margin-top: 1px;">
                        Speler: {{playerName}}
                    </div>
                </b-col>
                <b-col offset-sm="6" sm="3">
                    <div :class="[{'border-danger': deadlineApproaching}, {'border-dark': !deadlineApproaching}, 'border', 'border-5', 'pt-2', 'pb-2', 'pl-3', 'pr-3', 'float-right']"
                        style="width: 90px; text-align: center;">
                        <span :class="{'text-danger': deadlineApproaching}">{{timeLeft}}</span>
                    </div>                    
                </b-col>
            </b-row>
            <b-row style="font-size: 50pt; text-align: right; margin-top: 40px;">
                <b-col sm="5">
                    <div>{{exercise.left}} x {{exercise.right}}</div>
                </b-col>
                <b-col style="text-align: center;" sm="1">
                    <div>=</div>    
                </b-col>
                <b-col sm="4">
                    <b-form-input v-focus ref="answerInput" type="number" v-model="answer" style="text-align: center; font-size: 50pt; height: 100px; margin-top: 0px;" @keydown.native="answerInputKeydownHandler"></b-form-input>
                </b-col>
                <b-col sm="2"></b-col>
            </b-row>
            <b-row>
                <b-col>
                </b-col>
            </b-row>
        </div>
        <div v-if="mode == 2">
            <b-row>
                <b-col>
                    <h3>GAME OVER</h3>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <p>Speler: {{playerName}}</p>
                    <p>Score: {{totalScore}}</p>
                    <p>Aantal oefeningen juist: {{nrOfExercisesCorrect}}</p>
                    <p>Aantal oefeningen fout: {{nrOfErrors}}</p>
                </b-col>
            </b-row>
        </div>
    </b-container>
    `
});