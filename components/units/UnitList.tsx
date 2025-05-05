'use client';

import React from 'react';
import { List, Card, Typography, Tag, Skeleton, Button, Empty, Avatar } from 'antd';
import { HomeOutlined, TeamOutlined, PlusOutlined } from '@ant-design/icons';
import { Unit } from '@/lib/api';
import Link from 'next/link';

const { Title, Text } = Typography;

interface UnitListProps {
  units: Unit[];
  loading?: boolean;
  condoId?: string;
  onItemClick?: (unit: Unit) => void;
}

const UnitList: React.FC<UnitListProps> = ({
  units,
  loading = false,
  condoId,
  onItemClick,
}) => {
  if (loading) {
    return (
      <List
        grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 4 }}
        dataSource={[1, 2, 3]}
        renderItem={() => (
          <List.Item>
            <Card>
              <Skeleton active avatar paragraph={{ rows: 2 }} />
            </Card>
          </List.Item>
        )}
      />
    );
  }

  if (!units || units.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="Nenhuma unidade encontrada"
      >
        <Link href={condoId ? `/units/new?condoId=${condoId}` : '/units/new'}>
          <Button type="primary" icon={<PlusOutlined />}>
            Adicionar Unidade
          </Button>
        </Link>
      </Empty>
    );
  }

  return (
    <List
      grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 4 }}
      dataSource={units}
      renderItem={(unit) => (
        <List.Item>
          <Card
            hoverable
            onClick={() => onItemClick && onItemClick(unit)}
            actions={[
              <Link href={`/units/${unit._id}`} key="view">Ver detalhes</Link>,
              <Link href={`/residents?unitId=${unit._id}`} key="residents">Residentes</Link>,
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar 
                  icon={<HomeOutlined />} 
                  style={{ backgroundColor: '#52c41a' }}
                  size="large"
                />
              }
              title={
                <Title level={5}>
                  Unidade {unit.number}
                  {unit.block && <Tag color="blue" style={{ marginLeft: 8 }}>Bloco {unit.block}</Tag>}
                </Title>
              }
              description={
                <>
                  {unit.floor && (
                    <div>
                      <Text type="secondary">Andar: {unit.floor}</Text>
                    </div>
                  )}
                  <div style={{ marginTop: 8 }}>
                    <Text type="secondary">
                      <TeamOutlined /> {unit.residents?.length || 0} residentes
                    </Text>
                  </div>
                </>
              }
            />
          </Card>
        </List.Item>
      )}
    />
  );
};

export default UnitList;