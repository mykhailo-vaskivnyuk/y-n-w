export const getUrlInstance = (pathnameWithSearchString = '/', host = 'somehost') => {
  return new URL(pathnameWithSearchString, `http://${host}`);
};
