// /pages/Shop.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import bookCover from '../assets/budget-book-cover.png'; // Make sure this image exists in src/assets

const ProductCard = ({ title, description, price, image, buyLink }) => (
  <div className="bg-white shadow-md rounded-lg overflow-hidden p-4 hover:shadow-xl transition">
    <img src={image} alt={title} className="w-full h-64 object-cover rounded mb-4" />
    <h3 className="text-xl font-bold text-primary mb-2">{title}</h3>
    <p className="text-neutral-dark mb-2">{description}</p>
    <p className="font-semibold mb-4">${price}</p>
    <a
      href={buyLink}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-secondary text-white px-4 py-2 rounded hover:bg-primary transition"
    >
      Buy Now on Amazon
    </a>
  </div>
);

export default function Shop() {
  const products = [
    {
      title: "Easy Finance Tools – Budgeting Book",
      description: "A clean, minimalist A4-sized planner for budgeting, saving, and tracking your financial goals.",
      price: "14.99",
      image: bookCover,
      buyLink: "https://a.co/d/61iS1lQ"
    },
    // You can add more products below...
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-primary mb-6">Shop Our Tools</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((item, i) => (
          <ProductCard key={i} {...item} />
        ))}
      </div>
    </div>
  );
}
