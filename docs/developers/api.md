# API

```javascript
'account': {
    'confirm': rpc,
    'login': rpc,
    'logout': rpc,
    'messenger': {
      'link': {
        'get': rpc,
        'connect': rpc,
      },
    },
    'overmail': rpc,
    'overtg': rpc,
    'remove': rpc,
    'restore': rpc,
    'signup': rpc,
    'signupTg': rpc,
  },

'admin': {
  'net': {
    'get': rpc,
  },
},

'chat': {
  'connect': {
    'nets': rpc,
    'user': rpc,
  },
  'sendMessage': rpc,
  'getMessages': rpc,
  'removeConnection': rpc,
},

'events': {
  'read': rpc,
  'confirm': rpc,
},

'health': rpc,

'echo': rpc,

'member': {
  'data': {
    'dislike': {
      'set': rpc,
      'unSet': rpc,
    },
    'vote': {
      'set': rpc,
      'unSet': rpc,
    },
  },
  'disconnectNotVote': rpc,
  'disconnectUnactive': rpc,
  'invite': {
    'cancel': rpc,
    'confirm': rpc,
    'create': rpc,
    'refuse': rpc,
  },
},

'net': {
  'board': {
    'clear': rpc,
    'read': rpc,
    'remove': rpc,
    'save': rpc,
  },
  'connectByToken': rpc,
  'create': rpc,
  'enter': rpc,
  'getCircle': rpc,
  'getTree': rpc,
  'leave': rpc,
  'update': rpc,
},

'scripts': {
  'script.js': rpc,
},

'test': {
  'data': rpc,
},

'user': {
  'read': rpc,
  'update': rpc,
  'net': {
    'getData': rpc,
  },
  'nets': {
    'get': rpc,
  },
}
```