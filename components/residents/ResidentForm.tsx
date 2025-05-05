'use client';

import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Select } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, HomeOutlined, SaveOutlined } from '@ant-design/icons';
import { residentAPI, unitAPI, Unit } from '@/lib/api';
import { useRouter } from 'next/navigation';

const { Title } = Typography;
const { Option } = Select;

interface ResidentFormProps {
  unitId?: string;
  condoId?: string;
  onSuccess?: () => void;
  title?: string;
  submitText?: string;
}

const ResidentForm: React.FC<ResidentFormProps> = ({
  unitId,
  condoId,
  onSuccess,
  title = 'Novo Residente',
  submitText = 'Salvar',
}) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loadingUnits, setLoadingUnits] = useState(false);

  useEffect(() => {
    if (unitId) {
      form.setFieldsValue({ unitId });
    }
    
    if (condoId) {
      const fetchUnits = async () => {
        setLoadingUnits(true);
        try {
          const response = await unitAPI.getByCondoId(condoId);
          if (response.success) {
            setUnits(response.data);
          }
        } catch (error) {
          console.error('Error fetching units:', error);
          message.error('Não foi possível carregar as unidades');
        } finally {
          setLoadingUnits(false);
        }
      };
      
      fetchUnits();
    }
  }, [form, unitId, condoId]);

  const onFinish = async (values: { name: string; email: string; password: string; unitId: string }) => {
    setLoading(true);
    try {
      const response = await residentAPI.register(values);
      
      if (response.success) {
        message.success('Residente registrado com sucesso!');
        form.resetFields();
        
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/residents?unitId=${values.unitId}`);
        }
      }
    } catch (error: any) {
      message.error(error.message || 'Erro ao registrar residente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card bordered={false}>
      <Title level={4} style={{ marginBottom: 24 }}>{title}</Title>
      
      <Form
        form={form}
        name="resident_form"
        layout="vertical"
        initialValues={{ unitId }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          name="name"
          label="Nome Completo"
          rules={[{ required: true, message: 'Por favor insira o nome do residente' }]}
        >
          <Input 
            prefix={<UserOutlined />} 
            placeholder="Ex: Maria Silva"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Por favor insira o email do residente' },
            { type: 'email', message: 'Por favor insira um email válido' },
          ]}
        >
          <Input 
            prefix={<MailOutlined />} 
            placeholder="Ex: maria@example.com"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Senha"
          rules={[
            { required: true, message: 'Por favor insira uma senha' },
            { min: 6, message: 'A senha deve ter pelo menos 6 caracteres' },
          ]}
        >
          <Input.Password 
            prefix={<LockOutlined />} 
            placeholder="******"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="unitId"
          label="Unidade"
          rules={[{ required: true, message: 'Por favor selecione a unidade' }]}
        >
          <Select
            placeholder="Selecione a unidade"
            loading={loadingUnits}
            disabled={!!unitId}
            size="large"
          >
            {units.map((unit) => (
              <Option key={unit._id} value={unit._id}>
                {`Unidade ${unit.number}${unit.block ? ` - Bloco ${unit.block}` : ''}`}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            icon={<SaveOutlined />}
            loading={loading}
            size="large"
          >
            {submitText}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ResidentForm;