import { CatalogScreen } from '@/src/features/catalog';
import { CatalogProvider } from '@/src/features/catalog/contexts/CatalogContext';

function CatalogRoute() {
  return (
    <CatalogProvider>
      <CatalogScreen />
    </CatalogProvider>
  );
}

export default CatalogRoute;
