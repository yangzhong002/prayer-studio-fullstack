import { GenerationForm } from '@/components/GenerationForm';
import { fetchStyles } from '@/lib/api';

export default async function HomePage() {
  const styles = await fetchStyles();
  return <GenerationForm styles={styles} />;
}
