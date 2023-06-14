import { Box, Typography } from '@mui/material';
import { GetServerSideProps } from 'next';
import useSWR from 'swr';
import TablesInArea from '@/components/tables/TablesInArea';
import { ITableArea, ITableRestaurant } from '@/models/models';
import { fetchTableAreas, fetchTables } from '@/services/publicApi';

interface TablePageProps {
  tableAreas: ITableArea[];
  tables: ITableRestaurant[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  const tableAreas = await fetchTableAreas();
  return { props: { tableAreas } };
};

export default function TablePage({ tableAreas }: TablePageProps) {
  const { data: tables, error } = useSWR('fetchTables', fetchTables);

  if (error) return <div>Failed to load tables</div>;
  if (!tables) return <div>Loading tables...</div>;

  return (
    <Box p={4}>
      <Typography variant="h2" align="center" sx={{ mb: 4, fontWeight: 'bold', color: '#333' }}>
        All Table Areas
      </Typography>

      {tableAreas.map((tableArea) => {
        const tablesInArea = tables.filter(
          (table) => table.tableAreaId === tableArea.id
        );

        return (
          <Box key={tableArea.id} mb={4} boxShadow={2} p={3} bgcolor="white">
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
              {tableArea.areaName}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: 14, mb: 2 }}>
              {tableArea.areaDescription}
            </Typography>
            
            {tablesInArea.length === 0 ? (
              <Typography variant="body1" textAlign="center">
                No tables in this area
              </Typography>
            ) : (
              <TablesInArea tablesInArea={tablesInArea} />
            )}
          </Box>
        );
      })}
    </Box>
  );
}