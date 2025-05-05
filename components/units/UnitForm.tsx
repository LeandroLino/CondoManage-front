'use client';

import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Select } from 'antd';
import { HomeOutlined, NumberOutlined, SaveOutlined, BuildOutlined } from '@ant-design/icons';
import { unitAPI, condoAPI, Condo, Unit } from '@/lib/api';
import { useRouter } from 'next/navigation';

const { Title } = Typography;
const { Option } = Select;

interface UnitFormProps {
  initialValues?: Partial<Unit>;
  condoId?: string;
  onSuccess?: (unit: Unit) => void;
  title?: string;
  submitText?: string;
}

const UnitForm: React.FC<UnitFormProps> = ({
  initialValues,
  condoId,
  onSuccess,
  title = 'Nova Unidade',
  submitText = 'Salvar',
}) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [condos, setCondos] = useState<Condo[]>([]);
  const [loadingCondos, setLoadingCondos] = useState(false);

  useEffect(() => {
    if (condoId) {
      form.setFieldsValue({ condoId });
    }
    
    const fetchCondos = async () => {
      setLoadingCondos(true);
      try {
        const response = await condoAPI.getAll();
        if (response.success) {
          setCondos(response.data);
        }
      } catch (error) {
        console.error('Error fetching condos:', error);
        message.error('Não foi possível carregar os condomínios');
      } finally {
        setLoadingCondos(false);
      }
    };
    
    fetchCondos();
  }, [form, condoId]);

  const onFinish = async (values: { number: string; block?: string; floor?: string; condoId: string }) => {
    setLoading(true);
    try {
      const response = await unitAPI.create(values);
      
      if (response.success) {
        message.success('Unidade criada com sucesso!');
        form.resetFields();
        
        if (onSuccess) {
          onSuccess(response.data);
        } else {
          router.push(`/units?condoId=${values.condoId}`);
        }
      }
    } catch (error: any) {
      message.error(error.message || 'Erro ao criar unidade');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card bordered={false}>
      <Title level={4} style={{ marginBottom: 24 }}>{title}</Title>
      
      <Form
        form={form}
        name="unit_form"
        layout="vertical"
        initialValues={{ ...initialValues, condoId }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          name="condoId"
          label="Condomínio"
          rules={[{ required: true, message: 'Por favor selecione o condomínio' }]}
        >
          <Select
            placeholder="Selecione o condomínio"
            loading={loadingCondos}
            disabled={!!condoId}
            size="large"
          >
            {condos.map((condo) => (
              <Option key={condo._id} value={condo._id}>
                {condo.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="number"
          label="Número da Unidade"
          rules={[{ required: true, message: 'Por favor insira o número da unidade' }]}
        >
          <Input 
            prefix={<NumberOutlined />} 
            placeholder="Ex: 101"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="block"
          label="Bloco"
        >
          <Input 
            prefix={<BuildOutlined />} 
            placeholder="Ex: A"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="floor"
          label="Andar"
        >
          <Input 
            prefix={<HomeOutlined />} 
            placeholder="Ex: 1"
            size="large"
          />
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

export default UnitForm;