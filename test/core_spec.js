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