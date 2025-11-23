// This file will store centralized GROQ queries for Sanity.

export const CATEGORIES_QUERY = `*[_type == "category"]{
  _id,
  title,
  "slug": slug.current,
  "postCount": count(*[_type == "post" && references(^._id)])
} | order(title asc)`;

export const ALL_POSTS_QUERY = `*[_type == "post" && defined(slug.current)]|order(publishedAt desc){
  _id,
  title,
  slug,
  publishedAt,
  excerpt,
  mainImage,
  "categories": categories[]->{_id, title, "slug": slug.current},
  "author": author->{name}
}`;

export const POSTS_BY_CATEGORY_QUERY = `*[_type == "post" && defined(slug.current) && $categorySlug in categories[]->slug.current]|order(publishedAt desc){
  _id,
  title,
  slug,
  publishedAt,
  excerpt,
  mainImage,
  "categories": categories[]->{title, "slug": slug.current},
  "author": author->{name}
}`; 