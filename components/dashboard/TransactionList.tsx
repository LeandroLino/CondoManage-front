'use client';

import React from 'react';
import { List, Card, Typography, Tag, Empty, Skeleton, Avatar } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { FinanceRecord } from '@/lib/api';
import { formatCurrency, formatShortDate } from '@/lib/utils';

const { Title, Text } = Typography;

interface TransactionListProps {
  transactions: FinanceRecord[];
  loading?: boolean;
  title?: string;
  emptyText?: string;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  loading = false,
  title = 'Transações Recentes',
  emptyText = 'Nenhuma transação encontrada'
}) => {
  if (loading) {
    return (
      <Card bordered={false}>
        <Title level={5}>{title}</Title>
        <List
          itemLayout="horizontal"
          dataSource={[1, 2, 3]}
          renderItem={() => (
            <List.Item>
              <Skeleton active avatar paragraph={{ rows: 1 }} />
            </List.Item>
          )}
        />
      </Card>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Card bordered={false}>
        <Title level={5}>{title}</Title>
        <Empty description={emptyText} />
      </Card>
    );
  }

  return (
    <Card bordered={false}>
      <Title level={5}>{title}</Title>
      <List
        itemLayout="horizontal"
        dataSource={transactions}
        renderItem={(item) => (
          <List.Item
            extra={
              <div style={{ textAlign: 'right' }}>
                <Text 
                  style={{ 
                    fontSize: '16px', 
                    fontWeight: 'bold',
                    color: item.type === 'income' ? '#52c41a' : '#f5222d'
                  }}
                >
                  {item.type === 'income' ? '+ ' : '- '}
                  {formatCurrency(item.amount)}
                </Text>
                <div>
                  <Text type="secondary">{formatShortDate(item.date)}</Text>
                </div>
              </div>
            }
          >
            <List.Item.Meta
              avatar={
                <Avatar 
                  style={{ 
                    backgroundColor: item.type === 'income' ? '#d9f7be' : '#ffccc7',
                    color: item.type === 'income' ? '#52c41a' : '#f5222d'
                  }}
                >
                  {item.type === 'income' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                </Avatar>
              }
              title={item.description}
              description={
                <Tag color={item.type === 'income' ? 'success' : 'error'}>
                  {item.type === 'income' ? 'Receita' : 'Despesa'}
                </Tag>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default TransactionList;