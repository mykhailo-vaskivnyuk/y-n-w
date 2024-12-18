/* eslint-disable max-len */
/* eslint-disable max-lines */
import assert from 'node:assert';
import { IOperationData, TTestUnit } from '../../../types/types';

export const forMembers: TTestUnit = (state: any) => ({
  title: 'read events on vote for circle member',
  operations: [
    {
      name: '/events/read',
      params: {},
      setToState: (actual) => (state.events = actual),
      expected: (actual) => {
        const event = actual[0];
        assert.deepEqual(
          [
            {
              event_type: event.event_type,
              message: event.message,
              net_view: event.net_view,
              user_id: event.user_id,
            },
          ],
          [
            {
              event_type: 'CONNECT_VOTE',
              message: 'Учасника вашого кола обрано координатором',
              net_view: 'circle',
              user_id: state.user.user_id,
            },
          ],
        );
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

export const forMembersInTree: TTestUnit = (state: any) => ({
  title: 'read events on vote for tree member',
  operations: [
    {
      name: '/events/read',
      params: {},
      setToState: (actual) => (state.events = actual),
      expected: (actual) => {
        let event = actual[0];
        assert.deepEqual(
          [
            {
              event_type: event.event_type,
              message: event.message,
              net_view: event.net_view,
              user_id: event.user_id,
            },
          ],
          [
            {
              event_type: 'LEAVE_VOTE',
              message: "Ваш координатор від'єднався через вибори",
              net_view: 'circle',
              user_id: state.user.user_id,
            },
          ],
        );

        event = actual[1];
        assert.deepEqual(
          [
            {
              event_type: event.event_type,
              message: event.message,
              net_view: event.net_view,
              user_id: event.user_id,
            },
          ],
          [
            {
              event_type: 'CONNECT_DISVOTE',
              message:
                'У вас новий координатор через вибори в колі вашого координатора',
              net_view: 'circle',
              user_id: state.user.user_id,
            },
          ],
        );
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

export const forMembersInCircle: TTestUnit = (state: any) => ({
  title: 'read events on vote for circle member',
  operations: [
    {
      name: '/events/read',
      params: {},
      setToState: (actual) => (state.events = actual),
      expected: (actual) => {
        let event = actual[0];
        assert.deepEqual(
          [
            {
              event_type: event.event_type,
              message: event.message,
              net_view: event.net_view,
              user_id: event.user_id,
            },
          ],
          [
            {
              event_type: 'LEAVE_DISVOTE',
              message:
                "Учасник вашого кола від'єднався через вибори в його дереві",
              net_view: 'circle',
              user_id: state.user.user_id,
            },
          ],
        );

        event = actual[1];
        assert.deepEqual(
          [
            {
              event_type: event.event_type,
              message: event.message,
              net_view: event.net_view,
              user_id: event.user_id,
            },
          ],
          [
            {
              event_type: 'CONNECT_VOTE',
              message:
                'У вашому колі новий учасник, якого обрали координатором в його колі',
              net_view: 'circle',
              user_id: state.user.user_id,
            },
          ],
        );
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

export const forConnectedInCircle: TTestUnit = (state: any) => ({
  title: 'read events on vote for connected member in circle',
  operations: [
    {
      name: '/events/read',
      params: {},
      setToState: (actual) => (state.events = actual),
      expected: (actual) => {
        const event = actual[0];
        assert.deepEqual(
          [
            {
              event_type: event.event_type,
              message: event.message.slice(0, 28),
              net_view: event.net_view,
              user_id: event.user_id,
            },
          ],
          [
            {
              event_type: 'LEAVE_DISVOTE',
              message: "Вас від'єднано від спільноти", // ... через вибори координатора
              net_view: null,
              user_id: state.user.user_id,
            },
          ],
        );
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

export const forConnectedInTree: TTestUnit = (state: any) => ({
  title: 'read events on vote for connected member in tree',
  operations: [
    {
      name: '/events/read',
      params: {},
      setToState: (actual) => (state.events = actual),
      expected: (actual) => {
        const event = actual[0];
        assert.deepEqual(
          [
            {
              event_type: event.event_type,
              message: event.message.slice(0, 28),
              net_view: event.net_view,
              user_id: event.user_id,
            },
          ],
          [
            {
              event_type: 'LEAVE_VOTE',
              message: "Вас від'єднано від спільноти", // ... через вибори координатора
              net_view: null,
              user_id: state.user.user_id,
            },
          ],
        );
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

export const forVoteMember: TTestUnit = (state: any) => ({
  title: 'read events on vote for vote member',
  operations: [
    {
      name: '/events/read',
      params: {},
      setToState: (actual) => (state.events = actual),
      expected: (actual) => {
        const event = actual[0];
        assert.deepEqual(
          [
            {
              event_type: event.event_type,
              message: event.message,
              net_view: event.net_view,
              user_id: event.user_id,
            },
          ],
          [
            {
              event_type: 'CONNECT_VOTE',
              message: 'Вас обрано координатором',
              net_view: 'net',
              user_id: state.user.user_id,
            },
          ],
        );
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

export const forDisvoteMember: TTestUnit = (state: any) => ({
  title: 'read events on vote for disvote member',
  operations: [
    {
      name: '/events/read',
      params: {},
      setToState: (actual) => (state.events = actual),
      expected: (actual) => {
        let event = actual[0];
        assert.deepEqual(
          [
            {
              event_type: event.event_type,
              message: event.message,
              net_view: event.net_view,
              user_id: event.user_id,
            },
          ],
          [
            {
              event_type: 'CONNECT_VOTE',
              message: 'Учасника вашого кола обрано координатором',
              net_view: 'circle',
              user_id: state.user.user_id,
            },
          ],
        );

        event = actual[1];
        assert.deepEqual(
          [
            {
              event_type: event.event_type,
              message: event.message,
              net_view: event.net_view,
              user_id: event.user_id,
            },
          ],
          [
            {
              event_type: 'CONNECT_DISVOTE',
              message: 'Вас переобрано',
              net_view: 'net',
              user_id: state.user.user_id,
            },
          ],
        );
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

export const forFacilitator: TTestUnit = (state: any) => ({
  title: 'read events on vote for facilitator',
  operations: [
    {
      name: '/events/read',
      params: {},
      setToState: (actual) => (state.events = actual),
      expected: (actual) => {
        let event = actual[0];
        assert.deepEqual(
          [
            {
              event_type: event.event_type,
              message: event.message,
              net_view: event.net_view,
              user_id: event.user_id,
            },
          ],
          [
            {
              event_type: 'LEAVE_DISVOTE',
              message:
                "Учасник вашого дерева від'єднався через вибори в його дереві",
              net_view: 'tree',
              user_id: state.user.user_id,
            },
          ],
        );

        event = actual[1];
        assert.deepEqual(
          [
            {
              event_type: event.event_type,
              message: event.message,
              net_view: event.net_view,
              user_id: event.user_id,
            },
          ],
          [
            {
              event_type: 'CONNECT_VOTE',
              message:
                'У вашому дереві новий учасник, якого обрали координатором в його колі',
              net_view: 'tree',
              user_id: state.user.user_id,
            },
          ],
        );
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
