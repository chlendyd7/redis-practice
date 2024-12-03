import { client } from "$services/redis";

const casheRoutes = [
    '/about', '/privacy', '/auth/signin', '/auth/signup'
];

export const getCachedPage = (route: string) => {
    if (casheRoutes.includes(route)) {
        return client.get('pagecashe#' + route);
    }

    return null;
};

export const setCachedPage = (route: string, page: string) => {
    if (casheRoutes.includes(route)) {
        return client.set('pagecashe#' + route, page, {
            EX: 2
        })
    }
};
