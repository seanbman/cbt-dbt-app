import assert from 'node:assert/strict';
import test from 'node:test';
import { buildExerciseSearch, parseRoute, readFilterParams } from './routing.js';

test('parses top-level routes', () => {
  assert.deepEqual(parseRoute('/'), { name: 'home' });
  assert.deepEqual(parseRoute('/exercises'), { name: 'exercises' });
  assert.deepEqual(parseRoute('/help'), { name: 'help' });
});

test('parses exercise detail slugs', () => {
  assert.deepEqual(parseRoute('/exercises/thought-check'), { name: 'exercise-detail', slug: 'thought-check' });
});

test('reads exercise filter params', () => {
  assert.deepEqual(readFilterParams('?q=urge&category=grounding&energy=low&writing=minimal&maxTime=5&printable=true'), {
    query: 'urge',
    category: 'grounding',
    energy: 'low',
    writing: 'minimal',
    maxTime: '5',
    printableOnly: true,
  });
});

test('builds compact exercise search strings', () => {
  assert.equal(buildExerciseSearch({ category: 'grounding', printableOnly: true }), '?category=grounding&printable=true');
});
