'use client';

import ErrorComponent from '@/components/Error';

export default function ErrorBoundary({ error }: { error: Error }) {
  return (
    <ErrorComponent title="We ran into a problem" message={error.message} />
  );
}
