import { NavRoute, Stakeholder, PTICEvent, EMartItem, ExpertQuestion } from '../types';
import { MOCK_STAKEHOLDERS, MOCK_EVENTS, MOCK_EMART_ITEMS, MOCK_QUESTIONS } from '../data/mockData';

/**
 * Converts any title or name into a clean, URL-safe slug.
 * e.g. "Dr. Arun Kumar" -> "dr-arun-kumar"
 * e.g. "Poultry Technology & Innovation Summit 2026" -> "poultry-innovation-summit-2026"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/dr\.\s*/g, 'dr-')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export interface ParsedRoute {
  route: NavRoute;
  subPath: string[];
  fullPath: string;
  isProfileOpen?: boolean;
  isSettingsOpen?: boolean;
  stakeholderSlug?: string;
  eventSlug?: string;
  productSlug?: string;
  questionSlug?: string;
}

/**
 * Parses the current window.location.pathname into structured route data.
 */
export function parseCurrentLocation(): ParsedRoute {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0 || segments[0] === 'home') {
    return { route: 'home', subPath: [], fullPath: '/' };
  }

  const first = segments[0].toLowerCase();

  // Profile route URL
  if (first === 'profile') {
    return { route: 'profile', subPath: [], fullPath: '/profile' };
  }

  // Settings modal URL
  if (first === 'settings') {
    return { route: 'home', subPath: [], fullPath: '/settings', isSettingsOpen: true };
  }

  // Directory / People routes
  // /directory
  // /directory/people
  // /directory/people/:slug
  // /people/:slug
  if (first === 'directory' || first === 'people') {
    let stakeholderSlug: string | undefined;
    if (first === 'directory' && segments[1] === 'people' && segments[2]) {
      stakeholderSlug = segments[2];
    } else if (first === 'directory' && segments[1] && segments[1] !== 'people') {
      stakeholderSlug = segments[1];
    } else if (first === 'people' && segments[1]) {
      stakeholderSlug = segments[1];
    }

    return {
      route: 'directory',
      subPath: segments.slice(1),
      fullPath: pathname,
      stakeholderSlug,
    };
  }

  // Events routes
  // /events
  // /events/:slug
  if (first === 'events') {
    const eventSlug = segments[1] || undefined;
    return {
      route: 'events',
      subPath: segments.slice(1),
      fullPath: pathname,
      eventSlug,
    };
  }

  // E-Mart routes
  // /emart
  // /e-mart
  // /e-mart/products/:slug
  // /e-mart/:slug
  if (first === 'emart' || first === 'e-mart') {
    let productSlug: string | undefined;
    if (segments[1] === 'products' && segments[2]) {
      productSlug = segments[2];
    } else if (segments[1]) {
      productSlug = segments[1];
    }

    return {
      route: 'emart',
      subPath: segments.slice(1),
      fullPath: pathname,
      productSlug,
    };
  }

  // Ask Expert routes
  // /ask
  // /ask-experts
  // /ask-experts/question/:slug
  // /ask/question/:slug
  if (first === 'ask' || first === 'ask-experts') {
    let questionSlug: string | undefined;
    if (segments[1] === 'question' && segments[2]) {
      questionSlug = segments[2];
    } else if (segments[1]) {
      questionSlug = segments[1];
    }

    return {
      route: 'ask',
      subPath: segments.slice(1),
      fullPath: pathname,
      questionSlug,
    };
  }

  // Inbox route URL
  if (first === 'inbox' || first === 'messages') {
    return { route: 'inbox', subPath: segments.slice(1), fullPath: pathname };
  }

  // Notifications route URL
  if (first === 'notifications') {
    return { route: 'notifications', subPath: segments.slice(1), fullPath: pathname };
  }

  if (first === 'design-system') {
    return { route: 'design-system', subPath: [], fullPath: pathname };
  }

  return { route: 'home', subPath: [], fullPath: '/' };
}

/**
 * Finds a stakeholder by id or slugified name.
 */
export function resolveStakeholderBySlugOrId(slugOrId?: string): Stakeholder | null {
  if (!slugOrId) return null;
  const clean = slugOrId.toLowerCase().trim();
  const direct = MOCK_STAKEHOLDERS.find(
    (s) => s.id.toLowerCase() === clean || slugify(s.name) === clean
  );
  if (direct) return direct;

  // Fuzzy match on name parts
  return (
    MOCK_STAKEHOLDERS.find((s) => {
      const sSlug = slugify(s.name);
      return sSlug.includes(clean) || clean.includes(sSlug);
    }) || null
  );
}

/**
 * Finds an event by id or slugified title.
 */
export function resolveEventBySlugOrId(slugOrId?: string, eventList: PTICEvent[] = MOCK_EVENTS): PTICEvent | null {
  if (!slugOrId) return null;
  const clean = slugOrId.toLowerCase().trim();
  const direct = eventList.find(
    (e) => e.id.toLowerCase() === clean || slugify(e.title) === clean
  );
  if (direct) return direct;

  // Fuzzy match
  return (
    eventList.find((e) => {
      const eSlug = slugify(e.title);
      return eSlug.includes(clean) || clean.includes(eSlug);
    }) || null
  );
}

/**
 * Finds an e-mart product by id or slugified title.
 */
export function resolveEMartItemBySlugOrId(slugOrId?: string, itemList: EMartItem[] = MOCK_EMART_ITEMS): EMartItem | null {
  if (!slugOrId) return null;
  const clean = slugOrId.toLowerCase().trim();
  const direct = itemList.find(
    (item) => item.id.toLowerCase() === clean || slugify(item.title) === clean
  );
  if (direct) return direct;

  return (
    itemList.find((item) => {
      const iSlug = slugify(item.title);
      return iSlug.includes(clean) || clean.includes(iSlug);
    }) || null
  );
}

/**
 * Finds an expert question by id or slugified title.
 */
export function resolveQuestionBySlugOrId(slugOrId?: string, questionList: ExpertQuestion[] = MOCK_QUESTIONS): ExpertQuestion | null {
  if (!slugOrId) return null;
  const clean = slugOrId.toLowerCase().trim();
  const direct = questionList.find(
    (q) => q.id.toLowerCase() === clean || slugify(q.title) === clean
  );
  if (direct) return direct;

  return (
    questionList.find((q) => {
      const qSlug = slugify(q.title);
      return qSlug.includes(clean) || clean.includes(qSlug);
    }) || null
  );
}

/**
 * Safely pushes a new URL to history and notifies listeners.
 */
export function pushNav(url: string, replace = false) {
  if (window.location.pathname + window.location.search === url) return;

  if (replace) {
    window.history.replaceState({}, '', url);
  } else {
    window.history.pushState({}, '', url);
  }

  window.dispatchEvent(new CustomEvent('ptic-navigate', { detail: { url } }));
}
