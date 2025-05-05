'use client';

import React from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { HomeOutlined, EnvironmentOutlined, SaveOutlined } from '@ant-design/icons';
import { condoAPI, Condo } from '@/lib/api';
import { useRouter } from 'next/navigation';

const { Title } = Typography;

interface CondoFormProps {
  initialValues?: Partial<Condo>;
  onSuccess?: (condo: Condo) => void;
  title?: string;
  submitText?: string;
}

const CondoForm: React.FC<CondoFormProps> = ({
  initialValues,
  onSuccess,
  title = 'Novo Condomínio',
  submitText = 'Salvar',
}) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values: { name: string; address: string }) => {
    setLoading(true);
    try {
      const response = await condoAPI.create(values);
      
      if (response.success) {
        message.success('Condomínio criado com sucesso!');
        form.resetFields();
        
        if (onSuccess) {
          onSuccess(response.data);
        } else {
          router.push('/condos');
        }
      }
    } catch (error: any) {
      message.error(error.message || 'Erro ao criar condomínio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card bordered={false}>
      <Title level={4} style={{ marginBottom: 24 }}>{title}</Title>
      
      <Form
        form={form}
        name="condo_form"
        layout="vertical"
        initialValues={initialValues}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          name="name"
          label="Nome do Condomínio"
          rules={[{ required: true, message: 'Por favor insira o nome do condomínio' }]}
        >
          <Input 
            prefix={<HomeOutlined />} 
            placeholder="Ex: Residencial Solar"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="address"
          label="Endereço"
          rules={[{ required: true, message: 'Por favor insira o endereço do condomínio' }]}
        >
          <Input 
            prefix={<EnvironmentOutlined />} 
            placeholder="Ex: Rua das Flores, 123"
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

export default CondoForm;