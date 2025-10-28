/**
 * 密码保护组件（已简化）
 * 不再需要密码验证，直接显示应用
 * API 安全密钥由用户在设置页面配置
 */

import { ReactNode } from 'react';

interface PasswordGateProps {
  children: ReactNode;
}

const PasswordGate: React.FC<PasswordGateProps> = ({ children }) => {
  // 直接显示应用，不需要密码验证
  return <>{children}</>;
};

export default PasswordGate;
