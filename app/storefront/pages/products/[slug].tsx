import { GetServerSideProps } from 'next';
import Header from '../../components/Header';
import ProductDetail from '../../components/ProductDetail';
import { Product } from '../../types/product';
import { CartProvider } from '../../hooks/CartContext';
import { productDetail } from '../../constant/url';

const Page = ({ product }: { product?: Product }) => {
  return (
    <CartProvider>
      <Header />
      {product && <ProductDetail product={product} />}
      {!product && <p>Product Not Found</p>}
    </CartProvider>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const res = await fetch(`${productDetail}/${params?.slug}`);
  if (!res.ok) {
    return { props: {} };
  }

  const product = await res.json();

  return {
    props: {
      product: {
        ...product,
        breadcrumbs: [
          //TODO: change this
          { id: '1', name: 'Men', href: '#' },
          { id: '2', name: 'Clothing', href: '#' },
        ],
        details: [
          //TODO: use dynamic data
          'TODO: replace with description',
        ],
      },
    },
  };
};

export default Page;
