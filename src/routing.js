export const routes = {
  home: '/',
  checkIn: '/check-in',
  exercises: '/exercises',
  saved: '/saved',
  about: '/about',
  help: '/help',
};

export function parseRoute(pathname = '/') {
  const cleanPath = pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname;

  if (cleanPath === routes.home) return { name: 'home' };
  if (cleanPath === routes.checkIn) return { name: 'check-in' };
  if (cleanPath === routes.exercises) return { name: 'exercises' };
  if (cleanPath.startsWith(`${routes.exercises}/`)) {
    return { name: 'exercise-detail', slug: decodeURIComponent(cleanPath.slice(`${routes.exercises}/`.length)) };
  }
  if (cleanPath === routes.saved) return { name: 'saved' };
  if (cleanPath === routes.about) return { name: 'about' };
  if (cleanPath === routes.help) return { name: 'help' };

  return { name: 'not-found' };
}

export function readFilterParams(search = '') {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  return {
    query: params.get('q') ?? '',
    category: params.get('category') ?? '',
    energy: params.get('energy') ?? '',
    writing: params.get('writing') ?? '',
    maxTime: params.get('maxTime') ?? '',
    printableOnly: params.get('printable') === 'true',
  };
}

export function buildExerciseSearch(filter = {}) {
  const params = new URLSearchParams();
  if (filter.query) params.set('q', filter.query);
  if (filter.category) params.set('category', filter.category);
  if (filter.energy) params.set('energy', filter.energy);
  if (filter.writing) params.set('writing', filter.writing);
  if (filter.maxTime) params.set('maxTime', String(filter.maxTime));
  if (filter.printableOnly) params.set('printable', 'true');

  const value = params.toString();
  return value ? `?${value}` : '';
}
