module.exports = {
  'extends': 'google',
  'rules': {
    'object-curly-spacing': 'off',
    'one-var': 'off',
    'no-use-before-define': ['error', { 'functions': false, 'classes': true }],
    'valid-jsdoc': 'off',
    'require-jsdoc': 'off',
    'quotes': ['error', 'single'],
    'complexity': ['error', 6],
  }
};
