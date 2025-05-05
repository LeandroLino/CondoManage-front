'use client';

import React from 'react';
import { List, Card, Typography, Tag, Skeleton, Button, Empty, Avatar } from 'antd';
import { UserOutlined, MailOutlined, PlusOutlined } from '@ant-design/icons';
import { User } from '@/lib/api';
import Link from 'next/link';
import { getInitials } from '@/lib/utils';

const { Title, Text } = Typography;

interface ResidentListProps {
  residents: User[];
  loading?: boolean;
  unitId?: string;
  onItemClick?: (resident: User) => void;
}

const ResidentList: React.FC<ResidentListProps> = ({
  residents,
  loading = false,
  unitId,
  onItemClick,
}) => {
  if (loading) {
    return (
      <List
        itemLayout="horizontal"
        dataSource={[1, 2, 3]}
        renderItem={() => (
          <List.Item>
            <Skeleton active avatar paragraph={{ rows: 1 }} />
          </List.Item>
        )}
      />
    );
  }

  if (!residents || residents.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="Nenhum residente encontrado"
      >
        {unitId && (
          <Link href={`/residents/new?unitId=${unitId}`}>
            <Button type="primary" icon={<PlusOutlined />}>
              Adicionar Residente
            </Button>
          </Link>
        )}
      </Empty>
    );
  }

  return (
    <List
      itemLayout="horizontal"
      dataSource={residents}
      renderItem={(resident) => (
        <List.Item
          actions={[
            <Link href={`/residents/${resident._id}`} key="view">Ver detalhes</Link>,
          ]}
        >
          <List.Item.Meta
            avatar={
              <Avatar 
                style={{ backgroundColor: '#722ed1' }}
                size="large"
              >
                {getInitials(resident.name)}
              </Avatar>
            }
            title={<Title level={5}>{resident.name}</Title>}
            description={
              <>
                <div>
                  <Text type="secondary"><MailOutlined /> {resident.email}</Text>
                </div>
                <div style={{ marginTop: 4 }}>
                  <Tag color="purple">{resident.role === 'resident' ? 'Residente' : resident.role === 'syndic' ? 'Síndico' : 'Admin'}</Tag>
                </div>
              </>
            }
          />
        </List.Item>
      )}
    />
  );
};

export default ResidentList;