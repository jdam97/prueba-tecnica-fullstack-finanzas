import { GetServerSideProps } from 'next';

//Redirecciono al login al iniciar la app
export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/login',
      permanent: false,
    },
  };
};

export default function Home() {
  return null;
}