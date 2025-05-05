'use client';

import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Dropdown, Avatar, Typography, Breadcrumb } from 'antd';
import { 
  HomeOutlined, 
  BuildOutlined, 
  TeamOutlined, 
  BankOutlined,
  LogoutOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getInitials } from '@/lib/utils';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

interface BreadcrumbItem {
  title: string;
  href?: string;
}

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  breadcrumbs?: BreadcrumbItem[];
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, title, breadcrumbs = [] }) => {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Menu items based on user role
  const renderMenuItems = () => {
    if (!user) return [];

    if (user.role === 'syndic' || user.role === 'admin') {
      return [
        {
          key: '/dashboard',
          icon: <DashboardOutlined />,
          label: <Link href="/dashboard">Dashboard</Link>,
        },
        {
          key: '/condos',
          icon: <BuildOutlined />,
          label: <Link href="/condos">Condomínios</Link>,
        },
        {
          key: '/units',
          icon: <HomeOutlined />,
          label: <Link href="/units">Unidades</Link>,
        },
        {
          key: '/residents',
          icon: <TeamOutlined />,
          label: <Link href="/residents">Residentes</Link>,
        },
        {
          key: '/finance',
          icon: <BankOutlined />,
          label: <Link href="/finance">Financeiro</Link>,
        },
      ];
    } else {
      return [
        {
          key: '/resident-dashboard',
          icon: <DashboardOutlined />,
          label: <Link href="/resident-dashboard">Dashboard</Link>,
        },
        {
          key: '/my-unit',
          icon: <HomeOutlined />,
          label: <Link href="/my-unit">Minha Unidade</Link>,
        },
        {
          key: '/condo-info',
          icon: <BuildOutlined />,
          label: <Link href="/condo-info">Condomínio</Link>,
        },
        {
          key: '/finance-info',
          icon: <BankOutlined />,
          label: <Link href="/finance-info">Financeiro</Link>,
        },
      ];
    }
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Perfil',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Sair',
      onClick: logout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        width={256}
        collapsedWidth={isMobile ? 0 : 80}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 10,
        }}
      >
        <div className="flex h-16 items-center justify-center bg-primary-foreground py-3">
          <Link href="/">
            <div className="flex items-center space-x-2">
              <BuildOutlined style={{ fontSize: '24px' }} />
              {!collapsed && <span className="text-xl font-bold">CondoManage</span>}
            </div>
          </Link>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          defaultSelectedKeys={['/dashboard']}
          items={renderMenuItems()}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? (isMobile ? 0 : 80) : 256, transition: 'all 0.2s' }}>
        <Header style={{ 
          padding: '0 24px', 
          background: '#fff', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          <div className="flex items-center space-x-4">
            {user && (
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <div className="flex items-center space-x-2 cursor-pointer">
                  <Avatar 
                    style={{ backgroundColor: '#1890ff' }}
                  >
                    {user.name ? getInitials(user.name) : <UserOutlined />}
                  </Avatar>
                  {!isMobile && (
                    <div>
                      <Text strong>{user.name}</Text>
                      <Text type="secondary" style={{ display: 'block', fontSize: '12px' }}>
                        {user.role === 'syndic' ? 'Síndico' : user.role === 'admin' ? 'Admin' : 'Residente'}
                      </Text>
                    </div>
                  )}
                </div>
              </Dropdown>
            )}
          </div>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
          <div style={{ marginBottom: 24 }}>
            {title && <Title level={3}>{title}</Title>}
            {breadcrumbs.length > 0 && (
              <Breadcrumb 
                style={{ margin: '16px 0' }}
                items={[
                  { title: <Link href="/dashboard">Home</Link> },
                  ...breadcrumbs.map((item) => ({
                    title: item.href ? <Link href={item.href}>{item.title}</Link> : item.title,
                  })),
                ]}
              />
            )}
          </div>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;