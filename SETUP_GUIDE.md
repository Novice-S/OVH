# 🚀 OVH Phantom Sniper - 设置指南

## 📋 快速开始

### 步骤 1：后端配置

在 `backend/.env` 文件中配置（如果没有，创建一个）：

```env
# API 安全密钥（用于前后端通信验证）
API_SECRET_KEY=your-secret-key-here

# 其他配置（可选）
PORT=5000
DEBUG=false
```

**生成安全密钥：**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 步骤 2：启动后端

```bash
cd backend

# 安装依赖
pip install -r requirements.txt

# 启动
python app.py
```

### 步骤 3：启动前端

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 步骤 4：配置应用

1. 访问 `http://localhost:5173`
2. 进入 **设置** 页面
3. 填写配置：
   - **网站安全密钥**：复制 `.env` 文件中的 `API_SECRET_KEY`
   - **OVH API 凭据**：从 https://api.ovh.com/createToken/ 获取

---

## 🔐 安全配置说明

### 网站安全密钥（API_SECRET_KEY）

**用途：** 用于验证前后端通信，防止未授权访问

**配置位置：**
- 后端：`backend/.env` 文件
- 前端：设置页面输入（存储在 localStorage）

**重要：** 前后端的密钥必须一致！

---

## 📝 配置项说明

### 必须配置

1. **API_SECRET_KEY** - 网站安全密钥
   - 在 backend/.env 文件中设置
   - 在前端设置页面输入相同的值

2. **OVH API 凭据**
   - APP_KEY
   - APP_SECRET
   - CONSUMER_KEY

### 可选配置

- **Telegram 通知**
  - TG_TOKEN
  - TG_CHAT_ID

- **区域设置**
  - ZONE（默认：IE）
  - IAM（默认：go-ovh-ie）

---

## ✅ 安全优势

### 之前（不安全）❌

```typescript
// constants.ts - 硬编码在前端，任何人都能看到
export const API_SECRET_KEY = 'ovh-phantom-sniper-2024-secret-key';
export const FRONTEND_PASSWORD = 'admin123';
```

### 现在（安全）✅

```typescript
// apiClient.ts - 从 localStorage 读取
const apiKey = getApiSecretKey();  // 用户在设置页面输入
```

**改进：**
- ✅ 密钥不再硬编码在代码中
- ✅ 每个用户可以设置自己的密钥
- ✅ 密钥存储在 localStorage（浏览器本地）
- ✅ 后端在 .env 文件中管理（服务器端）
- ✅ 更换密钥无需重新构建应用

---

## 🎯 配置流程

```
1. 后端 .env 设置密钥
   ↓
2. 启动后端
   ↓
3. 启动前端
   ↓
4. 打开设置页面
   ↓
5. 输入相同的密钥
   ↓
6. 密钥存储到 localStorage
   ↓
7. 所有 API 请求自动带上密钥
   ↓
8. 后端验证密钥
```

---

## 🔧 配置文件结构

### backend/.env
```env
# 最小化配置
API_SECRET_KEY=<你的安全密钥>
PORT=5000
```

### 前端（无需配置文件）
- 所有配置在设置页面完成
- 数据存储在 localStorage

---

## ⚠️ 重要提示

1. **不要泄露密钥**
   - API_SECRET_KEY 是唯一的保护措施
   - 不要将其提交到 Git
   - 定期更换密钥

2. **备份配置**
   - 定期备份 `backend/.env`
   - 导出设置页面的配置

3. **生产环境**
   - 使用强密钥（至少32字符）
   - 关闭 DEBUG 模式
   - 使用 HTTPS

---

## 🐛 常见问题

### Q: API 请求失败，提示"认证失败"

**A:** 检查前端设置的密钥是否与后端 `.env` 中的一致

```bash
# 1. 查看后端密钥
cat backend/.env | grep API_SECRET_KEY

# 2. 在前端设置页面确认密钥
# 3. 确保完全一致（包括大小写）
```

### Q: 如何更换密钥？

**A:** 
1. 生成新密钥：`python -c "import secrets; print(secrets.token_urlsafe(32))"`
2. 更新 `backend/.env` 文件
3. 重启后端
4. 在前端设置页面更新密钥

### Q: 忘记了密钥怎么办？

**A:** 查看 `backend/.env` 文件即可

---

## 📊 文件说明

### 核心文件

| 文件 | 说明 |
|-----|------|
| `backend/.env` | 后端配置（密钥、端口等） |
| `backend/api_key_config.py` | API 密钥验证配置 |
| `src/utils/apiClient.ts` | API 客户端（从 localStorage 读取密钥） |
| `src/pages/SettingsPage.tsx` | 设置页面（配置密钥和 OVH API） |

---

## ✨ 使用建议

1. **首次使用**
   - 先配置后端 `.env` 文件
   - 启动后端和前端
   - 在设置页面完成配置

2. **日常使用**
   - 密钥会自动保存
   - 无需每次输入

3. **团队使用**
   - 每个人可以使用自己的密钥
   - 或者统一管理密钥

---

**更新日期：** 2024-10-28  
**版本：** 2.1.0 - 简化配置系统

