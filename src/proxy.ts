import createMiddleware from 'next-intl/middleware';

export const proxy = createMiddleware({
  locales: ['en', 'ml'],
  defaultLocale: 'en'
});

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
