import React, { useState } from "react";
const data = [
  {
    image: {
      url: "https://m.media-amazon.com/images/I/81lvlQackxL._UF1000,1000_QL80_.jpg",
    },
    _id: "686a43ca7380475719862f37",
    name: "Electrician",
    createdBy: "686a41497380475719862f2f",
    isActive: true,
    createdAt: "2025-07-06T09:37:14.139Z",
    updatedAt: "2025-07-06T09:37:14.139Z",
    __v: 0,
  },
  {
    image: {
      url: "https://eeslmart.in/images/thumbs/0000392_15-tr-super-efficient-5-star-split-ac_550.jpeg",
    },
    _id: "686a41557380475719862f33",
    name: "Air Conditioner(AC)",
    createdBy: "686a41497380475719862f2f",
    isActive: true,
    createdAt: "2025-07-06T09:26:45.989Z",
    updatedAt: "2025-07-06T09:26:45.989Z",
    __v: 0,
  },
];

function Categories() {
  const [categories, setCategories] = useState(data);
  return (
    <div className="flex flex-row flex-nowrap gap-10 overflow-x-auto w-full py-2">
      {categories.map((cat, index) => (
        <div
          key={index}
          className="rounded-lg overflow-hidden flex-shrink-0 w-56"
        >
          <div className="w-full h-44">
            <img
              src={cat.image?.url}
              alt={cat.name + " image"}
              className="w-full h-full object-cover object-center"
            />
          </div>
          <h4 className="text-lg mt-3 px-3 text-center">{cat.name}</h4>
        </div>
      ))}
    </div>
  );
}

export default Categories;
