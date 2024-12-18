import { getEvent } from '.';

export const dislikeInTree = getEvent(
  'DISLIKE_DISCONNECT',
  'tree',
  "Учасника вашого дерева від'єднано через діслайки",
);

export const dislikeInCircle = getEvent(
  'DISLIKE_DISCONNECT',
  'circle',
  "Учасника вашого кола від'єднано через діслайки",
);

export const dislikeFacilitator = getEvent(
  'DISLIKE_DISCONNECT',
  'circle',
  "Вашого координатора від'єднано через діслайки",
);

export const leaveFacilitator = getEvent(
  'LEAVE',
  'circle',
  "У вашому колі від'єднався координатор",
);

export const inTree = getEvent('LEAVE', 'tree', "Від'єднався учасник дерева");

export const inCircle = getEvent('LEAVE', 'circle', "Від'єднався учасник кола");
