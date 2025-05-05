'use client';

import React, { useEffect, useState } from 'react';
import { Button, Input, Spin, Space, Select, Typography } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import MainLayout from '@/components/layouts/MainLayout';
import ResidentList from '@/components/residents/ResidentList';
import { residentAPI, unitAPI, condoAPI, User, Unit, Condo } from '@/lib/api';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const { Title } = Typography;
const { Option } = Select;

export default function ResidentsPage() {
  const searchParams = useSearchParams();
  const urlUnitId = searchParams.get('unitId');
  const urlCondoId = searchParams.get('condoId');
  
  const [residents, setResidents] = useState<User[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [condos, setCondos] = useState<Condo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCondoId, setSelectedCondoId] = useState<string | null>(urlCondoId);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(urlUnitId);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  // Fetch condos
  useEffect(() => {
    const fetchCondos = async () => {
      try {
        const response = await condoAPI.getAll();
        if (response.success) {
          setCondos(response.data);
        }
      } catch (error) {
        console.error('Error fetching condos:', error);
      }
    };

    fetchCondos();
  }, []);

  // Fetch units when condo changes
  useEffect(() => {
    const fetchUnits = async () => {
      if (!selectedCondoId) {
        setUnits([]);
        return;
      }
      
      try {
        const response = await unitAPI.getByCondoId(selectedCondoId);
        if (response.success) {
          setUnits(response.data);
          
          // If we have a URL unit ID and it belongs to this condo, select it
          if (urlUnitId) {
            const unit = response.data.find(u => u._id === urlUnitId);
            if (unit) {
              setSelectedUnitId(urlUnitId);
              setSelectedUnit(unit);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching units:', error);
      }
    };

    fetchUnits();
  }, [selectedCondoId, urlUnitId]);

  // Fetch residents when unit changes
  useEffect(() => {
    const fetchResidents = async () => {
      if (!selectedUnitId) {
        setResidents([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const response = await residentAPI.getByUnitId(selectedUnitId);
        if (response.success) {
          setResidents(response.data);
        }
      } catch (error) {
        console.error('Error fetching residents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResidents();
  }, [selectedUnitId]);

  // Handle condo change
  const handleCondoChange = (value: string) => {
    setSelectedCondoId(value);
    setSelectedUnitId(null);
    setSelectedUnit(null);
  };

  // Handle unit change
  const handleUnitChange = (value: string) => {
    setSelectedUnitId(value);
    const unit = units.find(u => u._id === value);
    if (unit) {
      setSelectedUnit(unit);
    }
  };

  // Filter residents based on search term
  const filteredResidents = residents.filter(
    resident => 
      resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout 
      title="Residentes" 
      breadcrumbs={[
        { title: 'Residentes' },
        ...(selectedUnit ? [{ title: `Unidade ${selectedUnit.number}` }] : [])
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
          
          <Select
            placeholder="Selecione uma unidade"
            style={{ width: 180 }}
            value={selectedUnitId || undefined}
            onChange={handleUnitChange}
            disabled={!selectedCondoId || units.length === 0}
          >
            {units.map(unit => (
              <Option key={unit._id} value={unit._id}>
                {`Unidade ${unit.number}${unit.block ? ` - Bloco ${unit.block}` : ''}`}
              </Option>
            ))}
          </Select>
          
          <Input 
            placeholder="Buscar residentes..." 
            prefix={<SearchOutlined />} 
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 200 }}
            allowClear
            disabled={!selectedUnitId}
          />
        </Space>
        
        {selectedUnitId && (
          <Link href={`/residents/new?unitId=${selectedUnitId}`}>
            <Button type="primary" icon={<PlusOutlined />}>
              Novo Residente
            </Button>
          </Link>
        )}
      </div>

      {!selectedUnitId ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Title level={4}>Selecione um condomínio e uma unidade para ver os residentes</Title>
        </div>
      ) : loading ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" />
        </div>
      ) : (
        <ResidentList 
          residents={filteredResidents}
          unitId={selectedUnitId}
        />
      )}
    </MainLayout>
  );
}