import { client } from "$services/redis";
import { itemsKey, itemsByViewsKey, itemsViewsKey } from "$services/keys";

export const incrementView = async (itemId: string, userId: string) => {
    const inserted = await client.pfAdd(itemsViewsKey(itemId), userId);

    if (inserted) {
        return Promise.all([
            client.hIncrBy(itemsKey(itemId), 'views', 1),
            client.zIncrBy(itemsByViewsKey(), 1, itemId)
        ]);
    }
};

// Keys I need to access
// 1) itemsViewsKey
// 2) itemKey
// 3) items By Views Key