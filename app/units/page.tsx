'use client';

import React, { useEffect, useState } from 'react';
import { Button, Input, Spin, Space, Select, Typography } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import MainLayout from '@/components/layouts/MainLayout';
import UnitList from '@/components/units/UnitList';
import { unitAPI, condoAPI, Unit, Condo } from '@/lib/api';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const { Title } = Typography;
const { Option } = Select;

export default function UnitsPage() {
  const searchParams = useSearchParams();
  const urlCondoId = searchParams.get('condoId');
  
  const [units, setUnits] = useState<Unit[]>([]);
  const [condos, setCondos] = useState<Condo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCondoId, setSelectedCondoId] = useState<string | null>(urlCondoId);
  const [selectedCondo, setSelectedCondo] = useState<Condo | null>(null);

  useEffect(() => {
    const fetchCondos = async () => {
      try {
        const response = await condoAPI.getAll();
        if (response.success) {
          setCondos(response.data);
          
          if (urlCondoId) {
            const condo = response.data.find(c => c._id === urlCondoId);
            if (condo) {
              setSelectedCondo(condo);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching condos:', error);
      }
    };

    fetchCondos();
  }, [urlCondoId]);

  useEffect(() => {
    const fetchUnits = async () => {
      if (!selectedCondoId) {
        setUnits([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const response = await unitAPI.getByCondoId(selectedCondoId);
        if (response.success) {
          setUnits(response.data);
        }
      } catch (error) {
        console.error('Error fetching units:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnits();
  }, [selectedCondoId]);

  // Handle condo change
  const handleCondoChange = (value: string) => {
    setSelectedCondoId(value);
    const condo = condos.find(c => c._id === value);
    if (condo) {
      setSelectedCondo(condo);
    }
  };

  // Filter units based on search term
  const filteredUnits = units.filter(
    unit => 
      unit.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (unit.block && unit.block.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <MainLayout 
      title="Unidades" 
      breadcrumbs={[
        { title: 'Unidades' },
        ...(selectedCondo ? [{ title: selectedCondo.name }] : [])
      ]}
    >
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <Space size="middle" wrap>
          <Select
            placeholder="Selecione um condomínio"
            style={{ width: 250 }}
            value={selectedCondoId || undefined}
            onChange={handleCondoChange}
          >
            {condos.map(condo => (
              <Option key={condo._id} value={condo._id}>{condo.name}</Option>
            ))}
          </Select>
          
          <Input 
            placeholder="Buscar unidades..." 
            prefix={<SearchOutlined />} 
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 200 }}
            allowClear
            disabled={!selectedCondoId}
          />
        </Space>
        
        {selectedCondoId && (
          <Link href={`/units/new?condoId=${selectedCondoId}`}>
            <Button type="primary" icon={<PlusOutlined />}>
              Nova Unidade
            </Button>
          </Link>
        )}
      </div>

      {!selectedCondoId ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Title level={4}>Selecione um condomínio para ver as unidades</Title>
        </div>
      ) : loading ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" />
        </div>
      ) : (
        <UnitList 
          units={filteredUnits}
          condoId={selectedCondoId}
        />
      )}
    </MainLayout>
  );
}