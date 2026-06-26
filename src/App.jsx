import React, { useEffect, useMemo, useState } from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native-web';
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
      <Text style={styles.lead}>This app is a no-login, privacy-first toolbox for CBT, DBT-informed, SMART Recovery-informed, and recovery-focused exercises.</Text>
      <Text style={styles.body}>It is designed to help people pick a simple next exercise, use it in the browser, and eventually print or save worksheets locally. It does not diagnose, replace counselling, or provide emergency support.</Text>
    </View>
  );
}

function Help() {
  return (
    <View style={styles.stackLarge}>
      <View style={styles.crisisPanel}>
        <Text style={styles.h1}>Get immediate help</Text>
        <Text style={styles.lead}>{crisisCopy}</Text>
        <Text style={styles.body}>If you are outside Canada or the U.S., contact your local emergency number or nearest emergency department.</Text>
      </View>
      <Text style={styles.body}>For non-emergency support, consider contacting a trusted person, sponsor, counsellor, doctor, crisis line, or local peer-support group.</Text>
    </View>
  );
}

function NotFound({ navigate }) {
  return (
    <View style={styles.stackLarge}>
      <Text style={styles.h1}>Page not found</Text>
      <Text style={styles.lead}>That route does not exist in this static app.</Text>
      <Pressable onPress={() => navigate(routes.home)} style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Back home</Text>
      </Pressable>
    </View>
  );
}

function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>Steady Steps is not a crisis service. Call 9-1-1 for immediate danger or 9-8-8 for suicide crisis support in Canada/U.S.</Text>
    </View>
  );
}

const colors = {
  ink: '#18211f',
  muted: '#5c6a66',
  paper: '#f8f5ef',
  panel: '#ffffff',
  border: '#d7ddd9',
  accent: '#2f6258',
  accentSoft: '#e7f0ed',
  danger: '#6d2f2f',
};

const styles = StyleSheet.create({
  app: {
    minHeight: '100vh',
    backgroundColor: colors.paper,
  },
  header: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.panel,
    gap: 16,
  },
  brand: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.ink,
  },
  nav: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  navLink: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
  },
  navLinkActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  navText: {
    color: colors.muted,
    fontWeight: '700',
  },
  navTextActive: {
    color: colors.accent,
  },
  crisisButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.danger,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  crisisButtonText: {
    color: '#fff',
    fontWeight: '800',
  },
  main: {
    width: '100%',
    maxWidth: 1100,
    alignSelf: 'center',
    padding: 24,
    gap: 24,
  },
  stackLarge: {
    gap: 24,
  },
  hero: {
    backgroundColor: colors.panel,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 28,
    gap: 18,
  },
  pageHeader: {
    gap: 12,
  },
  eyebrow: {
    color: colors.accent,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  h1: {
    fontSize: 36,
    lineHeight: 42,
    color: colors.ink,
    fontWeight: '900',
  },
  h2: {
    fontSize: 24,
    color: colors.ink,
    fontWeight: '850',
  },
  h3: {
    fontSize: 20,
    color: colors.ink,
    fontWeight: '800',
  },
  lead: {
    fontSize: 18,
    lineHeight: 28,
    color: colors.muted,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.muted,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  primaryButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accent,
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '800',
  },
  secondaryButton: {
    alignSelf: 'flex-start',
    borderColor: colors.accent,
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  secondaryButtonActive: {
    backgroundColor: colors.accentSoft,
  },
  secondaryButtonText: {
    color: colors.accent,
    fontWeight: '800',
  },
  smallButton: {
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  smallButtonText: {
    color: '#fff',
    fontWeight: '800',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 16,
  },
  card: {
    backgroundColor: colors.panel,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    gap: 12,
  },
  filterPanel: {
    backgroundColor: colors.panel,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    gap: 14,
  },
  label: {
    color: colors.ink,
    fontWeight: '800',
  },
  searchRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  input: {
    flexGrow: 1,
    minWidth: 220,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 12,
    color: colors.ink,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  chipActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  chipText: {
    color: colors.muted,
    fontWeight: '700',
  },
  chipTextActive: {
    color: colors.accent,
  },
  resultCount: {
    fontWeight: '800',
    color: colors.ink,
  },
  exerciseGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 16,
  },
  exerciseCard: {
    backgroundColor: colors.panel,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    gap: 12,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  meta: {
    backgroundColor: colors.accentSoft,
    color: colors.accent,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontWeight: '800',
  },
  tag: {
    color: colors.muted,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  cardLink: {
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  cardLinkText: {
    color: colors.accent,
    fontWeight: '800',
  },
  backLink: {
    alignSelf: 'flex-start',
  },
  detailCard: {
    backgroundColor: colors.panel,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 28,
    gap: 14,
  },
  stepBlock: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
    gap: 8,
  },
  stepNumber: {
    color: colors.accent,
    fontWeight: '900',
  },
  prompt: {
    color: colors.ink,
    fontWeight: '700',
    backgroundColor: colors.accentSoft,
    padding: 12,
    borderRadius: 14,
  },
  disabledButton: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 18,
    backgroundColor: '#d9dddb',
  },
  disabledButtonText: {
    color: colors.muted,
    fontWeight: '800',
  },
  bullet: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
  },
  privacyNote: {
    color: colors.muted,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  crisisPanel: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#d8b8b8',
    backgroundColor: '#fff5f5',
    padding: 24,
    gap: 14,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 20,
    backgroundColor: colors.panel,
  },
  footerText: {
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 22,
  },
});
