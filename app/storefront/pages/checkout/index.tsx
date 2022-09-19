import { NextPage, GetServerSideProps } from 'next';
import Header from '../../components/Header';
import Checkout from '../../components/Checkout';
import { CartProvider } from '../../hooks/CartContext';

const Page = () => {
  return (
    <CartProvider>
      <Header />
      <Checkout />
    </CartProvider>
  );
};

export default Page;
