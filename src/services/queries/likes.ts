import { client } from "$services/redis";
import { userLikesKey, itemsKey } from "$services/keys";
import { insert } from "svelte/internal";
import { getItems } from "./items";

export const userLikesItem = async (itemId: string, userId: string) => {
    return client.sIsMember(userLikesKey(userId), itemId);
};

export const likedItems = async (userId: string) => {
    // 아이템 집합에서 좋아요를 가져와야함
    const ids = await client.sMembers(userLikesKey(userId));

    return getItems(ids);
};

export const likeItem = async (itemId: string, userId: string) => {
    const inserted = await client.sAdd(userLikesKey(userId), itemId);

    if (inserted) {
        return client.hIncrBy(itemsKey(itemId), 'likes', 1);
    }
};

export const unlikeItem = async (itemId: string, userId: string) => {
    const removed = await client.sRem(userLikesKey(userId), itemId);

    if (removed) {
        return client.hIncrBy(itemsKey(itemId), 'likes', -1);
    }
};

export const commonLikedItems = async (userOneId: string, userTwoId: string) => {
    const ids = await client.sInter([userLikesKey(userOneId), userLikesKey(userTwoId)]);

    return getItems(ids);
};
