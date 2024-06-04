import { Loader } from '@/components/Loader';

export default async function Loading() {
  return (
    <Loader classes="h-[calc(100vh-100px)] w-full absolute top-0 left-0">
      <Loader.Logo />
      <Loader.Text text="Loading" />
    </Loader>
  );
}
