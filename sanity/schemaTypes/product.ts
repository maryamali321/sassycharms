import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Rings', value: 'rings' },
          { title: 'Necklaces', value: 'necklaces' },
          { title: 'Earrings', value: 'earrings' },
          { title: 'Bracelets', value: 'bracelets' },
          { title: 'Anklets', value: 'anklets' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price (Rs.)',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'oldPrice',
      title: 'Old Price (Rs.)',
      description: 'Only set this if the product is on sale — shown as a strikethrough price.',
      type: 'number',
    }),
    defineField({
      name: 'badge',
      title: 'Badge',
      description: 'Small label shown on the product image.',
      type: 'string',
      options: {
        list: [
          { title: 'None', value: '' },
          { title: 'New', value: 'New' },
          { title: 'Hot', value: 'Hot' },
          { title: 'Sale', value: 'Sale' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'rating',
      title: 'Rating (1–5 stars)',
      type: 'number',
      initialValue: 5,
      validation: (Rule) => Rule.min(1).max(5),
    }),
    defineField({
      name: 'reviews',
      title: 'Number of Reviews',
      description: 'Shown next to the star rating, e.g. "(128)".',
      type: 'number',
      initialValue: 0,
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'image',
      title: 'Product Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'featured',
      title: 'Show on Homepage',
      description: 'Featured/bestseller products shown on the home page.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'inStock',
      title: 'In Stock',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Sort Order',
      description: 'Lower numbers appear first. Leave empty for default ordering.',
      type: 'number',
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'category', media: 'image' },
  },
});
