import React, { useEffect, useMemo, useState } from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { categories, categoryById, exercises, filterExercises, findExerciseBySlug } from './exercises/catalog.js';
import { buildExerciseSearch, parseRoute, readFilterParams, routes } from './routing.js';

const crisisCopy = 'If you may hurt yourself or someone else, call 9-1-1 now. In Canada and the U.S., call or text 9-8-8 for suicide crisis support.';

const getLocationState = () => ({
  pathname: window.location.pathname,
  search: window.location.search,
});

export default function App() {
  const [location, setLocation] = useState(getLocationState);

  useEffect(() => {
    const handlePop = () => setLocation(getLocationState());
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  const navigate = (href) => {
    window.history.pushState({}, '', href);
    setLocation(getLocationState());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const route = parseRoute(location.pathname);

  return (
    <View style={styles.app}>
      <Header navigate={navigate} currentPath={location.pathname} />
      <ScrollView contentContainerStyle={styles.main}>
        {route.name === 'home' && <Home navigate={navigate} />}
        {route.name === 'check-in' && <PlaceholderPage title="Check-in" body="Check-in questions are planned for a later phase. For now, browse the exercise library and choose a steady next step." navigate={navigate} />}
        {route.name === 'exercises' && <ExerciseLibrary location={location} navigate={navigate} />}
        {route.name === 'exercise-detail' && <ExerciseDetail slug={route.slug} navigate={navigate} />}
        {route.name === 'saved' && <PlaceholderPage title="Saved sessions" body="Saved-session management is planned for a later phase. Worksheet answers are not sent to a server." navigate={navigate} />}
        {route.name === 'about' && <About />}
        {route.name === 'help' && <Help />}
        {route.name === 'not-found' && <NotFound navigate={navigate} />}
      </ScrollView>
      <Footer />
    </View>
  );
}

function Header({ navigate, currentPath }) {
  const links = [
    ['Home', routes.home],
    ['Check-in', routes.checkIn],
    ['Exercises', routes.exercises],
    ['Saved', routes.saved],
    ['About', routes.about],
    ['Help', routes.help],
  ];

  return (
    <View style={styles.header}>
      <Pressable accessibilityRole="link" onPress={() => navigate(routes.home)}>
        <Text style={styles.brand}>Steady Steps</Text>
      </Pressable>
      <View style={styles.nav}>
        {links.map(([label, href]) => (
          <Pressable key={href} accessibilityRole="link" onPress={() => navigate(href)} style={[styles.navLink, currentPath === href && styles.navLinkActive]}>
            <Text style={[styles.navText, currentPath === href && styles.navTextActive]}>{label}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable accessibilityRole="link" onPress={() => navigate(routes.help)} style={styles.crisisButton}>
        <Text style={styles.crisisButtonText}>Get immediate help</Text>
      </Pressable>
    </View>
  );
}

function Home({ navigate }) {
  return (
    <View style={styles.stackLarge}>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>Privacy-first exercise toolbox</Text>
        <Text style={styles.h1}>CBT, DBT-informed, and recovery-focused exercises you can use without logging in.</Text>
        <Text style={styles.lead}>Steady Steps runs as a React Native Web app and keeps worksheet answers on the device. It is not a crisis service, diagnostic tool, or replacement for professional care.</Text>
        <View style={styles.buttonRow}>
          <Pressable onPress={() => navigate(routes.exercises)} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Browse exercises</Text>
          </Pressable>
          <Pressable onPress={() => navigate(routes.help)} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Get help now</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.grid}>
        <Feature title="No login" body="No accounts, cloud profiles, or server-side worksheet answer storage." />
        <Feature title="Browse by need" body="Search and filter exercises by category, energy, writing level, and time." />
        <Feature title="Print-friendly foundation" body="Exercise detail pages are structured so printable worksheets can be expanded later." />
      </View>
    </View>
  );
}

function Feature({ title, body }) {
  return (
    <View style={styles.card}>
      <Text style={styles.h3}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </View>
  );
}

function ExerciseLibrary({ location, navigate }) {
  const initialFilter = useMemo(() => readFilterParams(location.search), [location.search]);
  const [query, setQuery] = useState(initialFilter.query);

  useEffect(() => {
    setQuery(initialFilter.query);
  }, [initialFilter.query]);

  const filter = { ...initialFilter, query };
  const results = filterExercises(filter);

  const updateFilter = (patch) => {
    const next = { ...filter, ...patch };
    navigate(`${routes.exercises}${buildExerciseSearch(next)}`);
  };

  const submitQuery = () => updateFilter({ query });
  const clearFilters = () => {
    setQuery('');
    navigate(routes.exercises);
  };

  return (
    <View style={styles.stackLarge}>
      <View style={styles.pageHeader}>
        <Text style={styles.eyebrow}>Exercise library</Text>
        <Text style={styles.h1}>Browse exercises</Text>
        <Text style={styles.lead}>Search the static exercise catalog or narrow it by category, effort, writing level, and time.</Text>
      </View>

      <View style={styles.filterPanel}>
        <Text style={styles.label}>Search</Text>
        <View style={styles.searchRow}>
          <TextInput
            accessibilityLabel="Search exercises"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={submitQuery}
            placeholder="Try urge, grounding, thought, shame..."
            style={styles.input}
          />
          <Pressable onPress={submitQuery} style={styles.smallButton}>
            <Text style={styles.smallButtonText}>Search</Text>
          </Pressable>
        </View>

        <Text style={styles.label}>Categories</Text>
        <View style={styles.chips}>
          <FilterChip label="All" active={!filter.category} onPress={() => updateFilter({ category: '' })} />
          {categories.map((category) => (
            <FilterChip key={category.id} label={category.name} active={filter.category === category.id} onPress={() => updateFilter({ category: category.id })} />
          ))}
        </View>

        <Text style={styles.label}>Energy</Text>
        <View style={styles.chips}>
          {['', 'low', 'medium'].map((energy) => <FilterChip key={energy || 'any'} label={energy || 'Any'} active={filter.energy === energy} onPress={() => updateFilter({ energy })} />)}
        </View>

        <Text style={styles.label}>Writing</Text>
        <View style={styles.chips}>
          {['', 'minimal', 'moderate'].map((writing) => <FilterChip key={writing || 'any'} label={writing || 'Any'} active={filter.writing === writing} onPress={() => updateFilter({ writing })} />)}
        </View>

        <Text style={styles.label}>Maximum time</Text>
        <View style={styles.chips}>
          {['', '5', '10', '15'].map((maxTime) => <FilterChip key={maxTime || 'any'} label={maxTime ? `${maxTime} min` : 'Any'} active={filter.maxTime === maxTime} onPress={() => updateFilter({ maxTime })} />)}
        </View>

        <View style={styles.buttonRow}>
          <Pressable onPress={() => updateFilter({ printableOnly: !filter.printableOnly })} style={[styles.secondaryButton, filter.printableOnly && styles.secondaryButtonActive]}>
            <Text style={styles.secondaryButtonText}>{filter.printableOnly ? 'Printable only: on' : 'Printable only'}</Text>
          </Pressable>
          <Pressable onPress={clearFilters} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Clear filters</Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.resultCount}>{results.length} exercise{results.length === 1 ? '' : 's'} found</Text>
      <View style={styles.exerciseGrid}>
        {results.map((exerciseItem) => <ExerciseCard key={exerciseItem.slug} exerciseItem={exerciseItem} navigate={navigate} />)}
      </View>
      {results.length === 0 && <Text style={styles.body}>No exercises matched those filters. Clear filters or try a broader search.</Text>}
    </View>
  );
}

function FilterChip({ label, active, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

function ExerciseCard({ exerciseItem, navigate }) {
  return (
    <View style={styles.exerciseCard}>
      <Text style={styles.h3}>{exerciseItem.title}</Text>
      <Text style={styles.body}>{exerciseItem.summary}</Text>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>{exerciseItem.timeMinutes} min</Text>
        <Text style={styles.meta}>{exerciseItem.energyRequired} energy</Text>
        <Text style={styles.meta}>{exerciseItem.writingLevel} writing</Text>
      </View>
      <View style={styles.chips}>
        {exerciseItem.categoryIds.map((id) => <Text key={id} style={styles.tag}>{categoryById.get(id)?.name ?? id}</Text>)}
      </View>
      <Pressable onPress={() => navigate(`${routes.exercises}/${exerciseItem.slug}`)} style={styles.cardLink}>
        <Text style={styles.cardLinkText}>Open exercise</Text>
      </Pressable>
    </View>
  );
}

function ExerciseDetail({ slug, navigate }) {
  const exerciseItem = findExerciseBySlug(slug);

  if (!exerciseItem) {
    return (
      <View style={styles.stackLarge}>
        <Text style={styles.h1}>That exercise was not found</Text>
        <Text style={styles.lead}>The exercise link may have changed, or the item may not exist in this static catalog.</Text>
        <Pressable onPress={() => navigate(routes.exercises)} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Back to exercise library</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.stackLarge}>
      <Pressable onPress={() => navigate(routes.exercises)} style={styles.backLink}>
        <Text style={styles.cardLinkText}>← Back to exercise library</Text>
      </Pressable>
      <View style={styles.detailCard}>
        <Text style={styles.eyebrow}>Exercise</Text>
        <Text style={styles.h1}>{exerciseItem.title}</Text>
        <Text style={styles.lead}>{exerciseItem.summary}</Text>
        <Text style={styles.body}>{exerciseItem.description}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.meta}>{exerciseItem.timeMinutes} min</Text>
          <Text style={styles.meta}>{exerciseItem.energyRequired} energy</Text>
          <Text style={styles.meta}>{exerciseItem.writingLevel} writing</Text>
          <Text style={styles.meta}>{exerciseItem.printable ? 'printable' : 'not printable'}</Text>
        </View>
        <View style={styles.chips}>{exerciseItem.categoryIds.map((id) => <Text key={id} style={styles.tag}>{categoryById.get(id)?.name ?? id}</Text>)}</View>
      </View>

      <Section title="Helpful for" items={exerciseItem.helpfulFor} />
      <Section title="Avoid when" items={exerciseItem.avoidWhen} />

      <View style={styles.card}>
        <Text style={styles.h2}>Guided step preview</Text>
        {exerciseItem.steps.map((stepItem, index) => (
          <View key={stepItem.id} style={styles.stepBlock}>
            <Text style={styles.stepNumber}>Step {index + 1}</Text>
            <Text style={styles.h3}>{stepItem.title}</Text>
            <Text style={styles.body}>{stepItem.instruction}</Text>
            <Text style={styles.prompt}>{stepItem.prompt}</Text>
          </View>
        ))}
        <Pressable disabled style={styles.disabledButton}>
          <Text style={styles.disabledButtonText}>Worksheet runner coming soon</Text>
        </Pressable>
      </View>

      <Text style={styles.privacyNote}>Privacy note: this static app does not send worksheet answers to a server. Full local worksheet saving belongs to a later phase.</Text>
    </View>
  );
}

function Section({ title, items }) {
  return (
    <View style={styles.card}>
      <Text style={styles.h2}>{title}</Text>
      {items.map((item) => <Text key={item} style={styles.bullet}>• {item}</Text>)}
    </View>
  );
}

function PlaceholderPage({ title, body, navigate }) {
  return (
    <View style={styles.stackLarge}>
      <Text style={styles.h1}>{title}</Text>
      <Text style={styles.lead}>{body}</Text>
      <Pressable onPress={() => navigate(routes.exercises)} style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Browse exercises</Text>
      </Pressable>
    </View>
  );
}

function About() {
  return (
    <View style={styles.stackLarge}>
      <Text style={styles.h1}>About Steady Steps</Text>
      <Text style={styles.lead}>Steady Steps is a self-guided exercise toolbox for reflection, grounding, emotion regulation, urge management, and values-based planning.</Text>
      <View style={styles.card}>
        <Text style={styles.h2}>Privacy boundaries</Text>
        {['No login or account system.', 'No cloud sync for worksheet drafts.', 'No server-side worksheet-answer or check-in storage.', 'No third-party AI processing of user answers.', 'No advertising trackers.'].map((item) => <Text key={item} style={styles.bullet}>• {item}</Text>)}
      </View>
    </View>
  );
}

function Help() {
  return (
    <View style={styles.stackLarge}>
      <Text style={styles.h1}>Get immediate help</Text>
      <Text style={styles.lead}>{crisisCopy}</Text>
      <View style={styles.card}>
        <Text style={styles.h2}>This app is not emergency care</Text>
        <Text style={styles.body}>Use trusted crisis lines, emergency services, a sponsor, a clinician, or a safe person when you need immediate support.</Text>
        <Pressable onPress={() => Linking.openURL('tel:988')} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Call 9-8-8</Text>
        </Pressable>
      </View>
    </View>
  );
}

function NotFound({ navigate }) {
  return (
    <View style={styles.stackLarge}>
      <Text style={styles.h1}>Page not found</Text>
      <Text style={styles.lead}>That route does not exist in the static React Native Web app.</Text>
      <Pressable onPress={() => navigate(routes.home)} style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Go home</Text>
      </Pressable>
    </View>
  );
}

function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>Steady Steps is educational self-help content, not clinical or crisis care.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  app: { minHeight: '100vh', backgroundColor: '#f5f5f2' },
  header: { alignItems: 'center', backgroundColor: '#111827', gap: 16, padding: 20 },
  brand: { color: '#ffffff', fontSize: 24, fontWeight: '800' },
  nav: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  navLink: { borderColor: '#374151', borderRadius: 999, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8 },
  navLinkActive: { backgroundColor: '#ffffff' },
  navText: { color: '#ffffff', fontWeight: '700' },
  navTextActive: { color: '#111827' },
  crisisButton: { backgroundColor: '#ffffff', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 10 },
  crisisButtonText: { color: '#111827', fontWeight: '800' },
  main: { alignSelf: 'center', maxWidth: 1120, padding: 20, width: '100%' },
  stackLarge: { gap: 20 },
  hero: { backgroundColor: '#ffffff', borderRadius: 28, gap: 18, padding: 28 },
  pageHeader: { gap: 10 },
  eyebrow: { color: '#4b5563', fontSize: 13, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase' },
  h1: { color: '#111827', fontSize: 40, fontWeight: '900', lineHeight: 46 },
  h2: { color: '#111827', fontSize: 24, fontWeight: '850' },
  h3: { color: '#111827', fontSize: 19, fontWeight: '850' },
  lead: { color: '#374151', fontSize: 18, lineHeight: 28 },
  body: { color: '#374151', fontSize: 16, lineHeight: 24 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 },
  exerciseGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 },
  card: { backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderRadius: 20, borderWidth: 1, gap: 12, padding: 20 },
  detailCard: { backgroundColor: '#ffffff', borderColor: '#d1d5db', borderRadius: 24, borderWidth: 1, gap: 14, padding: 24 },
  exerciseCard: { backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderRadius: 20, borderWidth: 1, gap: 12, padding: 18 },
  filterPanel: { backgroundColor: '#ffffff', borderRadius: 20, gap: 12, padding: 18 },
  searchRow: { flexDirection: 'row', gap: 10 },
  label: { color: '#111827', fontSize: 14, fontWeight: '850', marginTop: 6 },
  input: { backgroundColor: '#f9fafb', borderColor: '#d1d5db', borderRadius: 14, borderWidth: 1, color: '#111827', flex: 1, fontSize: 16, paddingHorizontal: 14, paddingVertical: 12 },
  buttonRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  primaryButton: { alignSelf: 'flex-start', backgroundColor: '#111827', borderRadius: 999, paddingHorizontal: 18, paddingVertical: 12 },
  primaryButtonText: { color: '#ffffff', fontWeight: '850' },
  secondaryButton: { alignSelf: 'flex-start', backgroundColor: '#ffffff', borderColor: '#d1d5db', borderRadius: 999, borderWidth: 1, paddingHorizontal: 18, paddingVertical: 12 },
  secondaryButtonActive: { backgroundColor: '#f3f4f6' },
  secondaryButtonText: { color: '#111827', fontWeight: '850' },
  smallButton: { backgroundColor: '#111827', borderRadius: 14, justifyContent: 'center', paddingHorizontal: 16 },
  smallButtonText: { color: '#ffffff', fontWeight: '850' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderColor: '#d1d5db', borderRadius: 999, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8 },
  chipActive: { backgroundColor: '#111827', borderColor: '#111827' },
  chipText: { color: '#111827', fontWeight: '750' },
  chipTextActive: { color: '#ffffff' },
  tag: { backgroundColor: '#f3f4f6', borderRadius: 999, color: '#374151', fontSize: 13, fontWeight: '750', paddingHorizontal: 10, paddingVertical: 6 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  meta: { backgroundColor: '#111827', borderRadius: 999, color: '#ffffff', fontSize: 12, fontWeight: '800', overflow: 'hidden', paddingHorizontal: 10, paddingVertical: 5, textTransform: 'uppercase' },
  cardLink: { alignSelf: 'flex-start', marginTop: 'auto' },
  cardLinkText: { color: '#111827', fontWeight: '900', textDecorationLine: 'underline' },
  backLink: { alignSelf: 'flex-start' },
  stepBlock: { borderTopColor: '#e5e7eb', borderTopWidth: 1, gap: 8, paddingTop: 14 },
  stepNumber: { color: '#6b7280', fontSize: 12, fontWeight: '850', textTransform: 'uppercase' },
  prompt: { color: '#111827', fontSize: 16, fontStyle: 'italic', lineHeight: 24 },
  bullet: { color: '#374151', fontSize: 16, lineHeight: 25 },
  disabledButton: { alignSelf: 'flex-start', backgroundColor: '#e5e7eb', borderRadius: 999, paddingHorizontal: 18, paddingVertical: 12 },
  disabledButtonText: { color: '#6b7280', fontWeight: '850' },
  privacyNote: { color: '#4b5563', fontSize: 14, lineHeight: 22 },
  resultCount: { color: '#111827', fontSize: 18, fontWeight: '850' },
  footer: { alignItems: 'center', padding: 20 },
  footerText: { color: '#4b5563', fontSize: 13 },
});
