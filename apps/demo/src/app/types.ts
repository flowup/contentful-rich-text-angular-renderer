import { Asset, Entry } from 'contentful';

export type BlogPostEntryFields = {
  title: string;
  description?: string;
  image: Asset;
  author: Entry<BlogPostAuthorFields>;
};

export type BlogPostAuthorFields = {
  firstName: string;
  lastName: string;
  photo: Asset;
};
