Vue.component('settings', {
    data: function() {
        return {
            state: applicationState
        };
    },
    methods: {
        getTableTitle: function(index) {
            return 'De tafel van ' + (index+1);
        }
    },
    template:`
    <b-container fluid>
        <b-row class="mt-1">
            <b-col>
                <label>Duurtijd van het spel (minuten):</label>
            </b-col>
            <b-col>
                <b-form-input type="number" v-model="state.config.maxTimeInM"></b-form-input>
            </b-col>
        </b-row>
        <b-row class="mt-1">
            <b-col>
                <label>Maximum aantal fouten:</label>
            </b-col>
            <b-col>
                <b-form-input type="number" v-model="state.config.maxNrOfErrors"></b-form-input>
            </b-col>
        </b-row>
        <b-row class="mt-1">
            <b-col>
                <b-form horizontal>        
                    <b-form-checkbox v-model="state.config.resetOnError">Wis bij fout?</b-form-checkbox>
                </b-form>
            </b-col>
        </b-row>
        <b-row class="mt-2">
            <b-col>
                <b-form horizontal>        
                    <b-form-checkbox v-model="state.config.enableSums">Sommen?</b-form-checkbox>
                </b-form>
            </b-col>            
        </b-row>
        <b-list-group class="mt-3" v-if="state.config.enableSums">
            <b-list-group-item v-for="(item, i) in state.config.sums" :key="i">
                <b-row><h5>{{item.title}}</h5></b-row>
                <b-row>
                    <b-col>
                        <b-form horizontal>        
                            <b-form-checkbox
                                v-model="item.enabled">gebruikt in het spel?
                            </b-form-checkbox>
                        </b-form>
                    </b-col>
                    <b-col>        
                        <b-form inline>                        
                            <label>maximum score:</label>&nbsp;&nbsp;
                            <b-form-input type="number" v-model="item.maxScore"></b-form-input>                        
                        </b-form>
                    </b-col>
                </b-row>    
            </b-list-group-item>
        </b-list-group>
        <b-row class="mt-3">
            <b-col>
                <b-form horizontal>        
                    <b-form-checkbox v-model="state.config.enableTables">Tafels?</b-form-checkbox>
                </b-form>
            </b-col>            
        </b-row>
        <b-list-group class="mt-3" v-if="state.config.enableTables">
            <b-list-group-item v-for="(item, i) in state.config.tables" :key="i">
                <b-row><h5>De tafel van {{i+1}}</h5></b-row>
                <b-row>
                    <b-col>
                        <b-form horizontal>        
                            <b-form-checkbox
                                v-model="item.enabled">gebruikt in het spel?
                            </b-form-checkbox>
                        </b-form>
                    </b-col>
                    <b-col>        
                        <b-form inline>                        
                            <label>maximum score:</label>&nbsp;&nbsp;
                            <b-form-input type="number" v-model="item.maxScore"></b-form-input>                        
                        </b-form>
                    </b-col>
                </b-row>    
            </b-list-group-item>
        </b-list-group>
    </b-container>
    `
});