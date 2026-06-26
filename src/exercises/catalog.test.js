import assert from 'node:assert/strict';
import test from 'node:test';
import { categories, exercises, filterExercises, findExerciseBySlug, validateCatalog } from './catalog.js';

test('catalog has validated categories and exercises', () => {
  assert.equal(categories.length, 10);
  assert.equal(exercises.length, 12);
  assert.deepEqual(validateCatalog(), []);
});

test('finds exercises by stable slug', () => {
  const exercise = findExerciseBySlug('thought-check');
  assert.equal(exercise.title, 'Thought check');
  assert.equal(findExerciseBySlug('not-a-real-exercise'), null);
});

test('filters by category', () => {
  const results = filterExercises({ category: 'grounding' });
  assert.equal(results.length, 1);
  assert.equal(results[0].slug, 'five-senses-grounding');
});

test('filters by search text across tags and descriptions', () => {
  const results = filterExercises({ query: 'craving' });
  assert.ok(results.some((exercise) => exercise.slug === 'urge-wave-observation'));
  assert.ok(results.some((exercise) => exercise.slug === 'delay-and-decide'));
});

test('combines filters', () => {
  const results = filterExercises({ category: 'cbt-based', energy: 'medium', maxTime: '10' });
  assert.deepEqual(results.map((exercise) => exercise.slug), ['thought-check']);
});
