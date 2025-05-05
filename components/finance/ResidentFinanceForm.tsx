'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Select, InputNumber, DatePicker } from 'antd';
import { BankOutlined, DollarOutlined, SaveOutlined } from '@ant-design/icons';
import { financeAPI, FinanceRecord } from '@/lib/api';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';

const { Title } = Typography;
const { TextArea } = Input;

interface ResidentFinanceFormProps {
  onSuccess?: (record: FinanceRecord) => void;
  title?: string;
  submitText?: string;
}

const ResidentFinanceForm: React.FC<ResidentFinanceFormProps> = ({
  onSuccess,
  title = 'Novo Registro Financeiro',
  submitText = 'Salvar',
}) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: {
    type: 'income' | 'expense';
    description: string;
    amount: number;
    date: dayjs.Dayjs;
  }) => {
    setLoading(true);
    try {
      // Convert amount from reais to cents
      const amountInCents = Math.round(values.amount * 100);
      
      // Convert date to ISO string if provided
      const date = values.date ? values.date.toISOString() : undefined;
      
      const response = await financeAPI.create({
        ...values,
        amount: amountInCents,
        date,
      });
      
      if (response.success) {
        message.success('Registro financeiro criado com sucesso!');
        form.resetFields();
        
        if (onSuccess) {
          onSuccess(response.data);
        } else {
          router.push('/finance-info');
        }
      }
    } catch (error: any) {
      message.error(error.message || 'Erro ao criar registro financeiro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card bordered={false}>
      <Title level={4} style={{ marginBottom: 24 }}>{title}</Title>
      
      <Form
        form={form}
        name="finance_form"
        layout="vertical"
        initialValues={{ 
          type: 'income',
          date: dayjs(),
        }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          name="type"
          label="Tipo"
          rules={[{ required: true, message: 'Por favor selecione o tipo' }]}
        >
          <Select size="large">
            <Select.Option value="income">Receita</Select.Option>
            <Select.Option value="expense">Despesa</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          label="Descrição"
          rules={[{ required: true, message: 'Por favor insira a descrição' }]}
        >
          <TextArea 
            placeholder="Ex: Contribuição mensal"
            rows={2}
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="amount"
          label="Valor (R$)"
          rules={[{ required: true, message: 'Por favor insira o valor' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            formatter={(value) => `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
            parser={(value) => value!.replace(/R\$\s?|(\.)/g, '')}
            precision={2}
            min={0}
            step={0.01}
            size="large"
            prefix={<DollarOutlined />}
          />
        </Form.Item>

        <Form.Item
          name="date"
          label="Data"
        >
          <DatePicker 
            style={{ width: '100%' }}
            format="DD/MM/YYYY"
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

export default ResidentFinanceForm;