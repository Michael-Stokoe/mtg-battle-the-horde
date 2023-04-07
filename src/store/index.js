import { createStore } from 'vuex';
import deckList from '../decklist.json';

const store = createStore({
    state: () => ({
        library: [],
        boardState: [],
        graveyard: [],
        turn: 0,
        cardsPlayedThisTurn: [],
    }),
    getters: {
        library (state) {
            return state.library;
        },
        turn (state) {
            return state.turn;
        },
        remainingCards (state) {
            return state.library.length;
        },
        boardCreatures (state) {
            return state.boardState.filter((card) => {
                return card.type === 'Creature';
            });
        },
        boardArtifacts (state) {
            return state.boardState.filter((card) => {
                return card.type === 'Artifact';
            });
        },
        graveyard (state) {
            return state.graveyard;
        },
        cardsPlayedThisTurn (state) {
            return state.cardsPlayedThisTurn;
        },
    },
    actions: {
        loadDeck (context) {
            let library = [];

            let x = 0;
            deckList.forEach((card) => {
                for (var i = 0; i < card.count; i++) {
                    let tapped = false;

                    if (card.type === 'Creature') {
                        if (card.name === 'Mogis\'s Chosen') {
                            tapped = true;
                        }
                    }

                    library[x] = ({
                        "index": x,
                        "name": card.name,
                        "type": card.type,
                        "image": card.image,
                        "tapped": tapped,
                        "power": card.power,
                        "originalPower": card.power,
                        "toughness": card.toughness,
                        "originalToughness": card.toughness,
                        "deathTouch": false,
                        "firstStrike": false,
                        "menace": false,
                        "inGraveyard": false,
                    });

                    x++;
                }
            });

            context.commit('loadLibrary', library);
        },
        shuffle (context) {
            context.commit('shuffle');
        },
        handleMainPhase (context) {
            context.commit('handleMainPhase');
        },
        startAttackPhase (context) {
            context.commit('startAttackPhase');
        },
        handleEndStep (context) {
            context.commit('handleEndStep');
        },
        cleanUp (context) {
            context.commit('cleanUp');
        },
        destroyCard (context, index) {
            context.commit('destroyCard', index);
        },
        dealDamage (context, damage) {
            context.commit('dealDamage', damage);
        }
    },
    mutations: {
        loadLibrary (state, library) {
            state.library = library;
        },
        shuffle (state) {
            let cards = Object.assign(state.library, []);

            for (var i = cards.length - 1; i > 0; i--) { 
                var j = Math.floor(Math.random() * (i + 1));
                           
                var temp = cards[i];
                cards[i] = cards[j];
                cards[j] = temp;
            }

            
            state.library = cards;
        },
        handleMainPhase (state) {
            let library = Object.assign(state.library, []);
            let boardState = Object.assign(state.boardState, []);
            let graveyard = Object.assign(state.graveyard, []);
            let cardsPlayedThisTurn = [];
            state.cardsPlayedThisTurn = [];
            
            let cardsToPlay = 2;

            boardState.forEach((card) => {
                if (card.type === 'Artifact') {
                    cardsToPlay++;
                }

                if (card.type === 'Creature') {
                    card.tapped = false;
                    card.firstStrike = false;
                    card.deathTouch = false;
                    card.menace = false;
                    card.power = card.originalPower;
                    card.toughness = card.originalToughness;
                }
            });

            if (state.library.length < cardsToPlay) {
                cardsToPlay = state.library.length;
            }

            for (var i = 0; i < cardsToPlay; ++i) {
                let card = library[i];

                if (card.type === 'Sorcery') {
                    card.inGraveyard = true;
                    graveyard.push(card);
                } else {
                    boardState.push(card);
                }

                cardsPlayedThisTurn.push(card);
            }

            state.cardsPlayedThisTurn = cardsPlayedThisTurn;
            state.boardState = boardState;
            state.library = library.splice(cardsToPlay, library.length);

            state.turn = state.turn + 1;
        },
        startAttackPhase (state) {
            let boardState = Object.assign(state.boardState, []);
            let graveyard = Object.assign(state.graveyard, []);
            let played = state.cardsPlayedThisTurn;

            boardState.forEach((card) => {
                if (card.type === 'Creature') {
                    card.tapped = true;
                }
            });

            let interventionsPlayed = played.filter((card) => {
                return card.name === 'Intervention of Keranos';
            }).length;

            let unquenchablePlayed = played.filter(card => {
                return card.name === 'Unquenchable Fury';
            }).length > 0;

            let descendPlayed = played.filter(card => {
                return card.name === 'Descend on the Prey';
            }).length > 0;

            let touchPlayed = played.filter(card => {
                return card.name === 'Touch of the Horned God';
            }).length > 0;

            let consumingRagesPlayed = played.filter(card => {
                return card.name === 'Consuming Rage';
            }).length;

            if (interventionsPlayed > 0) {
                let damageToCreatures = 3 * interventionsPlayed;

                let toRemove = [];

                boardState.forEach((card) => {
                    if (card.type === 'Creature' && (damageToCreatures >= card.toughness)) {
                        card.inGraveyard = true;
                        graveyard.push(card);
                        toRemove.push(card);

                        card.tapped = false;
                    }
                });

                toRemove.forEach(card => {
                    boardState.splice(boardState.indexOf(card), 1);
                });
            }

            if (unquenchablePlayed) {
                boardState.forEach(card => {
                    if (card.type === 'Creature') {
                        card.menace = true;
                    }
                });
            }

            if (descendPlayed) {
                boardState.forEach(card => {
                    if (card.type === 'Creature') {
                        card.firstStrike = true;
                    }
                });
            }

            if (touchPlayed) {
                boardState.forEach(card => {
                    if (card.type === 'Creature') {
                        card.deathTouch = true;
                    }
                });
            }

            if (consumingRagesPlayed > 0) {
                boardState.forEach(card => {
                    if (card.type === 'Creature') {
                        let powerIncrease = 2 * consumingRagesPlayed;
                        card.power = card.power + powerIncrease;
                    }
                });
            }

            state.boardState = boardState;
            state.graveyard = graveyard;
        },
        handleEndStep (state) {
            
        },
        destroyCard (state, index) {
            let boardState = Object.assign(state.boardState, []);
            let graveyard = Object.assign(state.graveyard, []);

            let card = boardState.filter(card => card.index === index)[0];
            console.log(card);
            card.tapped = false;
            card.inGraveyard = true;
            graveyard.push(card);
            boardState.splice(boardState.indexOf(card), 1);

            state.boardState = boardState;
            state.graveyard = graveyard;
        },
        cleanUp (state) {
            let boardState = Object.assign(state.boardState, []);
            let graveyard = Object.assign(state.graveyard, []);
            let played = state.cardsPlayedThisTurn;

            let x = 0;
            let toRemove = [];

            let consumingRagePlayed = played.filter(card => {
                return card.name === 'Consuming Rage';
            }).length > 0;

            boardState.forEach((card) => {
                if (card.type === 'Creature' && (card.name === 'Reckless Minotaur' || consumingRagePlayed)) {
                    toRemove.push(card);
                    card.tapped = false;
                    card.menace = false;
                    card.firstStrike = false;
                    card.deathTouch = false;
                    card.inGraveyard = true;
                    graveyard.push(card);
                }
            });

            toRemove.forEach(card => {
                boardState.splice(boardState.indexOf(card), 1);
            });

            state.boardState = boardState;
            state.graveyard = graveyard;
        },
        dealDamage (state, damage) {
            let library = Object.assign(state.library, []);
            let graveyard = Object.assign(state.graveyard, []);

            let cardsForGraveyard = library.splice(0, damage);
            cardsForGraveyard.forEach(card => {
                card.tapped = false;
                card.inGraveyard = true;
                graveyard.push(card);
            });

            state.library = library;
            state.graveyard = graveyard;
        }
    },
});

export default store;