import { useEffect, useState } from "react";
import type { Product } from "../types/types";
import { API_BASE_URL } from "../constants/baseUrl";
import { Box } from "@mui/material";
import ProductsCard from "./ProductsCard";
import PsProductsCard from "./PsProductsCard";
import XbProductsCard from "./XbProductsCard";

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryP, setCategoryP] = useState<Product[]>([]);
  // add categoryX later
  const [, setCategoryX] = useState<Product[]>([]);
  const [, setCategoryN] = useState<Product[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/home/`);
        const resP = await fetch(`${API_BASE_URL}/api/filter/?category=PlayStation`);
        const resX = await fetch(`${API_BASE_URL}/api/filter/?category=Xbox`);
        const resN = await fetch(`${API_BASE_URL}/api/filter/?category=Nintendo Switch`);
        const data = await response.json();
        const dataP = await resP.json();
        const dataX = await resX.json();
        const dataN = await resN.json();
        setCategoryN(dataN);
        setCategoryX(dataX);
        setProducts(data); // Extract the results array
        setCategoryP(dataP); // Assuming category is part of the response
      } catch {
        setError(true);
      }
    };

    fetchData();
  }, []);
  
  if (error) {
    return <Box>Something went wrong, please try again!</Box>;
  }

  return (
    <div>
      <ProductsCard products={products} />
      <PsProductsCard products={categoryP} />
      <XbProductsCard products={categoryP} />

    </div>
  );
};

export default HomePage;
