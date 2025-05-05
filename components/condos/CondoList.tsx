'use client';

import React from 'react';
import { List, Card, Typography, Skeleton, Avatar, Button, Empty } from 'antd';
import { BuildOutlined, HomeOutlined, PlusOutlined } from '@ant-design/icons';
import { Condo } from '@/lib/api';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

const { Title, Text } = Typography;

interface CondoListProps {
  condos: Condo[];
  loading?: boolean;
  onItemClick?: (condo: Condo) => void;
}

const CondoList: React.FC<CondoListProps> = ({
  condos,
  loading = false,
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

  if (!condos || condos.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="Nenhum condomínio encontrado"
      >
        <Link href="/condos/new">
          <Button type="primary" icon={<PlusOutlined />}>
            Adicionar Condomínio
          </Button>
        </Link>
      </Empty>
    );
  }

  return (
    <List
      grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 4 }}
      dataSource={condos}
      renderItem={(condo) => (
        <List.Item>
          <Card
            hoverable
            onClick={() => onItemClick && onItemClick(condo)}
            actions={[
              <Link href={`/condos/${condo._id}`} key="view">Ver detalhes</Link>,
              <Link href={`/units?condoId=${condo._id}`} key="units">Unidades</Link>,
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar 
                  icon={<BuildOutlined />} 
                  style={{ backgroundColor: '#1890ff' }}
                  size="large"
                />
              }
              title={<Title level={5}>{condo.name}</Title>}
              description={
                <>
                  <div>
                    <Text type="secondary"><HomeOutlined /> {condo.address}</Text>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <Text type="secondary">Criado em: {formatDate(condo.createdAt)}</Text>
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

export default CondoList;