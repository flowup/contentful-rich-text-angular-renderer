import { Asset, Entry } from 'contentful';

export type BlogPostEntryFields = {
  contentTypeId: 'BlogPostEntryFields';
  fields: {
    title: string;
    description?: string;
    image: Asset;
    author: Entry<BlogPostAuthorFields>;
  };
};

export type BlogPostAuthorFields = {
  contentTypeId: 'BlogPostAuthorFields';
  fields: {
    firstName: string;
    lastName: string;
    photo: Asset;
  };
};
