/* eslint-disable max-lines */
module.exports = {
  'env': {
    'commonjs': true,
    'es2021': true,
    'node': true
  },
  'extends': [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  'overrides': [],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 'latest'
  },
  'globals': {
    'BigInt': true
  },
  'plugins': [
    'import',
    '@typescript-eslint'
  ],
  ignorePatterns: [
    'js',
    'src/client/common/*',
    '!src/client/common/api',
  ],
  root: true,
  'rules': {
    'max-lines': ['error', 100],
    indent: ['error', 2],
    quotes: ['error', 'single'],
    'block-spacing': ['error', 'always'],
    'no-loop-func': ['error'],
    strict: ['error', 'global'],
    'linebreak-style': ['error', 'unix'],
    semi: ['error', 'always'],
    // 'camelcase': ['error'],
    eqeqeq: ['error', 'always'],
    'brace-style': ['error', '1tbs', { 'allowSingleLine': true }],
    'comma-style': ['error', 'last'],
    'comma-spacing': ['error', {
      'before': false,
      'after': true
    }],
    'eol-last': ['error'],
    'func-call-spacing': ['error', 'never'],
    'key-spacing': ['error', {
      'beforeColon': false,
      'afterColon': true,
      'mode': 'minimum'
    }],
    'keyword-spacing': ['error', {
      'before': true,
      'after': true,
      'overrides': {
        'function': {
          'after': false
        }
      }
    }],
    'max-len': ['error', {
      'code': 80,
      'ignoreUrls': true
    }],
    'max-nested-callbacks': ['error', {
      'max': 7
    }],
    'new-cap': ['error', {
      'newIsCap': true,
      'capIsNew': false,
      'properties': true
    }],
    'new-parens': ['error'],
    'no-lonely-if': ['error'],
    'no-trailing-spaces': ['error'],
    'no-unneeded-ternary': ['error'],
    'no-whitespace-before-property': ['error'],
    'object-curly-spacing': ['error', 'always'],
    'operator-assignment': ['error', 'always'],
    'operator-linebreak': ['error', 'after'],
    'semi-spacing': ['error', {
      'before': false,
      'after': true
    }],
    'space-before-blocks': ['error', 'always'],
    'space-before-function-paren': ['error', {
      'anonymous': 'never',
      'named': 'never',
      'asyncArrow': 'always'
    }],
    'space-in-parens': ['error', 'never'],
    'space-infix-ops': ['error'],
    'space-unary-ops': ['error', {
      'words': true,
      'nonwords': false,
      'overrides': {
        'typeof': false
      }
    }],
    'no-unreachable': ['error'],
    'no-global-assign': ['error'],
    'no-self-compare': ['error'],
    'no-unmodified-loop-condition': ['error'],
    'no-constant-condition': ['error', {
      'checkLoops': false
    }],
    'no-console': ['off'],
    'no-useless-concat': ['error'],
    'no-useless-escape': ['error'],
    'no-shadow-restricted-names': ['error'],
    // 'no-use-before-define': ['error', {
    //   'functions': false
    // }],
    'arrow-parens': ['error', 'always'],
    'arrow-body-style': ['error', 'as-needed'],
    'arrow-spacing': ['error'],
    'no-confusing-arrow': ['error', {
      'allowParens': true
    }],
    'no-useless-computed-key': ['error'],
    'no-useless-rename': ['error'],
    'no-var': ['error'],
    'object-shorthand': ['error', 'always'],
    'prefer-arrow-callback': ['error'],
    'prefer-const': ['error'],
    'prefer-numeric-literals': ['error'],
    'prefer-rest-params': ['error'],
    'prefer-spread': ['error'],
    'rest-spread-spacing': ['error', 'never'],
    'template-curly-spacing': ['error', 'never'],
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  }
};
