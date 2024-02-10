/* eslint-disable max-len */
/* eslint-disable max-lines */
import assert from 'node:assert';
import { IOperationData, TTestUnit } from '../../../types/types';

/* event
  date: '2024-01-11T13:52:29.000Z',
  event_id: 2,
  event_type: 'CONNECT_VOTE',
  from_node_id: 3,
  message: 'Учасника вашого кола обрано координатором',
  net_id: 1,
  net_view: 'circle',
  user_id: state.user.user_id,
*/

export const voteForMembers: TTestUnit = (state: any) => (
  {
    title: 'read events on vote for circle member',
    operations: [
      {
        name: '/events/read',
        params: {},
        setToState: (actual) => state.events = actual,
        expected: (actual) => {
          const event = actual[0];
          assert.deepEqual([{
            event_type: event.event_type,
            message: event.message,
            net_view: event.net_view,
            user_id: event.user_id,
          }], [{
            event_type: 'CONNECT_VOTE',
            message: 'Учасника вашого кола обрано координатором',
            net_view: 'circle',
            user_id: state.user.user_id,
          }]);
        },
      },
      {
        name: '/events/confirm',
        params: () => ({
          user_id: state.user.user_id,
          event_id: state.events.shift().event_id,
        }),
      },
    ] as IOperationData[],
  });

export const voteForMembersInTree: TTestUnit = (state: any) => (
  {
    title: 'read events on vote for circle member',
    operations: [
      {
        name: '/events/read',
        params: {},
        setToState: (actual) => state.events = actual,
        expected: (actual) => {
          let event = actual[0];
          assert.deepEqual([{
            event_type: event.event_type,
            message: event.message,
            net_view: event.net_view,
            user_id: event.user_id,
          }], [{
            event_type: 'LEAVE_VOTE',
            message: 'Ваш координатор від\'єднався через вибори',
            net_view: 'circle',
            user_id: state.user.user_id,
          }]);

          event = actual[1];
          assert.deepEqual([{
            event_type: event.event_type,
            message: event.message,
            net_view: event.net_view,
            user_id: event.user_id,
          }], [{
            event_type: 'CONNECT_DISVOTE',
            message: 'У вас новий координатор через вибори в колі вашого координатора',
            net_view: 'circle',
            user_id: state.user.user_id,
          }]);
        },
      },
      {
        name: '/events/confirm',
        params: () => ({
          user_id: state.user.user_id,
          event_id: state.events.shift().event_id,
        }),
      },
      {
        name: '/events/confirm',
        params: () => ({
          user_id: state.user.user_id,
          event_id: state.events.shift().event_id,
        }),
      },
    ] as IOperationData[],
  });

export const voteForMembersInCircle: TTestUnit = (state: any) => (
  {
    title: 'read events on vote for circle member',
    operations: [
      {
        name: '/events/read',
        params: {},
        setToState: (actual) => state.events = actual,
        expected: (actual) => {
          let event = actual[0];
          assert.deepEqual([{
            event_type: event.event_type,
            message: event.message,
            net_view: event.net_view,
            user_id: event.user_id,
          }], [{
            event_type: 'LEAVE_DISVOTE',
            message: 'Учасник вашого кола від\'єднався через вибори в його дереві',
            net_view: 'circle',
            user_id: state.user.user_id,
          }]);

          event = actual[1];
          assert.deepEqual([{
            event_type: event.event_type,
            message: event.message,
            net_view: event.net_view,
            user_id: event.user_id,
          }], [{
            event_type: 'CONNECT_VOTE',
            message: 'У вашому колі новий учасник, якого обрали координатором в його колі',
            net_view: 'circle',
            user_id: state.user.user_id,
          }]);
        },
      },
      {
        name: '/events/confirm',
        params: () => ({
          user_id: state.user.user_id,
          event_id: state.events.shift().event_id,
        }),
      },
      {
        name: '/events/confirm',
        params: () => ({
          user_id: state.user.user_id,
          event_id: state.events.shift().event_id,
        }),
      },
    ] as IOperationData[],
  });

export const voteForConnectedInCircle: TTestUnit = (state: any) => (
  {
    title: 'read events on vote for connected member in circle',
    operations: [
      {
        name: '/events/read',
        params: {},
        setToState: (actual) => state.events = actual,
        expected: (actual) => {
          const event = actual[0];
          assert.deepEqual([{
            event_type: event.event_type,
            message: event.message.slice(0, 25),
            net_view: event.net_view,
            user_id: event.user_id,
          }], [{
            event_type: 'LEAVE_DISVOTE',
            message: 'Вас від\'єднано від мережі', // ... через вибори координатора
            net_view: null,
            user_id: state.user.user_id,
          }]);
        },
      },
      {
        name: '/events/confirm',
        params: () => ({
          user_id: state.user.user_id,
          event_id: state.events.shift().event_id,
        }),
      },
    ] as IOperationData[],
  });

