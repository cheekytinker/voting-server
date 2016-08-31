import {List, Map, fromJS} from 'immutable';
import {expect} from 'chai';

import {setEntries, next, vote} from '../src/core';

describe('application logic', () => {

    describe('setEntries', () => {

        it('adds entries to the state', () => {
            const state = Map();
            const entries = List.of('tp', '28');
            const nextState = setEntries(state, entries);
            expect(nextState).to.equal(Map({
                entries: List.of(
                    'tp',
                    '28'
                )
            }));

        });

        it('converts to immutable', () => {
            const state = Map();
            const entries = ['tp', '28'];
            const nextState = setEntries(state, entries);
            expect(nextState).to.equal(Map({
                    entries: List.of(
                        'tp',
                        '28'
                    )
                }
            ))
        });
    });
    describe('next', () => {
        it('takes the next towo entries under vote', () => {
            const state = Map({
                entries: List.of('tp', '28', 'sun')
            });
            const nextState = next(state);
            expect(nextState).to.equal(Map({
                vote: Map({
                    pair: List.of('tp', '28')
                }),
                entries: List.of('sun')
            }));
        });

        it('puts winner of vote back to entries', () => {
            const state = fromJS({
                vote: {
                    pair: ['tp', '28'],
                    tally: {
                        'tp': 4,
                        '28': 2
                    }
                },
                entries: ['sun', 'mill', '127']
            });
            const nextState = next(state);
            expect(nextState).to.equal(fromJS({
                vote: {
                    pair: ['sun', 'mill']
                },
                entries: ['127', 'tp']
            }));
        });
        it('puts both from tied vote back into entries', () => {
            const state = fromJS({
                vote: {
                    pair: ['tp', '27'],
                    tally: {
                        'tp': 6,
                        '27': 6
                    }
                },
                entries: ['128', 'mill']
            });
            const nextState = next(state);
            expect(nextState).to.equal(fromJS({
                vote: {
                    pair: ['128', 'mill']
                },
                entries: ['tp', '27']
            }));
        });
    });

    describe('vote', () => {
        it('creates a tally for the voted entry', () => {
            const state = Map({
                vote: Map({
                    pair: List.of('tp', '28')
                }),
                entries: List()
            });
            const nextState = vote(state, 'tp');
            expect(nextState).to.equal(Map({
                vote: Map({
                    pair: List.of('tp', '28'),
                    tally: Map({
                        'tp': 1
                    })
                }),
                entries: List()
            }))
        });
    });

    it('add to the existing tall for the voted entry', () => {
        const state = fromJS({
            vote: {
                pair: ['tp', '28'],
                tally: {
                    'tp': 1,
                    '28': 5
                }
            },
            entries: []
        });
        const nextState = vote(state, 'tp');
        expect(nextState).to.equal(Map({
            vote: Map({
                pair: List.of('tp', '28'),
                tally: Map({
                    'tp': 2,
                    '28': 5
                })
            }),
            entries: List()

        }))
    });


});