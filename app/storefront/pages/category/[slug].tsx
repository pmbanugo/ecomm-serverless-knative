// import { useRouter } from 'next/router';
import { NextPage, GetServerSideProps } from 'next';
import { navigation } from '../../constant/navigation';
import Header from '../../components/Header';
import ProductList from '../../components/ProductList';
import { productList } from '../../constant/url';
import { CartProvider } from '../../hooks/CartContext';

const Page = ({
  products,
}: {
  products: {
    id: string;
    name: string;
    image: { url: string; alt: string };
    price: string;
  }[];
}) => {
  return (
    <CartProvider>
      <Header />
      <ProductList products={products} />
    </CartProvider>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = navigation.pages.find((x) => x.slug === params?.slug)?.id;
  // Fetch data from external API
  const res = await fetch(`${productList}/${id}`);
  const products = await res.json();

  return {
    props: {
      products: products,
    },
  };
};

export default Page;