export const voteForConnectedInTree: TTestUnit = (state: any) => (
  {
    title: 'read events on vote for connected member in circle',
    operations: [
      {
        name: '/events/read',
        params: {},
        setToState: (actual) => state.events = actual,
        expected: (actual) => {
          const event = actual[0];
          assert.deepEqual([{
            event_type: event.event_type,
            message: event.message.slice(0, 25),
            net_view: event.net_view,
            user_id: event.user_id,
          }], [{
            event_type: 'LEAVE_VOTE',
            message: 'Вас від\'єднано від мережі', // ... через вибори координатора
            net_view: null,
            user_id: state.user.user_id,
          }]);
        },
      },
      {
        name: '/events/confirm',
        params: () => ({
          user_id: state.user.user_id,
          event_id: state.events.shift().event_id,
        }),
      },
    ] as IOperationData[],
  });

export const voteForVoteMember: TTestUnit = (state: any) => (
  {
    title: 'read events on vote for vote member',
    operations: [
      {
        name: '/events/read',
        params: {},
        setToState: (actual) => state.events = actual,
        expected: (actual) => {
          const event = actual[0];
          assert.deepEqual([{
            event_type: event.event_type,
            message: event.message,
            net_view: event.net_view,
            user_id: event.user_id,
          }], [{
            event_type: 'CONNECT_VOTE',
            message: 'Вас обрано координатором',
            net_view: 'net',
            user_id: state.user.user_id,
          }]);
        },
      },
      {
        name: '/events/confirm',
        params: () => ({
          user_id: state.user.user_id,
          event_id: state.events.shift().event_id,
        }),
      },
    ] as IOperationData[],
  });

export const voteForDisvoteMember: TTestUnit = (state: any) => (
  {
    title: 'read events on vote for disvote member',
    operations: [
      {
        name: '/events/read',
        params: {},
        setToState: (actual) => state.events = actual,
        expected: (actual) => {
          let event = actual[0];
          assert.deepEqual([{
            event_type: event.event_type,
            message: event.message,
            net_view: event.net_view,
            user_id: event.user_id,
          }], [{
            event_type: 'CONNECT_VOTE',
            message: 'Учасника вашого кола обрано координатором',
            net_view: 'circle',
            user_id: state.user.user_id,
          }]);

          event = actual[1];
          assert.deepEqual([{
            event_type: event.event_type,
            message: event.message,
            net_view: event.net_view,
            user_id: event.user_id,
          }], [{
            event_type: 'CONNECT_DISVOTE',
            message: 'Вас переобрано',
            net_view: 'net',
            user_id: state.user.user_id,
          }]);
        },
      },
      {
        name: '/events/confirm',
        params: () => ({
          user_id: state.user.user_id,
          event_id: state.events.shift().event_id,
        }),
      },
      {
        name: '/events/confirm',
        params: () => ({
          user_id: state.user.user_id,
          event_id: state.events.shift().event_id,
        }),
      },
    ] as IOperationData[],
  });

export const voteForFacilitator: TTestUnit = (state: any) => (
  {
    title: 'read events on vote for facilitator',
    operations: [
      {
        name: '/events/read',
        params: {},
        setToState: (actual) => state.events = actual,
        expected: (actual) => {
          let event = actual[0];
          assert.deepEqual([{
            event_type: event.event_type,
            message: event.message,
            net_view: event.net_view,
            user_id: event.user_id,
          }], [{
            event_type: 'LEAVE_DISVOTE',
            message: 'Учасник вашого дерева від\'єднався через вибори в його дереві',
            net_view: 'tree',
            user_id: state.user.user_id,
          }]);

          event = actual[1];
          assert.deepEqual([{
            event_type: event.event_type,
            message: event.message,
            net_view: event.net_view,
            user_id: event.user_id,
          }], [{
            event_type: 'CONNECT_VOTE',
            message: 'У вашому дереві новий учасник, якого обрали координатором в його колі',
            net_view: 'tree',
            user_id: state.user.user_id,
          }]);
        },
      },
      {
        name: '/events/confirm',
        params: () => ({
          user_id: state.user.user_id,
          event_id: state.events.shift().event_id,
        }),
      },
      {
        name: '/events/confirm',
        params: () => ({
          user_id: state.user.user_id,
          event_id: state.events.shift().event_id,
        }),
      },
    ] as IOperationData[],
  });
