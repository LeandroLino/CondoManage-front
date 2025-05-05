'use client';

import React, { useEffect, useState } from 'react';
import { Button, Input, Spin, Space } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import MainLayout from '@/components/layouts/MainLayout';
import CondoList from '@/components/condos/CondoList';
import { condoAPI, Condo } from '@/lib/api';
import Link from 'next/link';

export default function CondosPage() {
  const [condos, setCondos] = useState<Condo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCondos = async () => {
      try {
        const response = await condoAPI.getAll();
        if (response.success) {
          setCondos(response.data);
        }
      } catch (error) {
        console.error('Error fetching condos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCondos();
  }, []);

  // Filter condos based on search term
  const filteredCondos = condos.filter(
    condo => 
      condo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      condo.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout 
      title="Condomínios" 
      breadcrumbs={[{ title: 'Condomínios' }]}
    >
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <Input 
          placeholder="Buscar condomínios..." 
          prefix={<SearchOutlined />} 
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: 300 }}
          allowClear
        />
        <Link href="/condos/new">
          <Button type="primary" icon={<PlusOutlined />}>
            Novo Condomínio
          </Button>
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" />
        </div>
      ) : (
        <CondoList 
          condos={filteredCondos} 
        />
      )}
    </MainLayout>
  );
}